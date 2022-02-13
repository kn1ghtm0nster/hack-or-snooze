'use strict';

// So we don't have to keep re-finding things on page, find DOM elements once:

// variable is selecting the body of html page
const $body = $('body');

// variable is selecting the stories-loading-msg id from html
const $storiesLoadingMsg = $('#stories-loading-msg');

// variable is slecting all-stories-list (empty ol in html file) id from html
const $allStoriesList = $('#all-stories-list');

// variable is selecting the empty ol in html
const $favoritesList = $('#favorites-stories-list');

// variable is selecting the empty ol for user stories in html
const $userStoriesList = $('#user-story-list');

// variable is seleccting ALL lists with the class of "story-list"
const $storyLists = $('.stories-list');

// variable is slecting the login-form id (login form section) from html
const $loginForm = $('#login-form');

// variable is slecting the signup-form id (sign up form different from login)
const $signupForm = $('#signup-form');

// variable is selecting the story-form id (to add a new story hidden by default)
const $storyForm = $('#story-form');

// variable is selecting the nav-login id (login links at the top of page)
const $navLogin = $('#nav-login');

// variable is selecting the nav-user-profile id (link that takes you to user profile view?)
const $navUserProfile = $('#nav-user-profile');

// variable is selecting the nav-logout id (link to log out of current user account)
const $navLogOut = $('#nav-logout');

// variable is selecting the nav-submit id (link to show submit form for new story)
const $submit = $('#nav-submit');

// variable is selecting the nav-stories id (link to show the specific favorites list for a user)
const $favorites = $('#nav-favorites');

// variable is selecting the nav-my-stories id (link to show the stories that a user has submitted)
const $myStories = $('#nav-my-stories');

// variable is selecting the nav-user-profile id (link to view the user profile)
const $userProfile = $('#nav-user-profile');

// variable is selecting the p tag that contains all the links for a user to click.
const $allLinks = $('#all-links');

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
	const components = [ $allStoriesList, $loginForm, $signupForm ];
	components.forEach((c) => c.hide());
}

function hideLinkTags() {
	$allLinks.hide();
}

function showLinkTags() {
	$allLinks.show();
}

/** Overall function to kick off the app. */

async function start() {
	console.debug('start');

	// "Remember logged-in user" and log in, if credentials in localStorage
	await checkForRememberedUser();
	await getAndShowStoriesOnStart();

	// if we got a logged-in user
	if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
	'HEY STUDENT: This program sends many debug messages to' +
		" the console. If you don't see the message 'start' below this, you're not" +
		' seeing those helpful debug messages. In your browser console, click on' +
		" menu 'Default Levels' and add Verbose"
);
$(start);
