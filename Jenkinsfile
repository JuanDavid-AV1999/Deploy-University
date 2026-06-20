pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Validate') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t taskcontrol .'
      }
    }

    stage('Docker Smoke Test') {
      steps {
        sh 'docker run --rm taskcontrol nginx -t'
      }
    }
  }

  post {
    always {
      deleteDir()
    }
  }
}
