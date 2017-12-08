require('nightwatch-cucumber')({
  cucumberArgs: ['--require', 'timeout.js', '--require', 'features/step_definitions', '--format', 'pretty', '--format', 'json:reports/cucumber.json', 'features']
})

const Config = {
  output_folder: 'reports',
  custom_assertions_path: '',
  live_output: false,
  disable_colors: false,
  selenium: {
    start_process: false,
    host : 'hub-cloud.browserstack.com',
    port: 80
  },
  common_capabilities: {
    'browserstack.user': 'deepstreamhubgmb1',
    'browserstack.key': 'MtG1H5x721CqVy5MQypa'
  },
  test_settings: {
    default: {},
    chrome: {
      desiredCapabilities: {
        browser: 'chrome'
      }
    },
    firefox: {
      desiredCapabilities: {
        browser: 'firefox'
      }
    },
    safari: {
      desiredCapabilities: {
        browser: "safari"
      }
    },
    ie: {
      desiredCapabilities: {
        browser: "internet explorer"
      }
    }
  }
}


// Code to copy seleniumhost/port into test settings
for (const i in Config.test_settings) {
  const config = Config.test_settings[i]
  config.selenium_host = Config.selenium.host
  config.selenium_port = Config.selenium.port
  config.desiredCapabilities = config.desiredCapabilities || {}
  for (const j in Config.common_capabilities) {
    config.desiredCapabilities[j] = config.desiredCapabilities[j] || Config.common_capabilities[j]
  }
}

module.exports = Config
