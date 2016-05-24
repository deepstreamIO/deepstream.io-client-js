var Record = require( '../../../src/record/record.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	ClientMock = require( '../../mocks/client-mock' ),
	options = { recordReadAckTimeout: 100, recordReadTimeout: 200 };

describe( 'setting values sends the right messages to the server', function(){
	var record,
		callback = jasmine.createSpy( 'firstnameCallback' ),
		connection = new MockConnection();

	it( 'creates the record', function(){
		expect( connection.lastSendMessage ).toBe( null );
		record = new Record( 'testRecord', {}, connection, options, new ClientMock() );
		record._$onMessage({ topic: 'R', action: 'R', data: [ 'testRecord', 0, '{}' ]} );
		expect( record.get() ).toEqual( {} );
		expect( connection.lastSendMessage ).toBe( msg( 'R|CR|testRecord+' ) );
	});

	it( 'sends update messages for entire data changes', function(){
		record.set({ firstname: 'Wolfram' });
		expect( connection.lastSendMessage ).toBe( msg( 'R|U|testRecord|1|{"firstname":"Wolfram"}+' ) );
	});

	it( 'sends update messages for path changes ', function(){
		record.set( 'lastname', 'Hempel' );
		expect( connection.lastSendMessage ).toBe( msg( 'R|P|testRecord|2|lastname|SHempel+' ) );
	});

	it( 'deletes value when sending undefined', function(){
		record.set( 'lastname', undefined );
		expect( connection.lastSendMessage ).toBe( msg( 'R|P|testRecord|3|lastname|U+' ) );
		expect( record.get() ).toEqual( { firstname: 'Wolfram' } );
	});

	it( 'throws error for invalid record data', function(){ 
		expect(function(){ record.set( undefined ); }).toThrow();
	});
});