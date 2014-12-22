/* global describe, it, expect, jasmine */

var proxyquire = require( 'proxyquire' ).noCallThru(),
	SocketMock = require( '../../mocks/tcp/tcp-socket-mock' ),
	net = { createConnection: function(){ return new SocketMock(); }},
	TcpConnection = proxyquire( '../../../src/tcp/tcp-connection', { net: net });
	
describe( 'TcpConnection works - happy path', function(){
	var tcpConnection;
	
	it( 'creates the connection', function(){
		tcpConnection = new TcpConnection( 'somehost:4444' );
		expect( tcpConnection.open ).toBeDefined();
		expect( tcpConnection._isOpen ).toBe( false );
	});
	
	it( 'throws error if send is called before connection is open', function() {
		expect(function(){ tcpConnection.send( 'bla' ); }).toThrow();
	});
	
	it( 'opens the connection', function() {
	    tcpConnection._socket.emit( 'connect' );
	    expect( tcpConnection._isOpen ).toBe( true );
	});
	
	it( 'parses urls with protocols', function() {
	    tcpConnection._url = 'http://somehost:1234/';
	    var parsedUrl = tcpConnection._getOptions();
	    expect( parsedUrl.host ).toBe( 'somehost' );
	    expect( parsedUrl.port ).toBe( 1234 );
	});
	
	it( 'parses urls without protocols', function() {
	    tcpConnection._url = 'otherHost:5432';
	    var parsedUrl = tcpConnection._getOptions();
	    expect( parsedUrl.host ).toBe( 'otherHost' );
	    expect( parsedUrl.port ).toBe( 5432 );
	})
});