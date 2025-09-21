pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ramjirv3217'
        EC2_HOST       = '98.70.42.89'
        EC2_USER       = 'ramji'
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Testing Backend") {
            steps {
                dir("backend") {
                    sh '''
                        echo "Loading nvm and Node.js"
                        export NVM_DIR="/home/ramji/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        node -v
                        npm -v

                        echo "Running backend tests"
                        rm -rf package-lock.json
                        npm install
                        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
                        PORT=0 npm run test:ci
                    '''
                }
            }
        }

        stage("Building Frontend") {
            steps {
                dir("frontend") {
                    sh '''
                        echo "Loading nvm and Node.js"
                        export NVM_DIR="/home/ramji/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        node -v
                        npm -v

                        echo "Running frontend build"
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                sh '''
                    docker build -t backend-image ./backend
                    docker build -t frontend-image ./frontend
                '''
            }
        }

        stage("Push Images to Docker Hub") {
            steps {
                withCredentials([string(credentialsId: 'DOCKERHUB_PASS', variable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login -u $DOCKERHUB_USER --password-stdin
                        docker tag backend-image $DOCKERHUB_USER/backend-image:latest
                        docker tag frontend-image $DOCKERHUB_USER/frontend-image:latest
                        docker push $DOCKERHUB_USER/backend-image:latest
                        docker push $DOCKERHUB_USER/frontend-image:latest
                    '''
                }
            }
        }

        stage("Deploy to EC2") {
            steps {
                withCredentials([string(credentialsId: 'EC2_PASS', variable: 'PASS')]) {
                    sh '''
                        sshpass -p "Vikas@23112005" scp -o StrictHostKeyChecking=no ./todo-docker-compose.yml $EC2_USER@$EC2_HOST:/home/$EC2_USER/todo-docker-compose.yml
                        sshpass -p "Vikas@23112005" scp -o StrictHostKeyChecking=no ./nginx.conf $EC2_USER@$EC2_HOST:/home/$EC2_USER/nginx.conf
                        
                        sshpass -p "Vikas@23112005" ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "
                            sudo docker pull $DOCKERHUB_USER/backend-image:latest &&
                            sudo docker pull $DOCKERHUB_USER/frontend-image:latest &&
                            sudo docker pull mongo:latest &&
                            sudo docker-compose -f /home/$EC2_USER/todo-docker-compose.yml up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    if (getContext(hudson.FilePath) != null) {
                        cleanWs()
                    } else {
                        echo "No workspace available to clean"
                    }
                } catch (err) {
                    echo "Workspace cleanup skipped: ${err}"
                }
            }
        }
    }
}
