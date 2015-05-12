var AnonymousRecord = require( '../../../src/record/anonymous-record' ),
	RecordHandler = require( '../../../src/record/record-handler' ),
	ClientMock = require( '../../mocks/client-mock' ),
	ConnectionMock = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = {};

describe( 'anonymous record allows switching of underlying records', function(){
	var anonymousRecord,
		recordHandler = new RecordHandler( options, new ConnectionMock(), new ClientMock() ),
		generalCallback = jasmine.createSpy( 'general' ),
		firstnameCallback = jasmine.createSpy( 'firstname' );

	it( 'creates the anonymous record', function(){
		anonymousRecord = new AnonymousRecord( recordHandler );
		expect( anonymousRecord.setName ).toBeDefined();
	});

	it( 'works before setName is called', function(){
		expect( anonymousRecord.get() ).toBe( undefined );
		expect( anonymousRecord.set ).toThrow();
		expect( anonymousRecord.name ).toBe( null );

		anonymousRecord.subscribe( 'firstname', firstnameCallback );
		anonymousRecord.subscribe( generalCallback );

		expect( firstnameCallback ).not.toHaveBeenCalled();
		expect( generalCallback ).not.toHaveBeenCalled();

		expect( recordHandler._connection.lastSendMessage ).toBe( null );
	});

	it( 'requests a record when setName is called', function(){
		anonymousRecord.setName( 'recordA' );
		expect( anonymousRecord.name ).toBe( 'recordA' );
		expect( recordHandler._connection.lastSendMessage ).toBe( msg( 'R|CR|recordA+' ) );
	});

	it( 'updates subscriptions once the record is ready', function(){
		expect( firstnameCallback ).not.toHaveBeenCalled();
		expect( generalCallback ).not.toHaveBeenCalled();

		recordHandler._$handle({
			topic: 'R',
			action: 'R',
			data: [ 'recordA', 1, '{"firstname":"Wolfram"}' ]
		});

		expect( firstnameCallback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( generalCallback ).toHaveBeenCalledWith({ firstname: 'Wolfram' });
	});

	it( 'doesn\'t do anything when another record changes', function(){
		recordHandler.getRecord( 'recordB' );

		recordHandler._$handle({
			topic: 'R',
			action: 'R',
			data: [ 'recordB', 1, '{"firstname":"Egon", "lastname":"Kowalski"}' ]
		});

		expect( firstnameCallback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( generalCallback ).toHaveBeenCalledWith({ firstname: 'Wolfram' });
	});

	it( 'updates subscriptions when the record changes to an existing record', function(){
		anonymousRecord.setName( 'recordB' );
		expect( anonymousRecord.name ).toBe( 'recordB' );
		expect( firstnameCallback ).toHaveBeenCalledWith( 'Egon' );
		expect( generalCallback ).toHaveBeenCalledWith({ firstname: 'Egon', lastname: 'Kowalski' });
	});

	it( 'proxies calls through to the underlying record', function(){
		expect( recordHandler.getRecord( 'recordB' ).get( 'lastname' ) ).toBe( 'Kowalski' );
		anonymousRecord.set( 'lastname', 'Schrader' );
		expect( recordHandler.getRecord( 'recordB' ).get( 'lastname' ) ).toBe( 'Schrader' );
	});
});