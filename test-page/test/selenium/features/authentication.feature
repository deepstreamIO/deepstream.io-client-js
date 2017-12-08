Feature: As test-page user, I want to be able to enter the server address so that I can connect to a deepstream server and use the client with it

  Background:
    Given I am on the test-page
    And I add a client with address "172.17.0.1:6020/deepstream"
    And A client component is displayed with id "1"

  Scenario: Login with the standard user
    When I login with standard user
    Then Connection state becomes "OPEN"