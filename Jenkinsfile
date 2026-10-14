
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        BASE_URL = 'https://opensource-demo.orangehrmlive.com'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Node and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Chromium') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Playwright tests') {
            steps {
                bat 'npx playwright test --project=chromium'
            }
        }
    }

    
post {
    always {
        script {
            if (fileExists('test-results/results.xml')) {
                junit testResults: 'test-results/results.xml',
                      allowEmptyResults: true
            }

            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])

            archiveArtifacts artifacts: 'playwright-report/**,test-results/**',
                             allowEmptyArchive: true
        }
    }
}

}
