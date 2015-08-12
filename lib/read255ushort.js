module.exports = function (buf) {
	var code = buf.readUInt8();
	var value = code;
	if (code === 253) {
		value = buf.readUInt8();
		value <<= 8;
		value &= 0xff00;
		var value2 = buf.readUInt8();
		value |= value2 & 0x00ff;
	}
	else if (code === 255) {
		value = buf.readUInt8();
		value += 253;
	}
	else if (code === 254) {
		value = buf.readUInt8();
		value += 506;
	}
	return value;
};