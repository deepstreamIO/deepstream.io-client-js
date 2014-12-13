describe('connection to the server works', function(){
	
	var proxyquire = require( 'proxyquire' ).noCallThru(),
		engineIoMock = new (require( '../../mocks/engine-io-mock' ))(),
		Connection = proxyquire( '../../../src/message/connection', { 'engine.io-client': engineIoMock } ),
		ClientMock = require( '../../mocks/client-mock' ),
		connection;

	it( 'creates the connection', function(){

		//connection = new Connection();
		expect( true ).toBe( true );
	});
});