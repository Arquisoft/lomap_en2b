Feature: Finding people on the app

Scenario: The user is logged in the site
  Given The user logs in
  When He searches for garabato
  Then Some test people should appear 

Scenario: The user is logged in the site
  Given The user logs in
  When He searches for asdfgh
  Then No one should appear 