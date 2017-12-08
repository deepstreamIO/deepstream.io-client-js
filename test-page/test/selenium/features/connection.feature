Feature: As a test-page user, I want to be able to add a client that connects to a deepstream server

  Background:
    Given I am on the test-page

  Scenario: Entering the address and clicking add-client button create a client component
    When I enter text "172.17.0.1:6020" in field "input#input-add-client"
    And I click "button#btn-add-client" 
    Then A client component is displayed with id "1"