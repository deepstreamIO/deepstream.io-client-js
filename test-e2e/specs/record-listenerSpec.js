/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

function onClose(client, callback) {
	client.on('connectionStateChanged', function(state) {
		if (state === 'CLOSED') {
			callback()
		}
	})
}

describe( 'record listener', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB;

	beforeAll(function(done) {
		var counter = 0
		function allDone() {
			counter++
			done()
		}
		deepstreamServer = new DeepstreamServer({port: 6665, tcpPort: 6666});
		deepstreamServer.on( 'started', function() {
			clientA = deepstreamClient( 'localhost:6666' );
			// clientA.on( 'error', function(){console.error(arguments)} );
			clientA.login( null, allDone);
			clientB = deepstreamClient( 'localhost:6666' );
			// clientB.on( 'error', function(){console.error(arguments)} );
			clientB.login( null, allDone);
		} );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	})

	afterAll( function( done ) {
		onClose(clientA, function() {
			deepstreamServer.on('stopped', done)
			deepstreamServer.stop()
		})
		onClose(clientB, function() {
			clientA.close()
		})
		setTimeout(function() {
			clientB.close()
		}, 100) // wait for potential messages on the wire (e.g. has provider = false)

	})

	it( 'listens for record subscription with unlisten cleanup', function(done){
		var matches = [];
		clientA.record.listen( 'user/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					clientA.record.unlisten( 'user/[a-z0-9]' )
					done()
				}
			}
		});

		clientB.record.getRecord( 'user/matchespattern' )
		clientB.record.getRecord( 'user/DOES_NOT_MATCH' )
	});

	it( 'verify liten is working again for', function(done){
		var matches = [];
		clientA.record.listen( 'user/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					clientA.record.unlisten( 'user/[a-z0-9]' )
					done()
				}
			}
		});
		setTimeout(function() {
			clientB.record.getRecord( 'user/matchespattern' )
			clientB.record.getRecord( 'user/DOES_NOT_MATCH2' )

		}, 10)
	});

	it( 'listens for record subscription with unlisten and discard cleanup', function(done){
		var matches = [];
		var records = []
		clientA.record.listen( 'admin\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'admin/matchesanotherpattern' ) ).not.toBe( -1 ) ;
					clientA.record.unlisten( 'admin\/[a-z0-9]' )
					records.forEach(record => {
						record.discard()
					})
					done()
				}
			}
		});

		records.push( clientB.record.getRecord( 'admin/matchesanotherpattern' ) )
		records.push( clientB.record.getRecord( 'admin/DOES_NOT_MATCH' ) )
	});

	it( 'listens for record subscription with discard and unlisten cleanup', function(done){
		var matches = [];
		var records = []
		clientA.record.listen( 'user\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					records.forEach(record => {
						record.discard()
					})
					clientA.record.unlisten( 'user\/[a-z0-9]' )
					done()
				}
			}
		});

		records.push( clientB.record.getRecord( 'user/matchespattern' ) )
		records.push( clientB.record.getRecord( 'user/DOES_NOT_MATCH' ) )
	});

	it( 'listens for record subscription with discard cleanup', function(done){
		var matches = [];
		var records = []
		clientA.record.listen( 'user\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					records.forEach(record => {
						record.discard()
					})
					done()
				}
			}
		});

		records.push( clientB.record.getRecord( 'user/matchespattern' ) )
		records.push( clientB.record.getRecord( 'user/DOES_NOT_MATCH' ) )
	});

	it( 'listen again after unlisten', function(done){
		var matches = [];
		var records = []
		clientA.record.listen( 'foo/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 2 ) {
					expect( matches.indexOf( 'foo/matchespattern' ) ).not.toBe( -1 ) ;
					expect( matches.indexOf( 'foo/some33' ) ).not.toBe( -1 );
					records.forEach(record => {
						record.discard()
					})
					clientA.record.unlisten( 'foo/[a-z0-9]' )
					setTimeout(() => {
						clientA.record.listen( 'foo\/[a-z0-9]', function( match, isSubscribed, response ){
							expect(match).toBe( 'foo/some44' )
							if (isSubscribed) {
								response.accept()
								done()
							}
						})
						records.push( clientA.record.getRecord( 'foo/some44' ) )
					}, 10)
				}
			}
		});

		records.push( clientB.record.getRecord( 'foo/matchespattern' ) )
		records.push( clientB.record.getRecord( 'foo/DOES_NOT_MATCH' ) )
		records.push( clientA.record.getRecord( 'foo/some33' ) )
	});

	it( 'listens for 2 record subscriptions', function(done){
		var matches = [];
		var records = []
		clientA.record.listen( 'multiple\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 2 ) {
					expect( matches.indexOf( 'multiple/matchespattern' ) ).not.toBe( -1 ) ;
					expect( matches.indexOf( 'multiple/some33' ) ).not.toBe( -1 );
					done()
				}
			}
		});

		records.push( clientB.record.getRecord( 'multiple/matchespattern' ) )
		records.push( clientB.record.getRecord( 'multiple/DOES_NOT_MATCH' ) )
		records.push( clientA.record.getRecord( 'multiple/some33' ) )
	});

	it( 'listens, gets notified and unlistens', function(done) {
		var match;

		var callback = function( _match, isSubscribed, response ){
			match = _match;
			response.accept();
		};

		clientB.record.listen( 'a[0-9]', callback );
		// Might receive an unsolicited message error due to unlisten and getRecord happening at the same time
		clientB.on( 'error', function(){} );
		clientA.record.getRecord( 'a1' );
		clientA.record.getRecord( 'aa' );

		setTimeout(function(){
			expect( match ).toBe( 'a1' );
			clientB.record.unlisten( 'a[0-9]' );
			clientA.record.getRecord( 'a2' );

			setTimeout(function(){
				expect( match ).toBe( 'a1' );
				done();
			 }, 50 );
		}, 20 );
	});

});
