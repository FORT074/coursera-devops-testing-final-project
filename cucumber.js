module.exports = {
    default: {
      require: [
        'features/support/**/*.js',
        'features/step_definitions/**/*.js'
    ],
      format: ['progress-bar', 'json:reports/cucumber_report.json'],
      paths: ['features/*.feature'],
      requireModule: ['@babel/register'],
      worldParameters: {
        baseUrl: process.env.BASE_URL || 'http://localhost:8080',
        waitTimeout: parseInt(process.env.WAIT_SECONDS || '5') * 1000
      }
    }
  };