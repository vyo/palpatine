module.exports = function (log, cache, browser) {

    var Joi = require('joi');
    var cookie = {};

    cookie.POST = {
        method: 'POST',
        path: '/rest/authcookies/google',
        config: {
            tags: ['api'],
            description: 'Get authentication cookies for Google.',
            notes: 'Enables usage of Google sites and services requiring web authentication.',
            validate: {
                payload: Joi.object().keys({
                    Email: Joi.string().email().required().description('Gmail account'),
                    Passwd: Joi.string().required().description('Password'),
                    cache: Joi.boolean().optional().default(true, 'Store/load cookies using a cache; enabled by default.')
                })
            },
            handler: function (request, reply) {
                log.info(request.payload);
                var cacheEntry = cache.get(request.payload.Email, request.payload.Passwd);
                if (cacheEntry.found) {
                    reply(cacheEntry.cookies).code(200);
                }
                else {
                    cookies = browser.getGoogleAuthCookies(request.payload, reply);
                    cache.store(request.payload.Email, request.payload.Passwd, cookies);
                }
            }
        }    
    };
    return cookie;

}
