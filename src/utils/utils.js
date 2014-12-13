exports.isNode = function() {
	return typeof process !== 'undefined' && process.version;
};