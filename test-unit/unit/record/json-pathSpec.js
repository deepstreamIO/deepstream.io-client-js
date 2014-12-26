var JsonPath = require( '../../../src/record/json-path' );

describe('paths are tokenized and retrieved correctly', function(){
	var testData = {
		firstname: 'Wolfram',
		lastname: 'Hempel',
		address:{
			street: 'currentStreet'
		},
		pastAdresses: [
			{ street: 'firststreet', postCode: 1001 },
			{ street: 'secondstreet', postCode: 2002 }
		]
	};

	it( 'retrieves simple paths', function(){
		var jsonPath = new JsonPath( testData, 'firstname' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram' );
	});

	it( 'retrieves nested paths', function(){
		var jsonPath = new JsonPath( testData, 'address.street' );
		expect( jsonPath.getValue() ).toBe( 'currentStreet' );
	});

	it( 'retrieves array entries', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[1]' );
		expect( jsonPath.getValue() ).toEqual( { street: 'secondstreet', postCode: 2002 } );
	});

	it( 'retrieves other array entries', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[0]' );
		expect( jsonPath.getValue() ).toEqual( { street: 'firststreet', postCode: 1001 } );
	});

	it( 'retrieves values from objects within arrays', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[0].postCode' );
		expect( jsonPath.getValue() ).toBe( 1001 );
	});

	it( 'handles whitespace', function(){
		var jsonPath = new JsonPath( testData, ' pastAdresses[ 1 ].postCode ' );
		expect( jsonPath.getValue() ).toBe( 2002 );
	});

	it( 'returns undefined for non existing keys', function(){
		var jsonPath = new JsonPath( testData, 'doesNotExist' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for non existing nested keys', function(){
		var jsonPath = new JsonPath( testData, 'address.number' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for existing array indices', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[3]' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'returns undefined for negative array indices', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[-1]' );
		expect( jsonPath.getValue() ).toBe( undefined );
	});

	it( 'detects changes', function(){
		var jsonPath = new JsonPath( testData, 'firstname' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram' );
		testData.firstname = 'Egon';
		expect( jsonPath.getValue() ).toBe( 'Egon' );
	});

	it( 'detects changes to arrays', function(){
		var jsonPath = new JsonPath( testData, 'pastAdresses[1].street' );
		expect( jsonPath.getValue() ).toBe( 'secondstreet' );
		testData.pastAdresses.pop();
		expect( jsonPath.getValue() ).toBe( undefined );
	});
});

describe( 'objects are created from paths and their value is set correctly', function(){
	
	it( 'sets simple values', function(){
		var data = {},
			jsonPath = new JsonPath( data, 'firstname' );
		jsonPath.setValue( 'Wolfram' );
		expect( jsonPath.getValue() ).toBe( 'Wolfram');
		expect( data ).toEqual({ firstname: 'Wolfram' });
	});

	it( 'sets values for nested objects', function(){
		var data = {},
			jsonPath = new JsonPath( data, 'adress.street' );
		jsonPath.setValue( 'someStreet' );
		expect( jsonPath.getValue() ).toBe( 'someStreet');
		expect( data ).toEqual({
			adress: {
				street: 'someStreet'
			}
		});
	});

	it( 'sets values for arrays', function(){
		var data = {},
			jsonPath = new JsonPath( data, 'pastAdresses[1].street' );
		jsonPath.setValue( 'someStreet' );
		expect( jsonPath.getValue() ).toBe( 'someStreet');
		expect( data ).toEqual({
			pastAdresses: [
			undefined,
			{
				street: 'someStreet'
			}]
		});
	});

	it( 'extends existing objects', function(){
		var data = { firstname: 'Wolfram' },
			jsonPath = new JsonPath( data, 'lastname' );
		jsonPath.setValue( 'Hempel' );
		expect( jsonPath.getValue() ).toBe( 'Hempel');
		expect( data ).toEqual({
			firstname: 'Wolfram',
			lastname: 'Hempel'
		});
	});

	it( 'extends existing arrays', function(){
		var data = {
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Cow', 'Ostrich' ]
		},
		jsonPath = new JsonPath( data, 'animals[ 1 ]' );
		jsonPath.setValue( 'Emu' );
		expect( jsonPath.getValue() ).toBe( 'Emu');
		expect( data ).toEqual({
			firstname: 'Wolfram',
			animals: [ 'Bear', 'Emu', 'Ostrich' ]
		});
	});
});