pipeline {
    agent any
    environment {
        COMPOSE_PROJECT_NAME = 'proyectofinal12'
        MONGODB_URI = credentials('CRED_MONGO_URI')
        MONGODB_DB  = credentials('CRED_MONGO_DB')
        NGINX_URL   = credentials('CRED_NGINX')
        PORT        = '4000'
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('1. Checkout') {
            steps {
                checkout scm
                echo 'Código actualizado.'
            }
        }

        stage('2. Build') {
            steps {
                echo 'Construyendo imágenes...'
                sh 'docker-compose build'
            }
        }

        stage('3. Test') {
            steps {
                script {
                    echo 'Levantando entorno de prueba...'
                    sh 'docker-compose up -d mongodb node_api'
                    
                    echo 'Esperando a que la API esté lista...'
                    sleep 10 
                    
                    sh '''
                        curl -f http://node_api:4000/health || (echo "API no responde" && exit 1)
                    '''
                    echo 'Test superado con éxito.'
                }
            }
        }

        stage('4. Deploy') {
            steps {
                echo 'Despliegue final con Nginx...'
                sh 'docker-compose up -d --remove-orphans mongodb node_api nginx_server'
            }
        }
    }

    post {
        always {
            sh 'docker ps'
        }
    }
}