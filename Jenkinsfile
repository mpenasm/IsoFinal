pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
    stage('Limpiar Entorno') {
        steps {
            script {
                // 1. Apaga solo lo que pertenece a este docker-compose (sin borrar a jenkins)
                // Usamos -p para asegurar que el nombre del proyecto sea siempre el mismo
                sh 'docker-compose -p proyecto_web down --remove-orphans || true'
                
                // 2. Limpieza de seguridad por si acaso
                sh 'docker ps -q -f "name=gitcompose" | xargs -r docker rm -f || true'
                }
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