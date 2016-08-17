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

fdescribe( 'event listener', function() {
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
			clientA.on( 'error', function(){console.error(arguments)} );
			clientA.login( null, allDone);
			clientB = deepstreamClient( 'localhost:6666' );
			clientB.on( 'error', function(){console.error(arguments)} );
			clientB.login( null, allDone);
		} );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	})

	afterAll(function(done) {
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

	// TODO: these both test cases leads to ACK_TIMEOUTs
	it( 'TODO: listens for event subscription with unlisten cleanup', function(done){
		var matches = [];
		clientA.event.listen( 'user/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					clientA.event.unlisten( 'user/[a-z0-9]' )
					done()
				}
			}
		});

		setTimeout(function() {
			clientB.event.subscribe( 'user/matchespattern', function() {} )
			clientB.event.subscribe( 'user/DOES_NOT_MATCH', function() {} )
		}, 10)
	});

	it( 'TODO: verify liten is working again for', function(done){
		var matches = []
		clientA.event.listen( 'user/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					clientA.event.unlisten( 'user/[a-z0-9]' )
					done()
				}
			}
		});
		setTimeout(function() {
			clientB.event.subscribe( 'user/matchespattern', function() {} )
			clientB.event.subscribe( 'user/DOES_NOT_MATCH2', function() {} )
		}, 10)
	});

	it( 'listens for event subscription with unlisten and unsubscribe cleanup', function(done){
		var matches = [];
		var subscriptions = []
		clientA.event.listen( 'admin\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'admin/matchesanotherpattern' ) ).not.toBe( -1 ) ;
					clientA.event.unlisten( 'admin\/[a-z0-9]' )
					subscriptions.forEach(subscription => {
						subscription.client.event.unsubscribe(subscription.event)
					})
					done()
				}
			}
		});

		clientB.event.subscribe( 'admin/matchesanotherpattern', function() {} )
		clientB.event.subscribe( 'admin/DOES_NOT_MATCH', function() {} )
		subscriptions.push({client: clientB, event: 'admin/matchesanotherpattern' })
		subscriptions.push({client: clientB, event: 'admin/DOES_NOT_MATCH' })
	});

	it( 'listens for event subscription with unsubscribe and unlisten cleanup', function(done){
		var matches = [];
		var subscriptions = []
		clientA.event.listen( 'user\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					subscriptions.forEach(subscription => {
						subscription.client.event.unsubscribe(subscription.event)
					})
					clientA.event.unlisten( 'user\/[a-z0-9]' )
					done()
				}
			}
		});

		clientB.event.subscribe( 'user/matchespattern', function() {} )
		clientB.event.subscribe( 'user/DOES_NOT_MATCH', function() {} )
		subscriptions.push({client: clientB, event: 'user/matchespattern' })
		subscriptions.push({client: clientB, event: 'user/DOES_NOT_MATCH' })
	});

	it( 'listens for event subscription with subsubscribe cleanup', function(done){
		var matches = [];
		var subscriptions = []
		clientA.event.listen( 'user\/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 1 ) {
					expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
					subscriptions.forEach(subscription => {
						subscription.client.event.unsubscribe(subscription.event)
					})
					done()
				}
			}
		});

		clientB.event.subscribe( 'user/matchespattern', function() {} )
		clientB.event.subscribe( 'user/DOES_NOT_MATCH', function() {} )
		subscriptions.push({client: clientB, event: 'user/matchespattern' })
		subscriptions.push({client: clientB, event: 'user/DOES_NOT_MATCH' })
	});

	it( 'listen again after unlisten', function(done){
		var matches = [];
		var subscriptions = [];
		clientA.event.listen( 'foo/[a-z0-9]', function( match, isSubscribed, response ){
			if (isSubscribed) {
				response.accept();
				matches.push( match );
				if( matches.length === 2 ) {
					expect( matches.indexOf( 'foo/matchespattern' ) ).not.toBe( -1 ) ;
					expect( matches.indexOf( 'foo/some33' ) ).not.toBe( -1 );
					clientA.event.unlisten( 'foo/[a-z0-9]' )
					subscriptions.forEach(subscription => {
						subscription.client.event.unsubscribe(subscription.event)
					})
					setTimeout(() => {
						clientA.event.listen( 'foo\/[a-z0-9]', function( match, isSubscribed, response ){
							expect(match).toBe( 'foo/some44' )
							if (isSubscribed) {
								response.accept()
								clientA.event.emit( 'foo/some44', {} )
							}
						})
						clientA.event.subscribe( 'foo/some44', function() {
							done()
						})
					}, 10)
				}
			}
		});

		clientB.event.subscribe( 'foo/matchespattern', function() {} )
		clientB.event.subscribe( 'foo/DOES_NOT_MATCH', function() {} )
		clientA.event.subscribe( 'foo/some33', function() {} )
		subscriptions.push( {client: clientB, event: 'foo/matchespattern'} );
		subscriptions.push( {client: clientB, event: 'foo/DOES_NOT_MATCH'} );
		subscriptions.push( {client: clientA, event: 'foo/some33'} );
	});


});
