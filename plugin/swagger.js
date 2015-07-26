var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

module.exports.core =
{
	register: hapiSwaggered,
	options: {
		tags: {
			'/': 'Palpatine'
		},
		info: {
			title: 'Palpatine API',
			description: 'Come to the Dark side, we have cookies! \nGet authentication cookies without firing up your browser.',
			version: '0.1.0'
		}
	},
	route: {
		select: 'api',
		routes: {
			prefix: '/swagger'
		}
	},
	error: function (err) {
		if (err) {
			throw err
		}
	}
};


module.exports.ui =
{
	register: hapiSwaggeredUi,
	options: {
		title: 'Palpatine API',
		authorization: {
			//field: 'apiKey',
			scope: 'query' // header works as well
			// valuePrefix: 'bearer '// prefix incase
		}
	},
	route: {
		select: 'api',
		routes: {
			prefix: '/api'
		}
	},
	error: function (err) {
		if (err) {
			throw err
		}
	}
};
