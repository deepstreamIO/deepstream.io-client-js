var messageBuilder = require( '../../../src/message/message-builder' ),
	messageParser = require( '../../../src/message/message-parser' );

/* global it, describe, expect */	
describe( 'variable types are serialized and deserialized correctly', function(){
	
	it( 'processes strings correctly', function(){
		var input = 'Wolfram',
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'SWolfram' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
	
	it( 'processes objects correctly', function(){
		var input = { firstname: 'Wolfram' },
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'O{"firstname":"Wolfram"}' );
		expect( messageParser.convertTyped( typed ) ).toEqual( input );
	});
	
	it( 'processes arrays correctly', function(){
		var input = [ 'a', 'b', 'c' ],
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'O["a","b","c"]' );
		expect( messageParser.convertTyped( typed ) ).toEqual( input );
	});
	
	it( 'processes integers correctly', function(){
		var input = 42,
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'N42' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
	
	it( 'processes floats correctly', function(){
		var input = 0.543,
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'N0.543' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
	
	it( 'processes null values correctly', function(){
		var input = null,
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'L' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
	
	it( 'processes Boolean true correctly', function(){
		var input = true,
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'T' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
	
	it( 'processes Boolean false correctly', function(){
		var input = false,
			typed = messageBuilder.typed( input );
			
		expect( typed ).toBe( 'F' );
		expect( messageParser.convertTyped( typed ) ).toBe( input );
	});
		
	it( 'processes undefined correctly', function(){
		var typed = messageBuilder.typed();
			
		expect( typed ).toBe( 'U' );
		expect( messageParser.convertTyped( typed ) ).toBe( undefined );
	});
});