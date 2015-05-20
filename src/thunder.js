var Observable = require('./observable'),
	Event = require('./event');

function PubSub() {
	this.eventList = [];
	this.observers = [];
	this.idCounter = 0;
}

PubSub.prototype.subscribe = function() {
	var _observable = Observable.make(this.idCounter++, this.eventList);
	this.observers.push(_observable);
	return _observable.expose();
};

PubSub.prototype.unsubscribe = function(exposedObservable) {
	var index = -1;
	for(var i = 0; i < this.observers.length; i++) {
		if(exposedObservable._id === this.observers[i]._id) {
			index = i;
			break;
		}
	}
	if(index !== -1) {
		this.observers.splice(index, 1);
	}

};

PubSub.prototype.publish = function(msg) {
	var _event = Event.make(msg);
	this.eventList.push(_event);
	this.observers.forEach(function(observer) {
		observer.update(_event);
	});
};

PubSub.prototype.reject = function(data) {
	this.observers.forEach(function(observer) {
		observer.reject(data);
	});
};

function make() {
	return new PubSub();
}

exports.make = make;