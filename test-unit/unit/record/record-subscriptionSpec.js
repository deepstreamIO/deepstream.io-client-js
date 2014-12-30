var Record = require( '../../../src/record/record.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	options = { recordReadAckTimeout: 100, recordReadTimeout: 200 };

describe( 'supscriptions to local record changes', function(){
	var record,
		callback = jasmine.createSpy( 'firstnameCallback' ),
		connection = new MockConnection();

	it( 'creates the record', function(){
		record = new Record( 'testRecord', {}, connection, options );
		record._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, {} ]} );
		expect( record.get() ).toEqual( {} );
	});

	it( 'subscribes to a path', function(){
		record.subscribe( 'firstname', callback );
		expect( callback ).not.toHaveBeenCalled();
	});

	it( 'sets a value', function(){
		record.set( 'firstname', 'Wolfram' );
		expect( callback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( callback.calls.length ).toEqual( 1 );
		expect( record.get() ).toEqual({ firstname: 'Wolfram' });
	});

	it( 'sets a value for a different path', function(){
		record.set( 'lastname', 'Hempel' );
		expect( callback ).toHaveBeenCalledWith( 'Wolfram' );
		expect( callback.calls.length ).toEqual( 1 );
		expect( record.get() ).toEqual({ firstname: 'Wolfram', lastname: 'Hempel' });
	});

	it( 'unsubscribes', function(){
		record.set( 'firstname', 'Egon' );
		expect( callback ).toHaveBeenCalledWith( 'Egon' );
		expect( callback.calls.length ).toEqual( 2 );
		record.unsubscribe( 'firstname', callback );
		record.set( 'firstname', 'Ray' );
		expect( callback ).toHaveBeenCalledWith( 'Egon' );
		expect( callback.calls.length ).toEqual( 2 );
	});

	it( 'subscribes to a deep path', function(){
		record.subscribe( 'addresses[ 1 ].street', callback );
		record.set( 'addresses[ 1 ].street', 'someStreet' );
		expect( callback ).toHaveBeenCalledWith( 'someStreet' );
		expect( callback.calls.length ).toEqual( 3 );
	});

	it( 'is called when the whole record is set', function(){
		var record2 = new Record( 'testRecord2', {}, connection, options ),
			firstnameCb = jasmine.createSpy( 'firstname' ),
			brotherAgeCb = jasmine.createSpy( 'brotherAge' );

		record2._$onMessage({ topic: 'RECORD', action: 'R', data: [ 'testRecord', 0, {} ]} );

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
		expect( firstnameCb.calls.length ).toBe( 1 );
		expect( brotherAgeCb ).toHaveBeenCalledWith( 28 );
		expect( brotherAgeCb.calls.length ).toBe( 1 );
	});
});