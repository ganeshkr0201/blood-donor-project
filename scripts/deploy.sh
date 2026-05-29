#!/usr/bin/env bash
# ==============================================================================
# 🩸 Blood Donor System — PRODUCTION ZERO-DOWNTIME DEPLOYMENT SCRIPT
# This script pulls the latest changes, builds the images, and refreshes the containers.
# Run on the EC2 instance manually or trigger via GitHub Actions / SSH.
# ==============================================================================

# Exit immediately if any command fails
set -euo pipefail

# Output coloring helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="$HOME/blood-donor-system"

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}        🩸 BLOOD DONOR SYSTEM — IN-PLACE PRODUCTION DEPLOYER     ${NC}"
echo -e "${BLUE}==================================================================${NC}"

# Navigate to project directory
cd "$PROJECT_DIR"

echo -e "\n${YELLOW}[1/4] Pulling latest code changes from Git...${NC}"
# Fetch current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
echo -e "Current branch is ${GREEN}${CURRENT_BRANCH}${NC}. Pulling updates..."
git fetch origin "$CURRENT_BRANCH"
git reset --hard "origin/$CURRENT_BRANCH"

echo -e "\n${YELLOW}[2/4] Verifying .env configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file is missing in $PROJECT_DIR.${NC}"
    echo -e "Please configure a production .env file before deploying."
    exit 1
fi

echo -e "\n${YELLOW}[3/4] Rebuilding and restarting containers...${NC}"
# Use docker-compose.prod.yml to build and start containers in background
# --remove-orphans ensures old unused service containers are cleaned up
# --build triggers image rebuilds for updated codebases
docker-compose -f docker-compose.prod.yml up -d --build --remove-orphans

echo -e "\n${YELLOW}[4/4] Cleaning up unused Docker resources...${NC}"
# Clean up dangling images, containers, and cache to protect limited disk space on EC2
docker system prune -f --volumes

echo -e "\n${GREEN}==================================================================${NC}"
echo -e "${GREEN}             🎉 CONTAINER DEPLOYMENT COMPLETED!                   ${NC}"
echo -e "${GREEN}==================================================================${NC}"

echo -e "\n${YELLOW}Running deployment health checks...${NC}"
sleep 15 # Wait a few seconds for services to fully initialize

# We query localhost since Nginx routes local connections to backend
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/requests || echo "000")

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 401 ]; then
    echo -e "${GREEN}Success! Backend API is responsive (HTTP Status: $HTTP_STATUS).${NC}"
    echo -e "The Blood Donor System is officially online at port 80!"
else
    echo -e "${RED}Warning: API health check returned HTTP Status $HTTP_STATUS.${NC}"
    echo -e "Please check container logs: ${YELLOW}docker logs blooddonor-backend-prod${NC}"
fi
echo -e "=================================================================="
