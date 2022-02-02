'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
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

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

function formEventHandler(evt) {
	console.debug('formEventHandler');
	evt.preventDefault();
	const $title = $('#story-name').val();
	const $author = $('#story-author').val();
	const $url = $('#story-url').val();
	const dataObject = {
		title: $title,
		author: $author,
		url: $url
	};
	$('#story-name').val('');
	$('#story-author').val('');
	$('#story-url').val('');
	const newStory = new StoryList();
	newStory.secondAddStory('test', dataObject);
	// console.log(newStory);
	// console.log(dataObject);
	// getAndShowStoriesOnStart()
	$allStoriesList.show();
	$storyForm.hide();
	putStoriesOnPage();
}

$storyForm.on('submit', formEventHandler);

// TODO URGENT:
// LINE 69, the first argument of the class method does NOT need to be 'test' but instead the actual instance of the user that is currently logged in. You're going to hve to tweak that!!!
// the rest can stay
// try putting first function before the hide and show functions to see if the desired outcome happens after submitting a new story.
