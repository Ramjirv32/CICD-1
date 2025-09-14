pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'ramjirv3217'
        DOCKERHUB_PASS = credentials('DOCKERHUB_PASS')  
        EC2_HOST      = '135.235.193.165'                   
        EC2_USER      = 'ramji'                            
        EC2_PASS      = credentials('EC2_PASS')              
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
                        # Kill any process using port 5000 to prevent conflicts
                        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
                        # Run the specialized CI test command that installs the correct Babel dependencies
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
            cleanWs()
        }
    }
}
