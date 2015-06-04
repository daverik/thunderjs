function ObservableArray(_array, callbackChanged) {
	var arrObj = Object.getOwnPropertyNames(Array.prototype);
	var array = _array;
	var that = this;

    for (var funcKey in arrObj) {
    	if(typeof Array.prototype[arrObj[funcKey]] === 'function') {

    		var key = arrObj[funcKey];

    		this[arrObj[funcKey]] = (function(_key) {
    			var key = _key;

    			return function() {
    				var args = Array.prototype.slice.call(arguments);
    				if(callbackChanged) {
    					callbackChanged();
    				}
    				return _apply(key, args);
    			}
    		})(key);
    	}
    }

    function _apply(fnKey, args) {
    	array[fnKey].apply(array, args);
    }
}

exports.create = function(arr) {
	return new ObservableArray(arr);
}