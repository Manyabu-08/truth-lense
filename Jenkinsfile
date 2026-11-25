pipeline {
  agent any
  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Type Check') {
      steps {
        sh 'npm run lint'
      }
    }
    stage('Run Tests (TC-01 to TC-06)') {
      steps {
        sh 'npm test'
      }
    }
    stage('Production Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}
