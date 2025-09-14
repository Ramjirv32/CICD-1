pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ramjirv3217'
        DOCKERHUB_PASS = credentials('DOCKERHUB_PASS')  
        EC2_HOST      = '135.235.193.165'                   
        EC2_USER      = 'ramji'                            
        EC2_PASS      = credentials('EC2_PASS')              
        NVM_DIR       = '/home/ramji/.nvm'
        NODE_VERSION  = '18'  // Using Node 18 for compatibility
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
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        nvm install $NODE_VERSION
                        nvm use $NODE_VERSION
                        node -v
                        npm -v

                        echo "Cleaning old modules and installing dependencies"
                        rm -rf node_modules package-lock.json
                        npm install

                        echo "Running backend tests"
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
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        nvm install $NODE_VERSION
                        nvm use $NODE_VERSION
                        node -v
                        npm -v

                        echo "Installing frontend dependencies and building"
                        rm -rf node_modules package-lock.json
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
                        sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "
                            sudo docker pull $DOCKERHUB_USER/backend-image:latest &&
                            sudo docker pull $DOCKERHUB_USER/frontend-image:latest &&
                            sudo docker pull mongo:latest &&
                            sudo docker-compose -f /home/$EC2_USER/todo-docker-compose.yml up -d --scale backend=2 --scale frontend=2
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace"
            cleanWs()
        }
    }
}
