#!/usr/bin/env bash
# ==============================================================================
# 🩸 Blood Donor System — AWS EC2 INITIAL SETUP SCRIPT
# This script installs Git, Docker, and Docker Compose on a new EC2 instance.
# Supports Amazon Linux 2, Amazon Linux 2023, and Ubuntu.
# ==============================================================================

# Exit immediately if any command fails
set -euo pipefail

# Output coloring helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}       🩸 BLOOD DONOR SYSTEM — AWS EC2 ONE-CLICK INITIALIZER      ${NC}"
echo -e "${BLUE}==================================================================${NC}"

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    echo -e "Detected OS: ${GREEN}${OS}${NC}"
else
    echo -e "${RED}Error: Cannot detect operating system. Exiting.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[1/4] Updating system packages...${NC}"
if [ "$OS" = "ubuntu" ]; then
    sudo apt-get update -y && sudo apt-get upgrade -y
    sudo apt-get install -y curl git jq
else
    # Amazon Linux / CentOS / RHEL
    sudo dnf update -y
    sudo dnf install -y curl git jq
fi

echo -e "\n${YELLOW}[2/4] Installing Docker Engine...${NC}"
if [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y docker.io
else
    sudo dnf install -y docker
fi

echo -e "Starting and enabling Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Allow current user to run Docker without sudo (needs shell restart to take effect)
echo -e "Adding current user ($(whoami)) to the docker group..."
sudo usermod -aG docker "$(whoami)"

echo -e "\n${YELLOW}[3/4] Installing Docker Compose v2...${NC}"
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r '.tag_name')
echo -e "Downloading Docker Compose version ${GREEN}${COMPOSE_VERSION}${NC}..."
sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Double check versions
echo -e "\nVerification:"
docker --version
docker-compose --version

echo -e "\n${YELLOW}[4/4] Setting up directory structures...${NC}"
TARGET_DIR="$HOME/blood-donor-system"

if [ -d "$TARGET_DIR" ]; then
    echo -e "Directory ${GREEN}$TARGET_DIR${NC} already exists."
else
    echo -e "Creating target application directory: ${GREEN}$TARGET_DIR${NC}..."
    mkdir -p "$TARGET_DIR"
fi

# Set up template environment variables if .env doesn't exist yet
ENV_FILE="$TARGET_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "\nCreating default production ${GREEN}.env${NC} file..."
    
    # Generate a strong JWT Secret
    JWT_SECRET_GEN=$(openssl rand -hex 32)
    DB_PASS_GEN=$(openssl rand -hex 16)
    
    cat <<EOF > "$ENV_FILE"
# ==============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# ==============================================================================
DB_USERNAME=postgres
DB_PASSWORD=${DB_PASS_GEN}
JWT_SECRET=${JWT_SECRET_GEN}
JWT_EXPIRATION=86400000
CORS_ORIGINS=*
EOF
    echo -e "${GREEN}Created production .env file at $ENV_FILE!${NC}"
    echo -e "Generated highly-secure passwords automatically."
else
    echo -e "Production ${GREEN}.env${NC} file already exists. Skipping creation."
fi

echo -e "\n${GREEN}==================================================================${NC}"
echo -e "${GREEN}                      🎉 SETUP COMPLETED!                         ${NC}"
echo -e "${GREEN}==================================================================${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Log out and log back in to apply Docker group permissions: ${GREEN}exit${NC}"
echo -e "2. Clone your git repository into: ${GREEN}$TARGET_DIR${NC}"
echo -e "3. Run your deployment using: ${GREEN}docker-compose -f docker-compose.prod.yml up -d --build${NC}"
echo -e "=================================================================="
