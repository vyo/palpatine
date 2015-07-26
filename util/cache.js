
var cache = {};

module.exports.get = function (id, password) {

    var result = {"found":false}
    
    result.cookies = cache[id+password];
    if (result.cookies != undefined) {
        result.found=true;
    }

    return result;
}

module.exports.store = function (id, password, cookies) {
    cache[id+password]=cookies;
}
