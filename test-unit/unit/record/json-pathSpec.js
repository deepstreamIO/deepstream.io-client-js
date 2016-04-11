var JsonPath = require( '../../../src/record/json-path' );

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

	it( 'retrieves simple paths', function(){
		var jsonPath = new JsonPath( testRecord, 'firstname' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram' );
	});

	it( 'retrieves nested paths', function(){
		var jsonPath = new JsonPath( testRecord, 'address.street' );
		expect( jsonPath.getValue() ).toBe( 'currentStreet' );
	});

	it( 'retrieves array entries', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[1]' );
		expect( jsonPath.getValue() ).toEqual( { street: 'secondstreet', postCode: 2002 } );
	});

	it( 'retrieves other array entries', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[0]' );
		expect( jsonPath.getValue() ).toEqual( { street: 'firststreet', postCode: 1001 } );
	});

	it( 'retrieves values from objects within arrays', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[0].postCode' );
		expect( jsonPath.getValue() ).toBe( 1001 );
	});

	it( 'handles whitespace', function(){
		var jsonPath = new JsonPath( testRecord, ' pastAddresses[ 1 ].postCode ' );
		expect( jsonPath.getValue() ).toBe( 2002 );
	});

	it( 'handles integers', function(){
		var jsonPath = new JsonPath( testRecord, 1234 );
		expect( jsonPath.getValue() ).toBe( 'integer index' );
	});

	it( 'returns undefined for non existing keys', function(){
		var jsonPath = new JsonPath( testRecord, 'doesNotExist' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for non existing nested keys', function(){
		var jsonPath = new JsonPath( testRecord, 'address.number' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for existing array indices', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[3]' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for negative array indices', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[-1]' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'detects changes', function(){
		var jsonPath = new JsonPath( testRecord, 'firstname' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram' );
		testRecord._$data.firstname = 'Egon';
		expect( jsonPath.getValue() ).toBe( 'Egon' );
	});

	it( 'detects changes to arrays', function(){
		var jsonPath = new JsonPath( testRecord, 'pastAddresses[1].street' );
		expect( jsonPath.getValue() ).toBe( 'secondstreet' );
		testRecord._$data.pastAddresses.pop();
		expect( jsonPath.getValue() ).toBe( undefined );
	});
});

describe( 'objects are created from paths and their value is set correctly', function(){
	
	it( 'sets simple values', function(){
		var record = { _$data:{}},
			jsonPath = new JsonPath( record, 'firstname' );
		jsonPath.setValue( 'Wolfram' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram');
		expect( record._$data ).toEqual({ firstname: 'Wolfram' });
	});

	it( 'sets values for nested objects', function(){
		var record = { _$data:{}},
			jsonPath = new JsonPath( record, 'adress.street' );
		jsonPath.setValue( 'someStreet' );
		expect( jsonPath.getValue() ).toBe( 'someStreet');
		expect( record._$data ).toEqual({
			adress: {
				street: 'someStreet'
			}
		});
	});

	it( 'sets values for arrays', function(){
		var record = { _$data:{}},
			jsonPath = new JsonPath( record, 'pastAddresses[1].street' );
		jsonPath.setValue( 'someStreet' );
		expect( jsonPath.getValue() ).toBe( 'someStreet');
		//TODO: Check why equals doesn't work
		expect( JSON.stringify( record._$data )  ).toEqual( JSON.stringify( {
			pastAddresses: [
			undefined,
			{
				street: 'someStreet'
			}]
		}) );
	});

	it( 'extends existing objects', function(){
		var record = { _$data: { firstname: 'Wolfram' } },
			jsonPath = new JsonPath( record, 'lastname' );
		jsonPath.setValue( 'Hempel' );
		expect( jsonPath.getValue() ).toBe( 'Hempel');
		expect( record._$data ).toEqual({
			firstname: 'Wolfram',
			lastname: 'Hempel'
		});
	});

	it( 'extends existing arrays', function(){
		var record = {_$data: {
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Cow', 'Ostrich' ]
		}},
		jsonPath = new JsonPath( record, 'animals[ 1 ]' );
		jsonPath.setValue( 'Emu' );
		expect( jsonPath.getValue() ).toBe( 'Emu');
		expect( record._$data ).toEqual({
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Emu', 'Ostrich' ]
		});
	});
});