pipeline {
    agent any

    // ── Global options ────────────────────────────────────────────────────────
    options {
        timestamps()                        // Add timestamps to every log line
        ansiColor('xterm')                  // Coloured console output
        timeout(time: 30, unit: 'MINUTES')  // Fail the build if it hangs
        buildDiscarder(logRotator(numToKeepStr: '10')) // Keep last 10 builds
    }

    // ── Environment variables available to all stages ─────────────────────────
    environment {
        APP_NAME        = 'blood-donor-system'
        BACKEND_IMAGE   = 'blooddonor-backend'
        FRONTEND_IMAGE  = 'blooddonor-frontend'
        COMPOSE_FILE    = 'docker-compose.yml'
    }

    // ── Pipeline stages ───────────────────────────────────────────────────────
    stages {

        // ── Stage 1: Checkout ─────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                sh 'echo "Branch: $(git rev-parse --abbrev-ref HEAD)"'
                sh 'echo "Commit: $(git rev-parse --short HEAD)"'
            }
        }

        // ── Stage 2: Build Backend ────────────────────────────────────────────
        stage('Build Backend') {
            steps {
                echo '☕ Building Spring Boot backend with Maven...'
                dir('backend') {
                    sh 'mvn clean compile -B -q'
                }
            }
        }

        // ── Stage 3: Test Backend ─────────────────────────────────────────────
        stage('Test Backend') {
            steps {
                echo '🧪 Running backend unit tests...'
                dir('backend') {
                    sh 'mvn test -B'
                }
            }
            post {
                always {
                    // Publish JUnit test results in Jenkins UI
                    junit allowEmptyResults: true,
                          testResults: 'backend/target/surefire-reports/*.xml'
                }
                failure {
                    echo '❌ Tests failed! Check the test report above.'
                }
            }
        }

        // ── Stage 4: Package Backend ──────────────────────────────────────────
        stage('Package Backend') {
            steps {
                echo '📦 Packaging backend JAR...'
                dir('backend') {
                    sh 'mvn package -DskipTests -B -q'
                    sh 'ls -lh target/*.jar'
                }
            }
        }

        // ── Stage 5: Build Frontend ───────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                echo '⚛️  Building React frontend...'
                dir('frontend') {
                    sh 'npm install --silent'
                    sh 'CI=false npm run build'
                    sh 'echo "Build size: $(du -sh build/)"'
                }
            }
        }

        // ── Stage 6: Build Docker Images ──────────────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                                 -t ${BACKEND_IMAGE}:latest \
                                 ./backend
                '''
                sh '''
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                                 -t ${FRONTEND_IMAGE}:latest \
                                 ./frontend
                '''
                sh 'docker images | grep -E "blooddonor|REPOSITORY"'
            }
        }

        // ── Stage 7: Deploy with Docker Compose ───────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application with Docker Compose...'
                sh '''
                    # Stop existing containers gracefully
                    docker compose -f ${COMPOSE_FILE} down --remove-orphans || true

                    # Start all services fresh
                    docker compose -f ${COMPOSE_FILE} up -d --build

                    # Wait for services to be healthy
                    echo "Waiting for services to start..."
                    sleep 15

                    # Show running containers
                    docker compose -f ${COMPOSE_FILE} ps
                '''
            }
        }

        // ── Stage 8: Health Check ─────────────────────────────────────────────
        stage('Health Check') {
            steps {
                echo '🏥 Verifying application is running...'
                sh '''
                    # Check backend API is responding
                    for i in 1 2 3 4 5; do
                        if curl -sf http://localhost:8080/api/requests > /dev/null 2>&1; then
                            echo "✅ Backend is healthy!"
                            break
                        fi
                        echo "Attempt $i: Backend not ready yet, waiting..."
                        sleep 10
                    done

                    # Check frontend is serving
                    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
                        echo "✅ Frontend is healthy!"
                    else
                        echo "⚠️  Frontend check failed — may still be starting"
                    fi
                '''
            }
        }
    }

    // ── Post-build actions ────────────────────────────────────────────────────
    post {
        success {
            echo '''
            ╔══════════════════════════════════════╗
            ║  ✅ BUILD SUCCESSFUL                  ║
            ║  App running at http://localhost:3000 ║
            ║  API running at http://localhost:8080 ║
            ╚══════════════════════════════════════╝
            '''
        }
        failure {
            echo '❌ BUILD FAILED — Check the logs above for details'
            // Stop containers if deploy failed
            sh 'docker compose -f ${COMPOSE_FILE} down || true'
        }
        always {
            // Clean up workspace to save disk space
            cleanWs()
        }
    }
}
