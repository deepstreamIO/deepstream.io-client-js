var utils = require( '../../../src/utils/utils' );

describe( 'deepEquals', function(){

	it( 'compares two primitive values', function(){
		var a = 'A',
			b = 'B';
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'compares two different simple objects', function(){
		var a = { name: 'Wolfram' },
			b = { name: 'Egon' };
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'compares two equal simple objects', function(){
		var a = { name: 'Wolfram' },
			b = { name: 'Wolfram' };
		expect( utils.deepEquals( a, b ) ).toBe( true );
	});

	it( 'compares two different arrays', function(){
		var a = [ 'a', 'b' ],
			b = [ 'a', 'c' ];
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'compares two equal arrays', function(){
		var a = [ 'a', 'b' ],
			b = [ 'a', 'b' ];
		expect( utils.deepEquals( a, b ) ).toBe( true );
	});

	it( 'compares two different complex objects', function(){
		var a = { x: 'y', a: [ 'b', { q: 'f' } ] },
			b = { x: 'y', a: [ 'b', { q: 'x' } ] };
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'compares two equal complex objects', function(){
		var a = { x: 'y', a: [ 'b', { q: 'f' } ] },
			b = { x: 'y', a: [ 'b', { q: 'f' } ] };
		expect( utils.deepEquals( a, b ) ).toBe( true );
	});

	it( 'a complex object and a primitive', function(){
		var a = { x: 'y', a: [ 'b', { q: 'f' } ] },
			b = 44;
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'handles undefined', function(){
		var a = undefined, // jshint ignore:line
			b = { x: 'y', a: [ 'b', { q: 'f' } ] };
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});	

	it( 'handles empty objects', function(){
		var a = {},
			b = { firstname: 'Wolfram' };
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});

	it( 'finds additional paths on objB', function(){
		var a = { a: 'b' },
			b = { a: 'b', c: 'd' };
		expect( utils.deepEquals( a, b ) ).toBe( false );
	});
});

describe( 'shallow copy', function(){

	it( 'copies primitives', function(){
		expect( utils.shallowCopy( 'bla' ) ).toBe( 'bla' );
		expect( utils.shallowCopy( 42 ) ).toBe( 42 );
	});

	it( 'copies arrays', function(){
		var original = [ 'a', 'b', 2 ],
			copy = utils.shallowCopy( original );
		
		expect( copy ).toEqual( original );
		expect( copy ).not.toBe( original );
	});

	it( 'copies objects', function(){
		var original = { firstname: 'Wolfram', lastname:' Hempel' },
			copy = utils.shallowCopy( original );
		
		expect( copy ).toEqual( original );
		expect( copy ).not.toBe( original );
	});
});