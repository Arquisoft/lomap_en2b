Feature: Login in the app

Scenario: The user is not logged in the site
  Given An unlogged user
  When I complete the solid login
  Then The app should start working