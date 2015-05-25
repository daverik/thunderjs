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
});