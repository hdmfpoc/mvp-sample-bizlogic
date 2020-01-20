global.__isDebugMode = true;		//console debug message 표시 여부

var util = {};

util.log = function(msg) {
	if(__isDebugMode) console.log(msg);
}

module.exports = util;