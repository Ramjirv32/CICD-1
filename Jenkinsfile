pipeline{
    agent any
    stages{
        stage("checkout"){
            steps{
                checkout scm
            }
        }
        stage("Testing"){
            steps{
                sh "echo 'Testing backend'"
                sh "cd backend && npm install && npm test"

                sh "echo 'Testing backend'"
                sh "cd backend && npm install && npm test"
            }
        }
        stage("Building Frontend"){
            steps{
                sh "echo 'Building Frontend'"
                sh "cd frontend && npm install && npm run build"

               
            }
        }
    }
}