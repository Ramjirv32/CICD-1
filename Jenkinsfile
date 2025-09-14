pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ramjirv3217'
        DOCKERHUB_PASS = credentials('DOCKERHUB_PASS')  
        EC2_HOST = '135.235.193.165'                   
        EC2_USER = 'ramji'                            
        EC2_PASS = credentials('EC2_PASS')              
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
                        npm test
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
                sh '''
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                    docker tag backend-image $DOCKERHUB_USER/backend-image:latest
                    docker tag frontend-image $DOCKERHUB_USER/frontend-image:latest
                    docker push $DOCKERHUB_USER/backend-image:latest
                    docker push $DOCKERHUB_USER/frontend-image:latest
                '''
            }
        }

        stage("Deploy to EC2") {
            steps {
                sh '''
                    sshpass -p "$EC2_PASS" ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                        docker pull $DOCKERHUB_USER/backend-image:latest
                        docker pull $DOCKERHUB_USER/frontend-image:latest
                        docker compose -f /home/$EC2_USER/todo-docker-compose.yml up -d --scale backend=2 --scale frontend=2
                    '
                '''
            }
        }
    }
}
