var Event = require('./event'),
    Utils = require('./utils');

function Observable(id, eventList, settings) {
    this._id = id;
    this.settings = settings;
    var _reactFn = null,
        _rejectFn = null,
        _eventList = eventList,
        _useDebounce = false;
        _debounce = 0;

    var that = this;

    var api = {
        _id: that._id,
        react: function(reactFn, first) {
            if (!_reactFn) {
                _reactFn = reactFn;
                if(_useDebounce) {
                    _reactFn = Utils.debounce(_reactFn, _debounce)
                }
                if (that.settings.first) {
                    that.update(Event.make());
                }
            }
            return api;
        },
        debounce: function(time) {
            _useDebounce = true;
            if(_reactFn) {
                _reactFn = Utils.debounce(_reactFn, _debounce);
            }
            return api;
        },
        reject: function(rejectFn) {
            Utils.deprecate();
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

    this.notify = this.update;

    this.reject = function(data) {
        if (_rejectFn) {
            _rejectFn.call(api, data);
        }
    };

    this.expose = function() {
        return api;
    }
}

function make(id, eventList, settings) {
    var observable = new Observable(id, eventList, settings);
    return observable;
}

exports.make = make;