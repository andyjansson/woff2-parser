var Promise = global.Promise || require('es6-promise').Promise,
	offsetBuffer = require('./lib/offset-buffer.js'),
	tags = require('./lib/tags.js'),
	decompress = require('./lib/decompress.js'),
	readBase128 = require('./lib/readbase128.js'),
	read255UShort = require('./lib/read255ushort.js'),
	brotli = require('brotli'),
	name = require('./lib/name'),
	os2 = require('./lib/os2');

module.exports = function (data) {
	return new Promise(function (resolve, reject) {
		var buf = new offsetBuffer(data),
			signature = buf.readUInt32BE();
			
		if (signature !== 0x774F4632) return reject();

		var flavor = buf.readUInt32BE(),
			woff = {
			flavor: (flavor === 0x4F54544F ? 'CFF' : 'TrueType'),
			totalSfntSize: data.readUInt32BE(16),
			majorVersion: data.readUInt16BE(24),
			minorVersion: data.readUInt16BE(26)
		};
		
		var numTables = buf.skip(4).readUInt16BE(),
			totalCompressedSize = buf.skip(6).readUInt32BE();
		
		buf.seek(48);
		var tableDirectories = {},
			uncompressedLength = 0;
		
		for (var i = 0; i < numTables; i++) {
			var flags = buf.readUInt8() & 0x1F,
				tag;
			
			if (flags == 0x3f) tag = buf.read(4).toString();
			else tag = tags[flags];
			
			var origLength = readBase128(buf),
				tableDirectory = {
				offset: uncompressedLength,
				origLength: origLength,
				transformLength: origLength
			};

			if (tag == 'glyf' || tag == 'loca') tableDirectory.transformLength = readBase128(buf);
			
			tableDirectories[tag] = tableDirectory;
			uncompressedLength += tableDirectory.transformLength;
		}
		
		if (flavor == 0x74746366) {
			var version = buf.readUInt32BE();
			var numFonts = read255UShort(buf);
			
			for (var i = 0; i < numFonts; i++) {
				var numTables2 = read255UShort(buf),
					flavor2 = buf.readUInt32BE();

				for (var j = 0; j < numTables2; j++) {
					read255UShort(buf);
				}
			}
		}

		var decompressedData = new Buffer(brotli.decompress(
			buf.read(totalCompressedSize), 
			uncompressedLength
		));
		
		if (!decompressedData) return reject();
		
		if ("name" in tableDirectories) {
			var table = tableDirectories["name"];
			woff.name = name(decompressedData.slice(table.offset, table.offset + table.transformLength ));
		}
		if ("OS/2" in tableDirectories) {
			var table = tableDirectories["OS/2"];
			woff["OS/2"] = os2(decompressedData.slice(table.offset, table.offset + table.transformLength ));
		}
		resolve(woff);
	});
};