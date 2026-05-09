pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Limpiar Entorno') {
            steps {
                echo 'Limpiando versiones antiguas y contenedores huérfanos...'
                // 1. Intentamos bajar lo que reconozca el compose
                sh 'docker-compose down --remove-orphans || true'
                
                // 2. Forzamos el borrado de iso_api por si acaso quedó bloqueado
                sh 'docker rm -f iso_api || true'
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