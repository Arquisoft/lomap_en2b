Feature: Finding people on the app

Scenario: Searching for garabato
  Given The user logs in
  When He searches for garabato
  Then Some test people should appear 

Scenario: Searching for random
  Given The user logs in
  When He searches for asdfgh
  Then No one should appear 