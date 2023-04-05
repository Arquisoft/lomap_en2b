Feature: Finding people on the app

Scenario: The user is logged in the site
  Given A logged user
  When He searches for Pepe
  Then Some test people should appear 