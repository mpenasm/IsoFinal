pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Limpiar Entorno') {
            steps {
                script {
                    echo 'Limpiando contenedores conflictivos...'
                    // 1. Bajamos el compose actual (por si acaso)
                    sh 'docker-compose down --remove-orphans || true'
                    
                    // 2. BORRADO MANUAL POR NOMBRE (Aquí está la clave)
                    // Borramos 'iso_api' porque es el que da el error de conflicto.
                    // Añadimos los otros por si acaso se quedaron colgados con otros nombres.
                    sh '''
                        docker rm -f iso_api || true
                        docker rm -f gitcompose-nginx_server-1 || true
                        docker rm -f gitcompose-mongodb-1 || true
                        docker rm -f isoproject-nginx_server-1 || true
                        docker rm -f isoproject-mongodb-1 || true
                    '''
                    echo 'Entorno limpio.'
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