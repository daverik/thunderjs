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

    this.getSubscribers = function() {
        return _this.observers.length;
    };

    function publish(msg) {
        var _event = Event.make(msg);
        _this.eventList.push(_event);
        _this.observers.forEach(function(observer) {
            observer.update(_event);
        });
    };

    function reject(data) {
        _this.observers.forEach(function(observer) {
            observer.reject(data);
        });
    };

    this.publish = publish;
    this.reject = reject;

}

function make(settings) {
    return new PubSub(settings);
}

function join() {
    var args = Array.prototype.slice.call(arguments);

    var ps = new PubSub();

    var publish = ps.publish,
        unsubscribe = ps.unsubscribe;

    var psTokens = [];

    args.forEach(function(_ps) {
        var token = _ps.subscribe();
        token.react(function() {
            publish.call(ps, 'changed');
        });
        psTokens.push({
            ps: _ps,
            token: token
        });
    });

    delete ps.publish;
    delete ps.reject;

    ps.unsubscribe = function(token) {
        psTokens.forEach(function(psToken) {            
            psToken.ps.unsubscribe(psToken.token);
        });

        unsubscribe.call(ps, token);
    }

    return ps;
}

exports.make = make;
exports.join = join;