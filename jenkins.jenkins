pipeline {
    agent any

    environment {
        // Remove HARBOR_USR and HARBOR_PWD from here for security!
        GITEA_CREDS = credentials('gitea-token')
        HARBOR_CREDS_ID = 'harbor-robot-account-id' // Use ID instead of actual credential
        HARBOR_URL = "http://192.168.100.179:80"
        HARBOR_IMAGE_URL = "192.168.100.179:80"
        HARBOR_PROJECT = "ipalg"
        HARBOR_REPO = "front-end"
        GIT_URL = "https://git.deliver4it.com/IPALG/front.git"
        DOCKERFILE_NAME = "dockerfile" // If it's not the default
    }

    stages {
        // FIX 1: Corrected Git syntax
        stage('Git Checkout'){
            steps{
                git branch: 'develop', 
                    url: GIT_URL, 
                    credentialsId: 'gitea-token'
            }
        }
        
        stage('Determin Harbor latest tag'){
            steps{
                script{
                    // Using withCredentials to securely access Harbor credentials
                    withCredentials([usernamePassword(credentialsId: HARBOR_CREDS_ID, 
                                                      usernameVariable: 'HARBOR_USR', 
                                                      passwordVariable: 'HARBOR_PWD')]) {
                        
                        def latestTag = sh(
                            script: """
                            curl -s -u ${HARBOR_USR}:${HARBOR_PWD} \
                            "${HARBOR_URL}/v2/${HARBOR_PROJECT}/${HARBOR_REPO}/tags/list" \
                            | grep -o '\"v[0-9]\\+\"' | tr -d '"' | sort -V | tail -n1
                            """,
                            returnStdout: true
                        ).trim()
                        
                        // Tag logic remains correct
                        if(latestTag){
                            echo "Latest Harbor tag: ${latestTag}"
                            def latestNumber = latestTag.replaceFirst(/^v/, '').toInteger()
                            env.NEW_VERSION = "v${latestNumber + 1}"
                        } else {
                            echo "No previous image found in Harbor. Starting at v1."
                            env.NEW_VERSION = "v1"
                        }
                    } // End withCredentials
                }
            }
        }
        
        stage('Build Docker image and tag it with latest also'){
            steps{
                script{
                    // Recommendation: Added -f to explicitly specify the Dockerfile
                    sh "docker build -f ${DOCKERFILE_NAME} -t ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:${env.NEW_VERSION} ."
                    
                    // Tag image also as 'latest'
                    sh "docker tag ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:${env.NEW_VERSION} ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:latest"
                }
            }
        }
        
        stage('Push to Harbor Registry'){
            steps{
                script{
                    // Connect to harbor securely using withCredentials
                    withCredentials([usernamePassword(credentialsId: HARBOR_CREDS_ID, 
                                                      usernameVariable: 'HARBOR_USR', 
                                                      passwordVariable: 'HARBOR_PWD')]) {
                        
                        // Use printf and docker login --password-stdin for security
                        sh 'printf "%s" "$HARBOR_PWD" | docker login ${HARBOR_IMAGE_URL} -u ${HARBOR_USR} --password-stdin'
                        
                        // Push both tags
                        sh "docker push ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:${env.NEW_VERSION}"
                        sh "docker push ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:latest"
                    }
                }
            }
        }
        
        stage('Deploy the image with latest tag'){
            steps{
                script{
                    // Recommendation: Stop and remove previous container before deploying
                    sh 'docker stop front-end-ipalg || true'
                    sh 'docker rm front-end-ipalg || true'
                    
                    // Deploy the new container
                    sh "docker run -d -p 4200:80 --name front-end-ipalg ${HARBOR_IMAGE_URL}/${HARBOR_PROJECT}/${HARBOR_REPO}:latest"
                }
            }
        }
    }
}