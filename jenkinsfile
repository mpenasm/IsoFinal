pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Construyendo imagen de la API...'
                sh 'docker-compose build node_api'
            }
        }

        stage('Test') {
            steps {
                echo 'Verificando que la API responde...'
                sh 'docker-compose up -d mongodb node_api'
                sleep 10
                sh 'curl -f http://node_api:4000/api/locales || exit 1'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Desplegando entorno completo...'
                sh 'docker-compose up -d'
                sh 'docker image prune -f'
            }
        }
    }
}