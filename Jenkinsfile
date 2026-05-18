// ============================================================
// JENKINSFILE — CD Pipeline (Continuous Deployment)
//
// Responsibility: BUILD DOCKER IMAGES AND DEPLOY ONLY
//   Assumes code is already tested by GitHub Actions CI.
//   Jenkins picks up the code and deploys it to the server.
//
// Stages:
//   1. Checkout         — Get the source code
//   2. Build Images     — Build Docker images for backend and frontend
//   3. Deploy           — Stop old containers, start new ones
//   4. Health Check     — Verify the app is running
// ============================================================

pipeline {

    agent any

    stages {

        // STAGE 1: Get the latest source code
        stage('Checkout') {
            steps {
                echo 'Getting source code...'
                checkout scm
            }
        }

        // STAGE 2: Build Docker images
        // This packages the backend JAR and React build inside Docker
        // No separate compile/test step — that is GitHub Actions job
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t blooddonor-backend:latest ./backend'
                sh 'docker build -t blooddonor-frontend:latest ./frontend'
                echo 'Docker images built successfully'
            }
        }

        // STAGE 3: Deploy using Docker Compose
        // Stop old running containers and start fresh ones
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Remove old containers if they exist
                sh 'docker stop blooddonor-postgres blooddonor-backend blooddonor-frontend || true'
                sh 'docker rm blooddonor-postgres blooddonor-backend blooddonor-frontend || true'
                // Start all app containers fresh
                sh 'docker compose -f /workspace/docker-compose.yml up -d postgres backend frontend'
                sh 'sleep 15'
                sh 'docker compose -f /workspace/docker-compose.yml ps'
            }
        }

        // STAGE 4: Verify the app is actually running
        stage('Health Check') {
            steps {
                echo 'Checking if app is running...'
                sh '''
                    for i in 1 2 3 4 5; do
                        if curl -sf http://localhost:8080/api/requests; then
                            echo "App is UP and running!"
                            break
                        fi
                        echo "Waiting... attempt $i of 5"
                        sleep 10
                    done
                '''
            }
        }
    }

    post {
        success {
            echo 'DEPLOYMENT SUCCESSFUL — App running at http://localhost:3000'
        }
        failure {
            echo 'DEPLOYMENT FAILED — Stopping containers'
            sh 'docker stop blooddonor-postgres blooddonor-backend blooddonor-frontend || true'
        }
        always {
            cleanWs()
        }
    }
}
