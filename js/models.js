'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
	/** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   *	- Think of constructor functions on classes as a way of setting properties on a class whenever it is invoked so that the instances can be used with the arguments passed. 
   */

	constructor({ storyId, title, author, url, username, createdAt }) {
		this.storyId = storyId;
		this.title = title;
		this.author = author;
		this.url = url;
		this.username = username;
		this.createdAt = createdAt;
	}

	/** Parses hostname out of URL and returns it. */

	getHostName() {
		// UNIMPLEMENTED: complete this function!
		const url = new URL(this.url);
		// url variable uses URL() API class to generate a url object from the string passed which contains a hostname property which will have the domain name as the value for the url passed.
		// NOTE: if the url is not in a valid format (missing http:// or https://)

		return url.host;
		// returns the value of the hostname property from url object.
	}
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
	constructor(stories) {
		this.stories = stories;
	}

	/** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

	// NOTE: static keywowd makes function callable on the class itself NOT the new instance of the class that is created via variables.
	static async getStories() {
		// Note presence of `static` keyword: this indicates that getStories is
		//  **not** an instance method. Rather, it is a method that is called on the
		//  class directly. Why doesn't it make sense for getStories to be an
		//  instance method?
		// POSSIBLE ANSWER: because getStories should only be run from the class itself instead of a varible as it will call the list every time? Prevents duplication.

		// query the /stories endpoint (no auth required)
		const response = await axios({
			url: `${BASE_URL}/stories`,
			method: 'GET'
		});

		// turn plain old story objects from API into instances of Story class
		const stories = response.data.stories.map((story) => new Story(story));

		// build an instance of our own class using the new array of stories
		return new StoryList(stories);
	}

	/** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

	async addStory(user, { title, author, url }) {
		// UNIMPLEMENTED: complete this function!
		// this line correlates with User class which is where the user information is being accessed from and where the token is stored.
		const token = user.loginToken;
		const res = await axios({
			method: 'POST',
			url: `${BASE_URL}/stories`,
			data: { token, story: { title, author, url } }
		});
		const story = new Story(res.data.story);
		this.stories.unshift(story);
		user.ownStories.unshift(story);
		// line above is making sure the most recent story is pushed to the front of the list (basically making sure that the most recent story is displayed in website). List of stories is created whenever the instance of storyList is called.
		// unsure if this is what is being requested.
		return story;
		// function returns a new instance of story class.
	}

	async deleteStory(user, storyId) {
		const token = user.loginToken;
		await axios({
			method: 'DELETE',
			url: `${BASE_URL}/stories/${storyId}`,
			data: { token: token }
		});

		// logic below removes the specified story id from the MASTER story list (which is passed originally)
		this.stories = this.stories.filter((s) => s.storyId !== storyId);

		user.ownStories = user.ownStories.filter((s) => s.storyId !== storyId);
		user.favorites = user.favorites.filter((s) => s.storyId !== storyId);
	}
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
	/** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

	constructor({ username, name, createdAt, favorites = [], ownStories = [] }, token) {
		this.username = username;
		this.name = name;
		this.createdAt = createdAt;

		// instantiate Story instances for the user's favorites and ownStories
		this.favorites = favorites.map((s) => new Story(s));
		this.ownStories = ownStories.map((s) => new Story(s));

		// store the login token on the user so it's easy to find for API calls.
		this.loginToken = token;
	}

	/** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

	static async signup(username, password, name) {
		const response = await axios({
			url: `${BASE_URL}/signup`,
			method: 'POST',
			data: { user: { username, password, name } }
		});

		let { user } = response.data;

		return new User(
			{
				username: user.username,
				name: user.name,
				createdAt: user.createdAt,
				favorites: user.favorites,
				ownStories: user.stories
			},
			response.data.token
		);
	}

	/** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

	static async login(username, password) {
		const response = await axios({
			url: `${BASE_URL}/login`,
			method: 'POST',
			data: { user: { username, password } }
		});

		let { user } = response.data;

		return new User(
			{
				username: user.username,
				name: user.name,
				createdAt: user.createdAt,
				favorites: user.favorites,
				ownStories: user.stories
			},
			response.data.token
		);
	}

	/** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

	static async loginViaStoredCredentials(token, username) {
		try {
			const response = await axios({
				url: `${BASE_URL}/users/${username}`,
				method: 'GET',
				params: { token }
			});

			let { user } = response.data;

			return new User(
				{
					username: user.username,
					name: user.name,
					createdAt: user.createdAt,
					favorites: user.favorites,
					ownStories: user.stories
				},
				token
			);
		} catch (err) {
			console.error('loginViaStoredCredentials failed', err);
			return null;
		}
	}

	// function pushes story to empty favorites array.
	async addToFavorites(story) {
		this.favorites.push(story);
		await this.addOrRemoveFromFavorites('add', story);
	}

	// function will filter the favorites array and return a new array that does NOT contain the specific story.storyId.
	async removeFromFavorites(story) {
		this.favorites = this.favorites.filter((s) => s.storyId !== story.storyId);
		await this.addOrRemoveFromFavorites('remove', story);
	}

	// function will change the status (add or remove from favorites array) of a story depending on which function this function is run under.
	async addOrRemoveFromFavorites(storyStatus, story) {
		let method;
		if (storyStatus === 'add') {
			method = 'POST';
		} else if (storyStatus === 'remove') {
			method = 'DELETE';
		}
		const token = this.loginToken;
		await axios({
			url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
			method: method,
			data: { token }
		});
	}

	// function was taken from solution code!
	// purpose of fucntion is to review the Story class and verify if any of the instances are favorites for the logged in user (boolean function).
	isFavorite(story) {
		return this.favorites.some((s) => s.storyId === story.storyId);
	}
}
