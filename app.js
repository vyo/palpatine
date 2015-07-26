var Hapi = require('hapi');
var Joi = require('joi');
var HapiSwaggered = require('hapi-swaggered');
var HapiSwaggeredUi = require('hapi-swaggered-ui');
var Bunyan = require('bunyan');
var cache = require('./util/cache');
var browser = require('./util/browser');
//var browser = undefined;

var env = function (env) {
	return process.env[env];
};

var print = function (obj) {
	console.log(obj);
};


///////////////////
//ENVIRONMENT VARIABLES

//LOG VARIABLES
var PALPATINE_LOG_DIRECTORY = env('PALPATINE_LOG_DIRECTORY') || '.';
var PALPATINE_LOG_ROTATION = env('PALPATINE_LOG_ROTATION') || '1d';
var PALPATINE_LOG_RETENTION = Number(env('PALPATINE_LOG_RETENTION')) || 3;

//SERVER VARIABLES
var PALPATINE_SERVER_PORT = Number(env('PALPATINE_SERVER_PORT')) || 8080

///////////////////

///////////////////
//LOGGING

//LOG STREAMS
var stdoutStream = {
	stream: process.stdout, level: 'info'
};
var rotatingFileStream = {
	type: 'rotating-file',
	path: PALPATINE_LOG_DIRECTORY + '/palpatine.log',
	period: PALPATINE_LOG_ROTATION,   // daily rotation
	count: PALPATINE_LOG_RETENTION       // keep 3 back copies
};

//LOGS
var log = Bunyan.createLogger({
	name: 'palpatine', level: 'info',
	streams: [stdoutStream, rotatingFileStream]
});

//LOG VERBOSITY
if (process.env.NODE_ENV == 'test') {
	log.level('error');
}
else if (process.env.NODE_ENV == 'production') {
	log.level('info');
}
else {
	log.level('debug');
}


//END OF LOGGING
///////////////////


///////////////////
//SERVER SETUP
var server = new Hapi.Server();
server.connection({port: PALPATINE_SERVER_PORT, labels: ['api']});
module.exports = server;

var endpoints = {
    base: require('./route/base'),
    google: require('./route/authcookies/google')(log, cache, browser)
};

server.route(endpoints.base.GET);
server.route(endpoints.google.POST);

var plugins = {
    bunyan: require('./plugin/bunyan')(log),
    swagger: require('./plugin/swagger')
}

server.register(plugins.bunyan, plugins.bunyan.callback);
server.register(plugins.swagger.core, plugins.swagger.core.route, plugins.swagger.core.error);
server.register(plugins.swagger.ui, plugins.swagger.ui.route, plugins.swagger.ui.error);

//END OF SERVER SETUP
///////////////////

if (!module.parent) {
    server.start(function () {
        server.log('info', 'Server running at ' + server.info.uri);
    });
};
