module.exports = function (buf) {
	var offset = 0;
	return {
		buffer: buf,
		read: function () {
			if (arguments.length) {
				var length = arguments[0];
				var value = buf.slice(offset, offset + length);
				offset += length;
				return value;
			}
			return buf[offset++];
		},
		readInt8: function () {
			return buf.readInt8(offset++);
		},
		readInt16LE: function () {
			var val = buf.readInt16LE(offset);
			offset += 2;
			return val;
		},
		readInt16BE: function () {
			var val = buf.readInt16BE(offset);
			offset += 2;
			return val;
		},
		readInt32LE: function () {
			var val = buf.readInt32LE(offset);
			offset += 4;
			return val;
		},
		readInt32BE: function () {
			var val = buf.readInt32BE(offset);
			offset += 4;
			return val;
		},
		readFloatLE: function () {
			return buf.readFloatLE(offset++);
		},
		readFloatBE: function () {
			return buf.readFloatBE(offset++);
		},
		readDoubleLE: function () {
			return buf.readDoubleLE(offset++);
		},
		readDoubleBE: function () {
			return buf.readDoubleBE(offset++);
		},
		readUInt8: function () {
			return buf.readUInt8(offset++);
		},
		readUInt16LE: function () {
			var val = buf.readUInt16LE(offset);
			offset += 2;
			return val;
		},
		readUInt16BE: function () {
			var val = buf.readUInt16BE(offset);
			offset += 2;
			return val;
		},
		readUInt32LE: function () {
			var val = buf.readUInt32LE(offset);
			offset += 4;
			return val;
		},
		readUInt32BE: function () {
			var val = buf.readUInt32BE(offset);
			offset += 4;
			return val;
		},
		skip: function(bytes) {
			offset += bytes;
			return this;
		},
		seek: function (position) {
			offset = position;
			return this;
		},
		offset: function () {
			return offset;
		}
	};
};