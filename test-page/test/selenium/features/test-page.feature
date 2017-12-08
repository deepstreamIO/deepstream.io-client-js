Feature: As test-page user, I want to be able to enter the server address so that I can see a utility dashboard to test deepstream features

  Background:
    Given I am on the test-page

  Scenario: Go to test-page, enter one address, get one client component
    When I add a client with address "172.17.0.1:6020/deepstream"
    Then A client component is displayed with id "1"
    Then The "connection" component is displayed for client component with id "1"
    Then The "error-logger" component is displayed for client component with id "1"
    Then The "authentication" component is displayed for client component with id "1"
    Then The "records" component is displayed for client component with id "1"
    Then The "events" component is displayed for client component with id "1"
    Then The "rpcs" component is displayed for client component with id "1"
    Then The "presence" component is displayed for client component with id "1"

  Scenario: Go to test-page, enter one address, get one client, enter a second one and get a second client component
    When I add a client with address "172.17.0.1:6020/deepstream"
    Then A client component is displayed with id "1"
    When I add a client with address "172.17.0.1:6020/deepstream"
    Then A client component is displayed with id "2"
    Then The "connection" component is displayed for client component with id "2"
    Then The "error-logger" component is displayed for client component with id "2"
    Then The "authentication" component is displayed for client component with id "2"
    Then The "records" component is displayed for client component with id "2"
    Then The "events" component is displayed for client component with id "2"
    Then The "rpcs" component is displayed for client component with id "2"
    Then The "presence" component is displayed for client component with id "2"
