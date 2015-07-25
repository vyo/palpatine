var hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');
var bunyan = require('bunyan');

var env = function (env) {
	return process.env[env];
};

var print = function (obj) {
	console.log(obj);
};


//ENVIRONMENT READ-IN
var PALPATINE_LOG_DIRECTORY = env('PALPATINE_LOG_DIRECTORY') || '.';
var PALPATINE_LOG_ROTATION = env('PALPATINE_LOG_ROTATION') || '1d';
var PALPATINE_LOG_RETENTION = Number(env('PALPATINE_LOG_RETENTION')) || 3;

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
var log = bunyan.createLogger({
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


log.info('nothing to see');
