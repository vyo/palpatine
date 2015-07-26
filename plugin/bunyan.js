module.exports = function (log) {
	return {
		register: require('hapi-bunyan'),
		options: {
			logger: log
		},
		callback: function (err) {
			if (err) {
				throw err;
			}
		}
	}
};
