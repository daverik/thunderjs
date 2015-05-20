function Event(msg) {
	var _msg = msg,
		_isRead = false;

	this.isRead = function() {
		return _isRead;
	}

	this.read = function() {
		_isRead = true;
		return _msg;
	}
}

function make(msg) {
	return new Event(msg);
}

exports.make = make;