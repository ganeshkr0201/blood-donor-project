// ============================================================
// JENKINSFILE — CD Pipeline (Continuous Deployment)
//
// What it does:
//   Jenkins runs this pipeline to BUILD and DEPLOY the app locally.
//   It runs inside a Docker container on your machine.
//
// Stages:
//   1. Checkout   — Get the source code
//   2. Build      — Compile backend + build frontend
//   3. Test       — Run backend unit tests
//   4. Docker     — Build Docker images
//   5. Deploy     — Start all containers with docker-compose
//   6. Verify     — Check the app is running
// ============================================================

pipeline {

    // Run on any available Jenkins agent
    agent any

    // ── Stage definitions ─────────────────────────────────────
    stages {

        // STAGE 1: Get the source code
        stage('Checkout') {
            steps {
                echo 'Getting source code...'
                checkout scm
            }
        }

        // STAGE 2: Build backend and frontend
        stage('Build') {
            parallel {

                // Build Spring Boot backend
                stage('Build Backend') {
                    steps {
                        echo 'Compiling Spring Boot backend...'
                        dir('backend') {
                            sh 'mvn clean compile -B -q'
                        }
                    }
                }

                // Build React frontend
                stage('Build Frontend') {
                    steps {
                        echo 'Building React frontend...'
                        dir('frontend') {
                            sh 'npm install --silent'
                            sh 'CI=false npm run build'
                        }
                    }
                }
            }
        }

        // STAGE 3: Run backend tests
        stage('Test') {
            steps {
                echo 'Running backend tests...'
                dir('backend') {
                    sh 'mvn test -B -Dspring.profiles.active=test'
                }
            }
            post {
                // Always show test results in Jenkins UI
                always {
                    junit allowEmptyResults: true,
                          testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        // STAGE 4: Package backend into JAR
        stage('Package') {
            steps {
                echo 'Packaging backend JAR...'
                dir('backend') {
                    sh 'mvn package -DskipTests -B -q'
                }
            }
        }

        // STAGE 5: Build Docker images
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t blooddonor-backend:latest ./backend'
                sh 'docker build -t blooddonor-frontend:latest ./frontend'
            }
        }

        // STAGE 6: Deploy using Docker Compose
        stage('Deploy') {
            steps {
                echo 'Deploying with Docker Compose...'
                sh 'docker compose -f /workspace/docker-compose.yml down --remove-orphans || true'
                sh 'docker compose -f /workspace/docker-compose.yml up -d --build'
                sh 'sleep 15'
                sh 'docker compose -f /workspace/docker-compose.yml ps'
            }
        }

        // STAGE 7: Check the app is running
        stage('Health Check') {
            steps {
                echo 'Checking if app is running...'
                sh '''
                    for i in 1 2 3 4 5; do
                        if curl -sf http://localhost:8080/api/requests; then
                            echo "Backend is UP!"
                            break
                        fi
                        echo "Waiting... attempt $i"
                        sleep 10
                    done
                '''
            }
        }
    }

    // ── After pipeline finishes ───────────────────────────────
    post {
        success {
            echo 'SUCCESS! App is running at http://localhost:3000'
        }
        failure {
            echo 'FAILED! Stopping containers...'
            sh 'docker compose -f /workspace/docker-compose.yml down || true'
        }
        always {
            // Clean up workspace after every build
            cleanWs()
        }
    }
}
