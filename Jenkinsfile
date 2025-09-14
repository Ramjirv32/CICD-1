pipeline {
    agent any
    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Testing Backend") {
            steps {
                dir("backend") {
                    sh "echo 'Running backend tests'"
                    sh "rm -rf package-lock.json"
                    sh "npm install"
                    sh "npm test"
                }
            }
        }

        stage("Building Frontend") {
            steps {
                dir("frontend") {
                    sh "echo 'Running frontend build'"
                    sh "npm install"
                    sh "npm run build"
                }
            }
        }
    }
}
