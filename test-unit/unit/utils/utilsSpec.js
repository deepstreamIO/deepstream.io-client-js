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

describe( 'deepCopy', function(){

	it( 'copies primitives', function(){
		expect( utils.deepCopy( 'bla' ) ).toBe( 'bla' );
		expect( utils.deepCopy( 42 ) ).toBe( 42 );
	});

	it( 'copies arrays', function(){
		var original = [ 'a', 'b', 2 ],
			copy = utils.deepCopy( original );

		expect( copy ).toEqual( original );
		expect( copy ).not.toBe( original );
	});

	it( 'copies objects', function(){
		var original = { firstname: 'Wolfram', lastname:' Hempel' },
			copy = utils.deepCopy( original );

		expect( copy ).toEqual( original );
		expect( copy ).not.toBe( original );
	});

	it( 'copies objects with null values', function(){
		var original = { firstname: 'Wolfram', lastname: null },
			copy = utils.deepCopy( original );

		expect( copy ).toEqual( original );
		expect( copy ).not.toBe( original );
	});

	it( 'copies null values', function(){
		var copy = utils.deepCopy( null );
		expect( copy ).toBeNull();
	});

	it( 'copies nested values', function(){
		var original = { a: { b: 'c', d: 4 } };
		var copy = utils.deepCopy( original );
		expect( original ).toEqual( copy );
		expect( original.a ).not.toBe( copy.a );
	});

	it( 'copies nested arrays', function(){
		var original = { a: { b: 'c', d: [ 'a', { x: 'y' }] } };
		var copy = utils.deepCopy( original );
		expect( original ).toEqual( copy );
		expect( original.a.d ).not.toBe( copy.a.d );
		expect( Array.isArray( copy.a.d ) ).toBe( true );
		expect( copy.a.d[ 1 ] ).toEqual( { x: 'y' });
		expect( original.a.d[ 1 ] === copy.a.d[ 1 ] ).toBe( false );
	});

	//This is a JSON.stringify specific behaviour. Not too sure it's ideal,
	//but it is something that will break behaviour when changed, so let's
	//keep an eye on it
	it( 'converts undefined', function(){
		var copy = utils.deepCopy([ undefined ]);
		expect( copy[ 0 ] ).toBe( null );

		copy = utils.deepCopy({ x: undefined });
		expect( copy ).toEqual( {} );
	});
});

describe( 'utils.trim removes whitespace', function(){
	it( 'removes various kinds of whitespace', function(){
		expect( utils.trim( 'a  	') ).toEqual( 'a' );
		expect( utils.trim( ' 	b  	') ).toEqual( 'b' );
		expect( utils.trim( ' 	c d  	') ).toEqual( 'c d' );
	});
});

//As these tests are only ever run in node, this is a bit pointless
describe( 'utils.isNode detects the environment', function(){
	it( 'has detected something', function(){
		expect( typeof utils.isNode ).toBe( 'boolean' );
	});
});

describe( 'utils.parseUrl adds all missing parts of the url', function(){
	it( 'accepts no protocol and default to ws', function(){
		expect( utils.parseUrl( 'localhost', '/deepstream' ) )
			.toBe( 'ws://localhost/deepstream' );
	});

	it( 'accepts // as protocol', function(){
		expect( utils.parseUrl( '//localhost:6020', '/deepstream' ) )
			.toBe( 'ws://localhost:6020/deepstream' );
	});

	it( 'accepts ws protocols', function(){
		expect( utils.parseUrl( 'ws://localhost:6020', '/deepstream' ) )
			.toBe( 'ws://localhost:6020/deepstream' );
		expect( utils.parseUrl( 'wss://localhost:6020', '/deepstream' ) )
			.toBe( 'wss://localhost:6020/deepstream' );
	});

	it( 'rejects http protocols', function(){
		expect( function() {
			utils.parseUrl( 'http://localhost:6020', '/deepstream' )
		}).toThrow( new Error('Only ws and wss are supported') );
		expect( function() {
			utils.parseUrl( 'https://localhost:6020', '/deepstream' )
		}).toThrow( new Error('Only ws and wss are supported') );
	});

	it( 'accepts full url with protocol and path and doesn\'t change it', function(){
		expect( utils.parseUrl( 'ws://localhost:6020/anotherdeepstream' ) )
			.toBe( 'ws://localhost:6020/anotherdeepstream' );
	});

	it( 'respects queries and hash', function(){
		expect( utils.parseUrl( 'localhost?query=value#login', '/deepstream' ) )
			.toBe( 'ws://localhost/deepstream?query=value#login' );
	});
});