var jsonPath = require( '../../../src/record/json-path' );
var utils = require( '../../../src/utils/utils' );

describe('paths are tokenized and retrieved correctly', function(){
	var testRecord = { _$data: {
		firstname: 'Wolfram',
		lastname: 'Hempel',
		address:{
			street: 'currentStreet'
		},
		pastAddresses: [
			{ street: 'firststreet', postCode: 1001 },
			{ street: 'secondstreet', postCode: 2002 }
		],
		1234: 'integer index'
	}};

	beforeEach( function() {
		jasmine.addCustomEqualityTester(utils.deepEquals);
	} );

	it( 'retrieves simple paths', function(){
		expect( jsonPath.get( testRecord._$data, 'firstname') ).toBe( 'Wolfram' );
	});

	it( 'retrieves nested paths', function(){
		expect( jsonPath.get( testRecord._$data, 'address.street' ) ).toBe( 'currentStreet' );
	});

	it( 'retrieves array entries', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[1]' ) ).toEqual( { street: 'secondstreet', postCode: 2002 } );
	});

	it( 'retrieves other array entries', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[0]' ) ).toEqual( { street: 'firststreet', postCode: 1001 } );
	});

	it( 'retrieves values from objects within arrays', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[0].postCode' ) ).toBe( 1001 );
	});

	it( 'handles whitespace', function(){
		expect( jsonPath.get( testRecord._$data, ' pastAddresses[ 1 ].postCode ' ) ).toBe( 2002 );
	});

	it( 'handles integers', function(){
		expect( jsonPath.get( testRecord._$data, 1234 ) ).toBe( 'integer index' );
	});

	it( 'returns undefined for non existing keys', function(){
		expect( jsonPath.get( testRecord._$data, 'doesNotExist' ) ).toBe( undefined );
	});

	it( 'returns undefined for non existing nested keys', function(){
		expect( jsonPath.get( testRecord._$data, 'address.number' ) ).toBe( undefined );
	});

	it( 'returns undefined for existing array indices', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[3]' ) ).toBe( undefined );
	});

	it( 'returns undefined for negative array indices', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[-1]' ) ).toBe( undefined );
	});

	it( 'detects changes', function(){
		expect( jsonPath.get( testRecord._$data, 'firstname' ) ).toBe( 'Wolfram' );
		testRecord._$data.firstname = 'Egon';
		expect( jsonPath.get( testRecord._$data, 'firstname' ) ).toBe( 'Egon' );
	});

	it( 'detects changes to arrays', function(){
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[1].street' ) ).toBe( 'secondstreet' );
		testRecord._$data.pastAddresses.pop();
		expect( jsonPath.get( testRecord._$data, 'pastAddresses[1].street' ) ).toBe( undefined );
	});
});

describe( 'objects are created from paths and their value is set correctly', function(){

	beforeEach( function() {
		jasmine.addCustomEqualityTester(utils.deepEquals);
	} );

	it( 'sets simple values', function(){
		var record = { _$data:{}};
		record._$data = jsonPath.set( record._$data, 'firstname', 'Wolfram' );
		expect( jsonPath.get( record._$data, 'firstname' ) ).toBe( 'Wolfram');
		expect( record._$data ).toEqual({ firstname: 'Wolfram' });
	});

	it( 'sets values for nested objects', function(){
		var record = { _$data:{}};
		record._$data = jsonPath.set( record._$data, 'adress.street', 'someStreet' );
		expect( jsonPath.get( record._$data, 'adress.street' ) ).toBe( 'someStreet');
		expect( record._$data ).toEqual({
			adress: {
				street: 'someStreet'
			}
		});
	});

	it( 'sets values for arrays', function(){
		var record = { _$data:{}};
		record._$data = jsonPath.set( record._$data, 'pastAddresses[1].street', 'someStreet' );
		expect( jsonPath.get( record._$data, 'pastAddresses[1].street' ) ).toBe( 'someStreet');
		expect( record._$data ).toEqual({
			pastAddresses: [
			undefined,
			{
				street: 'someStreet'
			}]
		});
	});

	it( 'extends existing objects', function(){
		var record = { _$data: { firstname: 'Wolfram' } };
		record._$data = jsonPath.set( record._$data, 'lastname', 'Hempel' );
		expect( jsonPath.get( record._$data, 'lastname' ) ).toBe( 'Hempel');
		expect( record._$data ).toEqual({
			firstname: 'Wolfram',
			lastname: 'Hempel'
		});
	});

	it( 'extends existing arrays', function(){
		var record = {_$data: {
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Cow', 'Ostrich' ]
		}};
		record._$data = jsonPath.set( record._$data, 'animals[ 1 ]', 'Emu' );
		expect( jsonPath.get( record._$data, 'animals[ 1 ]' ) ).toBe( 'Emu');
		expect( record._$data ).toEqual({
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Emu', 'Ostrich' ]
		});
	});
});
