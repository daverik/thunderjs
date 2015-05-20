# thunderjs
A Javascript library for a simple Observer pattern

How to use:

Create a new a new Observable:

var observable = Thunder.make()

Create a new Observer/Stream:

var stream = observable.subscribe();

React to changes to the observable:

stream.react(function onChange() {
});
