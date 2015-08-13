var path = require('path');
var fs = require('fs');
var woff2 = require('../');
var assert = require('assert');
var expected = require('./expected.json');

fs.readFile(path.join(__dirname, 'pathFont.woff2'), function (err, contents) {
	woff2(contents).then(function (results) {
		assert.deepEqual(results, expected);
	});
});
