const seleniumServer = require('selenium-server')
const phantomjs = require('phantomjs-prebuilt')
const chromedriver = require('chromedriver')
const geckodriver = require('geckodriver')

require('nightwatch-cucumber')({
  cucumberArgs: ['--require', 'timeout.js', '--require', 'features/step_definitions', '--format', 'pretty', '--format', 'json:reports/cucumber.json', 'features']
})

const dockerizedSeleniumArgs = process.argv.splice(2, process.argv.length)
const useDockerizedSelenium = dockerizedSeleniumArgs.some(element => element === '--use-docker')

module.exports = {
  output_folder: 'reports',
  custom_assertions_path: '',
  live_output: false,
  disable_colors: false,
  selenium: Object.assign({
    log_path: '',
    host: '127.0.0.1',
    port: 4444
  }, useDockerizedSelenium ? {
    start_process: false,
  } : {
    start_process: true,
    server_path: seleniumServer.path,
  }),
  test_settings: {
    default: {
      screenshots : {
        enabled : true,
        on_failure : true,
        path: 'screenshots/default'
      },
      launch_url: useDockerizedSelenium ? 'http://172.17.0.1:8080' : 'http://localhost:8080',
      selenium_port: 4444,
      selenium_host: '127.0.0.1',
      'webdriver.firefox.profile': 'webdriver',
      desiredCapabilities: Object.assign({
        browserName: 'phantomjs',
        javascriptEnabled: true,
        acceptSslCerts: true,
      }, useDockerizedSelenium ? {} : { 'phantomjs.binary.path': phantomjs.path })
    },
    chrome: {
      screenshots : {
        enabled : true,
        on_failure : true,
        path: 'screenshots/chrome'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      },
      selenium: useDockerizedSelenium ? {} : {
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path
        }
      }
    },
    firefox: {
      screenshots : {
        enabled : true,
        on_failure : true,
        path: 'screenshots/firefox'
      },
      desiredCapabilities: {
        browserName: 'firefox',
        marionette: true,
        javascriptEnabled: true,
        acceptSslCerts: true
      },
      selenium: {
        cli_args: Object.assign({
          'webdriver.firefox.profile': 'elton'
        }, useDockerizedSelenium ? {} : {
          'webdriver.firefox.driver': geckodriver.path
        })
      }
    },
    ie: {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'screenshots/ie'
      },
      selenium_host: '192.168.56.2',
      selenium_port: 4444,
      desiredCapabilities: {
        browserName: 'internet explorer',
        javascriptEnabled: true,
        acceptSslCerts: true
      },
      selenium: {
        start_process: false
      }
    }
  }
}
