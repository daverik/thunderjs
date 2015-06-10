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

	it('should have correctly bound this', function() {
		var thunder = Thunder.make();

		var subscribe = thunder.subscribe;

		var token = subscribe();

		expect(token).toBeDefined();
	});

	it('should join two thunders', function() {
		var thunder1 = Thunder.make(),
			thunder2 = Thunder.make();

		var joinedThunder = Thunder.join(thunder1, thunder2);

		var counter = 0;

		var token = joinedThunder.subscribe();

		token.react(function() {
			counter++;
		});

		thunder1.publish();
		thunder2.publish();

		expect(counter).toBe(3);
		expect(joinedThunder.publish).toBeUndefined();
		expect(thunder1.publish).toBeDefined();

		expect(joinedThunder.getSubscribers()).toBe(1);

		joinedThunder.unsubscribe(token);

		expect(joinedThunder.getSubscribers()).toBe(0);

	});

	it('should join two thunders from an array', function() {
		var thunder1 = Thunder.make(),
			thunder2 = Thunder.make();

		var joinedThunder = Thunder.join([thunder1, thunder2]);

		var counter = 0;

		var token = joinedThunder.subscribe();

		token.react(function() {
			counter++;
		});

		thunder1.publish();
		thunder2.publish();

		expect(counter).toBe(3);
		expect(joinedThunder.publish).toBeUndefined();
		expect(thunder1.publish).toBeDefined();

		expect(joinedThunder.getSubscribers()).toBe(1);

		joinedThunder.unsubscribe(token);

		expect(joinedThunder.getSubscribers()).toBe(0);

	});

	it('should debounce', function(done) {
		var thunder = Thunder.make({
			first: false
		});

		var token = thunder.subscribe();

		var reacted = false,
			counter = 0;

		token.react(function() {
			reacted = true;
			++counter;
		}).debounce(5);

		thunder.publish();

		expect(reacted).toBe(false);

		setTimeout(function() {
			expect(reacted).toBe(true);
			expect(counter).toBe(1);
			done();
		}, 10);
	});

	it('should debounce 2', function(done) {
		var thunder = Thunder.make({
			first: false
		});

		var token = thunder.subscribe();

		var counter = 0;

		token.debounce(300).react(function() {
			++counter;
		});

		thunder.publish();
		thunder.publish();
		thunder.publish();

		setTimeout(function() {
			expect(counter).toBe(1);
			done();
		}, 10);
	});
});