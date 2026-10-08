pipeline {
  agent any
  options { timestamps(); disableConcurrentBuilds() }
  environment {
    CI = 'true'
    BASE_URL = 'https://opensource-demo.orangehrmlive.com'
    ORANGEHRM_USERNAME = credentials('orangehrm-username')
    ORANGEHRM_PASSWORD = credentials('orangehrm-password')
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install Node dependencies') { steps { bat 'npm install' } }
    stage('Install Playwright Chromium') { steps { bat 'npx playwright install chromium' } }
    stage('Run Playwright tests') { steps { bat 'npx playwright test --project=chromium' } }
  }
  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**, screenshots/**', allowEmptyArchive: true
      publishHTML(target: [allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report'])
      junit testResults: 'test-results/results.xml', allowEmptyResults: true
    }
  }
}
