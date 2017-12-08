Feature: As test-page user, I want to be able emit an event, subscribe to and listen for events

  Background:
    Given I am on the test-page
    And I add a client with address "172.17.0.1:6020/deepstream"
    And A client component is displayed with id "1"
    And I login with standard user
    And Connection state becomes "OPEN"

  Scenario: Subscribe to event , emit data to it and receives updates
    Given I subscribe to event "weather"
    When I emit event "weather" with data "cold"
    Then I receive update "cold" in event "weather"

  Scenario: Subscribe to events, start listening and receive updates
    Given I start listening for events
    When I subscribe to event "weather"
    And I subscribe to event "stock-market"
    When A timeout of "1000" milliseconds have passed
    Then I receive update "from provider" in event "weather"
    And I receive update "from provider" in event "stock-market"
  
  Scenario: Subscribe to event by two clients and receive emits from a third
    Given Client with id "2" and name "elton-mars" logs in to server "172.17.0.1:6020"
    And Client with id "2" subscribes to event "universe-news"
    And Client with id "3" and name "elton-venus" logs in to server "172.17.0.1:6020"
    And Client with id "3" subscribes to event "universe-news"
    When I emit event "universe-news" with data "Breaking News: Darkmatter is demystified!"
    Then Client with id "2" receives event "universe-news" with data "Breaking News: Darkmatter is demystified!"
    And Client with id "3" receives event "universe-news" with data "Breaking News: Darkmatter is demystified!"