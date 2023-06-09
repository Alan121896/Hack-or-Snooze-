"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.

  //edited User code to handle potential error messaging 

  try {

    currentUser = await User.login(username, password);

    $loginForm.trigger("reset");

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  } catch(error){
    console.error('Login Failed', error);
    displayErrorMessage('Invalid login credentials!')
  }
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.

  //edited User code to handle potential error messaging 

  try {
    currentUser = await User.signup(username, password, name);

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();

    $signupForm.trigger("reset");
  } catch (error) {
    console.error('Signup failed', error);
    displayErrorMessage('Username already taken');
  }
}

$signupForm.on("submit", signup);

// added displayErrorMessage function for error handling

function displayErrorMessage(message){
  const errorMessage = $("#error-section");
  errorMessage.text(message);
  errorMessage.removeClass("hidden");
}

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  putStoriesOnPage();
  $allStoriesList.show();
  $errorSection.hide()

  updateNavOnLogin();
  generateUserProfile();
  $storiesContainer.show()
}

function generateUserProfile(){
  console.debug("generateUserProfile");

  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10));
}

//edit user profile info if wanting to change username and password

function editProfile(){
  $(".profile-info").hide()
  $("#edit-profile").show()
  $(".profile-button").html("Save")
}

function saveProfileEdit(){
  //  implement save
  $(".profile-info").show()
  $("#edit-profile").hide()
  $(".profile-button").html("Edit Profile")

  
  // location.reload()
}
// unfinished updateProfile function -- need to get back to it later -- 

// async function saveProfileEdit() {
//   const newUsername = $("#edit-username").val();
//   const newPassword = $("#edit-password").val();

//   try {
//     // Make an API call to update the user's profile with the new username and password
//     await User.updateProfile(username, newUsername, newPassword);

//     // Update the currentUser with the new username
//     username = newUsername;

//     // Update the UI with the new profile information
//     generateUserProfile();
    
//     // Reset the form and hide the edit profile section
//     // $("#edit-profile-form").trigger("reset");
//     $(".profile-info").show();
//     $("#edit-profile").hide();
//     $(".profile-button").html("Edit Profile");

//   } catch (error) {
//     console.error('Failed to update profile', error);
//     displayErrorMessage('Failed to update profile. Please try again.');
//   }
// }


$(".profile-button").on("click", () => {
  if($(".profile-button").html() == "Edit Profile"){
    editProfile()
  } else {
    saveProfileEdit()
  }
})