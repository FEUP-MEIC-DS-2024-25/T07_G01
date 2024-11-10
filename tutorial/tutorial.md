# Story2Test - Tutorial

Welcome to **Story2Test**! This tool helps you turn User Stories into acceptance tests, simplifying the development and validation process. Follow our quick tutorial and learn how to use the tool. 



## 1. What our application does

**Story2Test** allows you to:
- Convert User Stories into acceptance tests in Gherkin (Given-When-Then) format.
- View the generated tests directly in the interface.



## 2. How to use

1. **Accessing the Tool**
   - Open Story2Test and you will see the User Stories input bar in the center of the screen.

2. **Enter a User Story:**
   - Type your User Story into the input box. Use the standard format:
     ```
     As a <type of user>, I want to <perform an action>, so that I <achieve a goal>.
     ```

3. **Sending the User Story:**
   - Click on the send button (“Send” icon) or press `Enter` to process the User Story.

4. **View the Acceptance Tests:**
   - After submitting, the tool will automatically display the generated acceptance tests in Gherkin format.



## 3. Example


### User Story

```
As a user, I want to securely log into my account, so that I can access my personalized features and data. 
```

### Generated test

```
Feature: Secure Login

Scenario: Successful login
  Given the user is on the login page
  When the user enters their valid username and password
  Then the user should be succefully logged in
  And the user should be redirected to their personalized dashboard

Scenario: Invalid credentials
  Given the user is on the login page,
  When the user enters an invalid username an invalid username or password
  Then the user should be presented with an error message
  And the user should remain on the login page

Scenario: I forgot my password
  Given the user is on the login page
  When the user clicks on the "Forgot password" link
  Then the user should be redirected to the password reset page
  And the user should be able to initiate a password reset process
```

## 4. Our Team

- Manuel Alves (PO)
- Pedro Simões
- Diogo Santos (SM)
- Guilherme Martins


### We hope you find our tool useful!
