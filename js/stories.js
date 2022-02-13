'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	// Function is responsible for creating a new instance of StoryList class once the page starts.
	if (currentUser) {
		showLinkTags();
	} else {
		hideLinkTags();
	}

	storyList = await StoryList.getStories();

	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();

	// variable is checking to see if a user is logged in or not to display the star icon
	const starShown = Boolean(currentUser);

	return $(`
      <li id="${story.storyId}">
	  	${deleteBtn ? deleteIcon() : ''}
		${starShown ? generateStar(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function addFavoritesToPage() {
	console.debug('addFavoritesToPage');

	$favoritesList.empty();

	if (currentUser.favorites.length === 0) {
		$favoritesList.append('<h5> No favorites currently for this user!</h5>');
	} else {
		for (let favorite of currentUser.favorites) {
			const $story = generateStoryMarkup(favorite);
			$favoritesList.append($story);
		}
	}
	$favoritesList.show();
}

function addMyStoriesToPage() {
	console.debug('addMyStoriesToPage');
	$userStoriesList.empty();

	if (currentUser.ownStories.length === 0) {
		$userStoriesList.append('<h5> No stories submitted yet! </h5>');
	} else {
		for (let item of currentUser.ownStories) {
			const $story = generateStoryMarkup(item);
			$story.prepend(deleteIcon());
			$userStoriesList.append($story);
		}
	}
	$userStoriesList.show();
}

function generateStar(story, user) {
	// accessing the isFavorite function from models.js file to see if the storyId passesd is a favorite story for the user passed in.
	const isFavorite = user.isFavorite(story);
	let fontAwesomeStar;
	if (isFavorite) {
		fontAwesomeStar = 'fas';
	} else {
		fontAwesomeStar = 'far';
	}
	return `
	<span class="star">
		<i class="${fontAwesomeStar} fa-star"></i>
	</span>
	`;
}

async function deleteStory(evt) {
	console.debug('deleteStory');

	const $liElement = $(evt.target).closest('li');
	const storyId = $liElement.attr('id');

	await storyList.deleteStory(currentUser, storyId);

	addMyStoriesToPage();
}

$userStoriesList.on('click', '.trash-can', deleteStory);

function deleteIcon() {
	return `
	<span class="trash-can">
	  <i class="fas fa-trash-alt" id="delete-icon"></i>
	</span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

async function submitNewStory(evt) {
	try {
		console.debug('submitNewStory');
		evt.preventDefault();
		const $title = $('#story-name').val();
		const $author = $('#story-author').val();
		const $url = $('#story-url').val();
		const username = currentUser.username;
		const storyObject = {
			title: $title,
			author: $author,
			url: $url,
			username
		};
		$('#story-name').val('');
		$('#story-author').val('');
		$('#story-url').val('');
		await storyList.addStory(currentUser, storyObject);
		// console.log(newStory);
		// console.log(dataObject);
		getAndShowStoriesOnStart();
		$allStoriesList.show();
		$storyForm.hide();
	} catch (e) {
		console.log('submitNewStory Failed!', e);
	}
}

$storyForm.on('submit', submitNewStory);

async function enableOrDisableFavorites(evt) {
	console.debug('enableOrDisableFavorites');

	const $target = $(evt.target);
	// console.log($target);
	const $closestElement = $target.closest('li');
	// console.log($closestElement);
	const storyId = $closestElement.attr('id');
	// console.log(storyId);
	const story = storyList.stories.find((s) => s.storyId === storyId);

	if ($target.hasClass('fas')) {
		await currentUser.removeFromFavorites(story);
		$target.closest('i').toggleClass('fas far');
	} else {
		await currentUser.addToFavorites(story);
		$target.closest('i').toggleClass('fas far');
	}
}

$storyLists.on('click', '.star', enableOrDisableFavorites);
