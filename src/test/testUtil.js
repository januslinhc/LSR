// node.js only
var crypto = require('crypto');

module.exports = (function () {
    function randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function randomString (howMany, chars) {
        chars = chars 
            || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        var rnd = crypto.randomBytes(howMany)
            , value = new Array(howMany)
            , len = chars.length;

        for (var i = 0; i < howMany; i++) {
            value[i] = chars[rnd[i] % len]
        };

        return value.join('');
    }

    return {
        randomInt    : randomInt,
        randomString : randomString
    }
}())
