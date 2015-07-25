const Browser = require('zombie');
const browser = new Browser();

var submitEmail = function (credentials, callback) {
	browser.fill('Email', credentials.Email) //'nodeappraise@gmail.com')
		.pressButton('signIn', submitPassword.bind(null, credentials, callback));
};
var submitPassword = function (credentials, callback) {
	console.log(credentials, callback);
	browser.fill('Passwd', credentials.Passwd) // 'AppraiseHerokuApp')
		.pressButton('signIn', getCookies.bind(null, callback));
};
var getCookies = function (callback) {
	console.log(callback);
	var cookieObject = browser.cookies;
	var cookieArray = [];
	for (var key in cookieObject) {
		var cookie = cookieObject[key].toString();
		cookieArray.push(cookie);
	}
	callback(cookieArray);

	browser.window.close();
};

/**
 expects:
 @param {object} credentials - a credentials object, e.g. { Email: 'me@mail.com', Passwd: 'super-secure'}
 @param {function} callback - a callback function

 provides:
 - an array containing all cookies after successful login
 */
module.exports.getGoogleAuthCookies = function (credentials, callback) {
	browser.visit("https://accounts.google.com/ServiceLogin", function () {
		submitEmail(credentials, callback);
	});
};
