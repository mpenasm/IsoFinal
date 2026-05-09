pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Limpiar Entorno') {
            steps {
                echo 'Limpiando versiones antiguas...'
                sh 'docker-compose down --remove-orphans || true'
            }
        }

        stage('Build y Deploy') {
            steps {
                echo 'Levantando solo los servicios de la app...'
                sh 'docker-compose up -d --build mongodb node_api nginx_server'
            }
        }

        stage('Verificar') {
            steps {
                echo 'Estado de los contenedores:'
                sh 'docker ps'
            }
        }
    }
}