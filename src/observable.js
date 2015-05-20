var Event = require('./event');

function Observable(id, eventList) {
    this._id = id;
    var _reactFn = null,
        _rejectFn = null,
        _eventList = eventList;

    var that = this;

    var api = {
        _id: that._id,
        react: function(reactFn) {
            _reactFn = reactFn;
            that.update(Event.make());
            return api;
        },
        reject: function(rejectFn) {
            _rejectFn = rejectFn;
            return api;
        },
        first: function() {
            if (_eventList.length) {
                return _eventList[0];
            } else {
                return null;
            }
        }
    };

    this.update = function(event) {
        if (_reactFn) {
            _reactFn.call(api, event);
        }
    };

    this.reject = function(data) {
        if (_rejectFn) {
            _rejectFn.call(api, data);
        }
    };

    this.expose = function() {
        return api;
    }
}

function make(id, eventList) {
    var observable = new Observable(id, eventList);
    return observable;
}

exports.make = make;