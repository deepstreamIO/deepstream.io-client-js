Feature: As test-page user, I want to be able create a record so I can use all records features through the test-page

  Background:
    Given I am on the test-page
    And I add a client with address "172.17.0.1:6020/deepstream"
    And A client component is displayed with id "1"
    And I login with standard user
    And Connection state becomes "OPEN"

  Scenario: Create a record, subscribe to it, set one of its attributes and receives it as update
    Given I create a record with name "posts/001"
    Then A record label with record name "posts/001" is displayed
    And The subscribe button for record "posts/001" is displayed
    When I subscribe to record "posts/001"
    Then The unsubscribe button for record "posts/001" is displayed
    When I set record "posts/001" attribute "title" to value "Important announcement..."
    Then The record "posts/001" receives as an update the value "{'title':'Important announcement...'}"

  Scenario: Unsubscribe from record, set its data and do not receive any updates
    Given I create a record with name "posts/001"
    And I subscribe to record "posts/001"
    And I unsubscribe from record "posts/001"
    And I set record "posts/001" attribute "title" to value "xyz"
    And I set record "posts/001" attribute "content" to value "abc"
    Then The record "posts/001" does not receive any update
    And The subscribe button for record "posts/001" is displayed

  Scenario: Create a record, set its data, snapshot it
    Given I create a record with name "posts/002"
    And I set record "posts/002" attribute "title" to value "How to fix your car"
    And I set record "posts/002" attribute "content" to value "Fixing your car is ..."
    And I set record "posts/002" attribute "date" to value "02.02.2018"
    Then I snapshot record "posts/002"
    Then The value "{'title':'How to fix your car','content':'Fixing your car is ...','date':'02.02.2018'}" is displayed in the snapshot preview

  Scenario: Check if non-existant record exists, create it and find it empty
    Given I check if record "posts/003" exists
    And I find that record "posts/003" does not exist
    Then I create a record with name "posts/003"
    And I snapshot record "posts/003"
    Then The value "{}" is displayed in the snapshot preview
  
  Scenario: Create record and receive updates from an active data provider
    Given I start listening for records
    And I create a record with name "posts/004"
    And I subscribe to record "posts/004"
    When A timeout of "1000" milliseconds have passed
    Then The record "posts/004" receives as an update the value "{'provider':'[1]: data sat from provider'}"