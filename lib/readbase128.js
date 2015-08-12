module.exports = function (buf) {
	var result = 0;
	for (var i = 0; i < 5; i++) {
		var code = buf.readUInt8();
		if (i == 0 && code == 0x80) break;
		if (result & 0xfe000000) break;
		result = (result << 7) | (code & 0x7f);
		if ((code & 0x80) == 0) return result;
	}
	throw "Font compression failure";
};