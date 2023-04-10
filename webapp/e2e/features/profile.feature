Feature: See my profile

Scenario: The user is logged in the site
  Given A logged user
  When I click on the profile
  Then I am able to see my information