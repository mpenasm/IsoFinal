pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'isoproject'
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Limpiar Entorno') {
            steps {
                script {
                    echo "Limpiando contenedores previos..."
                    // Detiene y elimina contenedores del proyecto actual
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // Limpieza de seguridad para los nombres antiguos
                    sh 'docker rm -f iso_api gitcompose-nginx_server-1 gitcompose-mongodb-1 || true'
                }
            }
        }

        stage('Build y Deploy') {
            steps {
                echo 'Levantando servicios de la aplicación (excluyendo Jenkins)...'
                // Solo levantamos la infraestructura de la web
                sh 'docker-compose up -d --build mongodb node_api nginx_server'
            }
        }

        stage('Verificar') {
            steps {
                echo 'Estado actual de los contenedores:'
                sh 'docker ps'
            }
        }
    }
}