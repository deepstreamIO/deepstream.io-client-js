var Record = require( '../../../src/record/record.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	options = { recordReadAckTimeout: 100, recordReadTimeout: 200 };

describe( 'supscriptions to local record changes', function(){
	var record,
		callback = jasmine.createSpy( 'firstnameCallback' ),
		generalCallback = jasmine.createSpy( 'generalCallback' ),
		anotherGeneralCallback = jasmine.createSpy( 'anotherGeneralCallback' ),
		connection = new MockConnection();

	it( 'creates the record', function(){
		record = new Record( 'testRecord', {}, connection, options, new ClientMock() );
		record.subscribe( generalCallback );
		record.subscribe( anotherGeneralCallback );
		expect( generalCallback ).not.toHaveBeenCalled();
		record._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, '{}' ]} );
		expect( generalCallback ).not.toHaveBeenCalled();
		expect( record.get() ).toEqual( {} );
	});

	it( 'subscribes to a path', function(){
		record.subscribe( 'firstname', callback );
		expect( callback ).not.toHaveBeenCalled();
	});

	it( 'sets a value', function(){
		record.set( 'firstname', 'Wolfram' );
		expect( generalCallback ).toHaveBeenCalledWith({ firstname: 'Wolfram' });
		expect( callback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( callback.calls.count() ).toEqual( 1 );
		expect( record.get() ).toEqual({ firstname: 'Wolfram' });
	});

	it( 'sets a value for a different path', function(){
		record.set( 'lastname', 'Hempel' );
		expect( callback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( callback.calls.count() ).toEqual( 1 );
		expect( record.get() ).toEqual({ firstname: 'Wolfram', lastname: 'Hempel' });
	});

	it( 'unsubscribes path', function(){
		record.set( 'firstname', 'Egon' );
		expect( callback ).toHaveBeenCalledWith( 'Egon' );
		expect( callback.calls.count() ).toEqual( 2 );

		record.unsubscribe( 'firstname', callback );

		record.set( 'firstname', 'Ray' );
		expect( callback.calls.count() ).toEqual( 2 );
	});

	it( 'unsubscribes general callback', function(){
		record.set( 'firstname', 'Egon' );
		expect( generalCallback ).toHaveBeenCalledWith({ firstname: 'Egon', lastname: 'Hempel' });
		expect( generalCallback.calls.count() ).toEqual( 5 );
		expect( anotherGeneralCallback ).toHaveBeenCalledWith({ firstname: 'Egon', lastname: 'Hempel' });
		expect( anotherGeneralCallback.calls.count() ).toEqual( 5 );

		record.unsubscribe( generalCallback );

		// This line ensures that unsubscribing something that wasnt registered
		// does nothing. See #190 if your curious
		record.unsubscribe( function() {} );

		record.set( 'firstname', 'Ray' );
		expect( generalCallback.calls.count() ).toEqual( 5 );
		expect( anotherGeneralCallback ).toHaveBeenCalledWith({ firstname: 'Ray', lastname: 'Hempel' });
		expect( anotherGeneralCallback.calls.count() ).toEqual( 6 );
	});

	it( 'subscribes to a deep path', function(){
		record.subscribe( 'addresses[ 1 ].street', callback );
		record.set( 'addresses[ 1 ].street', 'someStreet' );
		expect( callback ).toHaveBeenCalledWith( 'someStreet' );
		expect( callback.calls.count() ).toEqual( 3 );
	});

	it( 'is called when the whole record is set', function(){
		var record2 = new Record( 'testRecord2', {}, connection, options, new ClientMock() ),
			firstnameCb = jasmine.createSpy( 'firstname' ),
			brotherAgeCb = jasmine.createSpy( 'brotherAge' );

		record2._$onMessage({ topic: 'R', action: 'R', data: [ 'testRecord', 0, '{}' ]} );

		record2.subscribe( 'firstname', firstnameCb );
		record2.subscribe( 'brother.age', brotherAgeCb );

		expect( firstnameCb ).not.toHaveBeenCalled();
		expect( brotherAgeCb ).not.toHaveBeenCalled();

		record2.set({
			firstname: 'Wolfram',
			lastname: 'Hempel',
			brother: {
				name: 'secret',
				age: 28
			}
		});

		expect( firstnameCb ).toHaveBeenCalledWith( 'Wolfram' );
		expect( firstnameCb.calls.count() ).toBe( 1 );
		expect( brotherAgeCb ).toHaveBeenCalledWith( 28 );
		expect( brotherAgeCb.calls.count() ).toBe( 1 );
	});

	it( 'gets notified when the record is ready', function(){
		var record3 = new Record( 'testRecord', {}, connection, options, new ClientMock() ),
			readyEventListener = jasmine.createSpy( 'readyEventListener' ),
			readyCallback = jasmine.createSpy( 'readyCallback' );

		expect( record3.isReady ).toBe( false );

		record3.on( 'ready', readyEventListener );
		record3.whenReady( readyCallback );

		expect( readyEventListener ).not.toHaveBeenCalled();
		expect( readyCallback ).not.toHaveBeenCalled();

		record3._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, '{}' ]} );

		expect( record3.isReady ).toBe( true );
		expect( readyEventListener.calls.count() ).toBe( 1 );
		expect( readyCallback.calls.count() ).toBe( 1 );

		record3.whenReady( readyCallback );

		expect( readyCallback.calls.count() ).toBe( 2 );
	});
});

describe( 'record subscriptions callbacks', function(){
	var record,
		generalCallbackInWhenReady = jasmine.createSpy( 'generalInWhenReady' ),
		generalCallback = jasmine.createSpy( 'general' ),
		connection = new MockConnection();

	it( 'creates the record', function(){
		record = new Record( 'testRecord', {}, connection, options, new ClientMock() );

		record.subscribe( generalCallback );
		record.whenReady( function() {
			record.subscribe( generalCallbackInWhenReady, false );
		});
		expect( generalCallback ).not.toHaveBeenCalled();

		record._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, '{ "firstName": "oldName" }' ]} );
	});

	it( 'only triggers callbacks in subscribe methods in whenReady when explicitly set', function() {
		expect( generalCallbackInWhenReady ).not.toHaveBeenCalled();
	});

	it( 'triggers subscribes outside of whenReady on read', function() {
		expect( generalCallback ).toHaveBeenCalled();
	});
});

describe( 'it triggers the general callback for changes to nested objects', function(){
	var record;
	var generalCallback = jasmine.createSpy( 'general' );

	it( 'creates the record', function(){
		record = new Record( 'testRecord', {}, new MockConnection(), options, new ClientMock() );
		record._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, '{}' ]} );
	});

	it( 'subscribes to any change', function(){
		record.subscribe( generalCallback );
		expect( generalCallback ).not.toHaveBeenCalled();
	});

	it( 'sets an initial value', function(){
		record.set({
			a: {
				b: 'c'
			}
		});
		expect( generalCallback.calls.count() ).toBe( 1 );
	});

	it( 'invokes the general callback for changes to nested values', function(){
		record.set({
			a: {
				b: 'c'
			}
		});
		record.set( 'a.b', 'd' );
		expect( generalCallback.calls.count() ).toBe( 2 );
	});
});