var Thunder = require('../src/thunder');

describe('Tests the thunder app', function() {
	it('should create a thunder object', function() {
		expect(Thunder.make()).toBeDefined();
	});

	it('should react immediately', function() {

		var reacted = false;

		var thunder = Thunder.make();

		thunder.subscribe().react(function() {
			reacted = true;
		});

		expect(reacted).toBe(true);
	});

	it('should NOT react immediately', function() {

		var reacted = false;

		var thunder = Thunder.make({
			first: false
		});

		thunder.subscribe().react(function() {
			reacted = true;
		});

		expect(reacted).toBe(false);
	});

	it('should react on first publish only', function() {

		var reacted = false;

		var thunder = Thunder.make({
			first: false
		});

		thunder.subscribe().react(function() {
			reacted = true;
		});

		expect(reacted).toBe(false);

		thunder.publish();

		expect(reacted).toBe(true);		
	});

	it('should react', function() {

		var counter = 0,
			msg = null;

		var thunder = Thunder.make();

		var token = thunder.subscribe();
		var thunder2 = Thunder.make()
		var token2 = thunder2.subscribe();

		token.react(function() {
			counter++;
		});

		token2.react(function(eventMsg) {
			msg = eventMsg.read();
		});

		thunder.publish('test');
		thunder.publish('test');
		thunder.publish('test');

		token.react(function() {});

		thunder.publish('test');
		thunder.publish('test');


		thunder2.publish('hello');


		expect(counter).toBe(6);
		expect(msg).toBe('hello');
	});

	it('should react, but not on first', function() {

		var counter = 0;

		var thunder = Thunder.make({
			first: false
		});

		var token = thunder.subscribe();

		token.react(function() {
			counter++;
		});

		thunder.publish('test');
		thunder.publish('test');
		thunder.publish('test');

		token.react(function() {});

		thunder.publish('test');
		thunder.publish('test');

		expect(counter).toBe(5);

	});
});