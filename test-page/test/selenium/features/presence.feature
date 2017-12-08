Feature: As test-page user, I want to be able query users online status so I'd know who is online and who is not

  Background:
    Given I am on the test-page
    And I add a client with address "172.17.0.1:6020/deepstream"
    And A client component is displayed with id "1"
    And I login with standard user
    And Connection state becomes "OPEN"

  Scenario: query for everyone's status
    Given I connect all users
    When I query online status of everyone
    Then Everyone is connected

  Scenario: query for specific users's status
    Given I connect users "user-1, user-2, user-3"
    When I query online status of "user-1, user-2, user-3, user-4"
    Then Users "user-1, user-2, user-3" are online and "user-4" are offline
      
  @presence-subscribe
  Scenario: Subscribe to a specific user's online status
    Given I subscribe for "user-1" online status
    When I connect users "user-1"
    Then The online status of the user "user-1" is now "on"
    When I disconnect users "user-1"
    Then The online status of the user "user-1" is now "off"