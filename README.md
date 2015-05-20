# thunderjs
A Javascript library for a simple Observer pattern

How to use:

<h4>Create a new a new Observable:</h4>

var observable = Thunder.make()

<h4>Create a new Observer/Stream:</h4>

var stream = observable.subscribe();

<h4>React to changes to the observable:</h4>

stream.react(function onChange() {
  console.log('reacted');
});

<h4>Publish changes to the observable:</h4>

observable.publish('I have changed');

