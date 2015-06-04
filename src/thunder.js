var Observable = require('./observable'),
    Event = require('./event');

function PubSub(settings) {

    var defaultSettings = {
        first: true
    };

    var _this = this;

    this.settings = defaultSettings;

    for (var property in settings) {
        if (settings.hasOwnProperty(property)) {
            this.settings[property] = settings[property];
        }
    }

    this.settings = Object.freeze(this.settings);
    this.eventList = [];
    this.observers = [];
    this.idCounter = 0;

    this.subscribe = function() {
        var _observable = Observable.make(_this.idCounter++, _this.eventList, _this.settings);
        _this.observers.push(_observable);
        return _observable.expose();
    };

    this.unsubscribe = function(exposedObservable) {
        var index = -1;
        for (var i = 0; i < _this.observers.length; i++) {
            if (exposedObservable._id === _this.observers[i]._id) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            _this.observers.splice(index, 1);
        }

    };

    this.publish = function(msg) {
        var _event = Event.make(msg);
        _this.eventList.push(_event);
        _this.observers.forEach(function(observer) {
            observer.update(_event);
        });
    };

    this.reject = function(data) {
        _this.observers.forEach(function(observer) {
            observer.reject(data);
        });
    };

}

function make(settings) {
    return new PubSub(settings);
}

exports.make = make;