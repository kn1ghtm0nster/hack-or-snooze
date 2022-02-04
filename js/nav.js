'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
	$storyForm.hide();
	$favoritesList.hide();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}

/* When a user clicks on the 'submit' link, add story view appears and hides main list view.*/

function submitLinkClick(evt) {
	console.debug('submitLinkClick', evt);
	$storyForm.show();
	$allStoriesList.hide();
	$favoritesList.hide();
}

$submit.on('click', submitLinkClick);

/* When a user clicks on the 'favorites' link, show the user's favorited stories */

function favoritesLinkClick(evt) {
	console.debug('favoritesLinkClick');
	$favoritesList.show();
	$allStoriesList.hide();
	$storyForm.hide();
	$userStoriesList.hide();
	addFavoritesToPage();
}

$favorites.on('click', favoritesLinkClick);

/* When a user clicks on the 'my stories' link, show the user's created stories */

function myStoriesLinkClick(evt) {
	console.debug('myStoriesLinkClick');
	$userStoriesList.show();
	$allStoriesList.hide();
	$favoritesList.hide();
	$storyForm.hide();
}

$myStories.on('click', myStoriesLinkClick);

// TODO:
// make sure you put hide methods for the last two functions to hide whenever a user clicks somewhere else otherwise the list will remain on page.
