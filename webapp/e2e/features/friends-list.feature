Feature: See the list of my friends

Scenario: The user is logged in the site
  Given A logged user
  When I click on the friends tab
  Then I am able to see my friends