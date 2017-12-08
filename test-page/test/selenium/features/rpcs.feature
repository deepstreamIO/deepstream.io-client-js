Feature: As test-page user, I want to be able to call the echo rpc

  Background:
    Given I am on the test-page
    And I add a client with address "172.17.0.1:6020/deepstream"
    And A client component is displayed with id "1"
    And I login with standard user
    And Connection state becomes "OPEN"

  Scenario: Make echo RPC with "Hello World" string
    Given I fill the data field with "Hello World" of rpc "echo"
    And I make the rpc "echo"
    Then I receive the response "Hello World" of rpc "echo"

  Scenario: Client A provides RPC and Client B is able to use it
    Given Client with id "2" and name "elton-mars" logs in to server "172.17.0.1:6020"
    And Client with id "2" provides rpc "multiplication"
    And Client with id "3" and name "elton-venus" logs in to server "172.17.0.1:6020"
    And Client with id "3" tries to provide rpc "multiplication" and finds it already provided
    When Client with id "3" makes rpc "multiplication" with arguments "1, 2"
    Then Client with id "3" receives results "2" from rpc "multiplication"
    When Client with id "2" makes rpc "multiplication" with arguments "1, 2"
    Then Client with id "2" receives results "2" from rpc "multiplication"