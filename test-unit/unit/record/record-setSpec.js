var Record = require( '../../../src/record/record.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = { recordReadAckTimeout: 100, recordReadTimeout: 200 };

describe( 'setting values sends the right messages to the server', function(){
	var record,
		callback = jasmine.createSpy( 'firstnameCallback' ),
		connection = new MockConnection();

	it( 'creates the record', function(){
		expect( connection.lastSendMessage ).toBe( null );
		record = new Record( 'testRecord', {}, connection, options );
		record._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, {} ]} );
		expect( record.get() ).toEqual( {} );
		expect( connection.lastSendMessage ).toBe( msg( 'RECORD|CR|testRecord+' ) );
	});

	it( 'sends update messages for entire data changes', function(){
		record.set({ firstname: 'Wolfram' });
		expect( connection.lastSendMessage ).toBe( msg( 'RECORD|U|testRecord|1|{"firstname":"Wolfram"}+' ) );
	});

	it( 'sends update messages for path changes ', function(){
		record.set( 'lastname', 'Hempel' );
		expect( connection.lastSendMessage ).toBe( msg( 'RECORD|P|testRecord|2|lastname|SHempel+' ) );
	});
});