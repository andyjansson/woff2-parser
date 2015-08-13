var path = require('path');
var fs = require('fs');
var woff2 = require('../');
var assert = require('assert');
var expected = require('./expected.json');

describe('woff2-parser', function () {
	it('can parse .woff2 fonts', function (done) {
		fs.readFile(path.join(__dirname, 'pathFont.woff2'), function (err, contents) {
			if (err) throw err;
			woff2(contents).then(function (results) {
				assert.deepEqual(results, expected);
				done();
			}, function () {
				assert.fail("Parsing font failed");
			});
		});
	});
});
