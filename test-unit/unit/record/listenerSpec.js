'use strict'

/* global expect, it, describe, jasmine */
const RecordHandler = require( '../../../src/record/record-handler' )
const EventHandler = require( '../../../src/event/event-handler')
const ClientMock = require( '../../mocks/client-mock' )
const ConnectionMock = require( '../../mocks/message/connection-mock' )
const msg = require( '../../test-helper/test-helper' ).msg
const options = {}


describe( 'listening', function(){

	var recordHandler,
		eventHandler,
		recordA,
		handleResponse,
		handleProvider,
		originalWarn,
		onDiscard = jasmine.createSpy( 'onDiscard' ),
		connection = new ConnectionMock(),
		client = new ClientMock()

	function _handleResponse( topic, handler, data, remove ) {
		handler._$handle({
			topic: topic,
			action: !remove ? 'SP' : 'SR',
			data: data
		})
	}

	function _handleProvider( topic, data ) {
		recordHandler._$handle({
			topic: topic,
			action: 'SH',
			data: data
		})
	}
	describe( 'for records', function(){

		beforeAll(() => {
			recordHandler = new RecordHandler( options, connection, client )
			handleProvider = _handleProvider.bind( null, 'R')
			_handleProvider = _handleProvider.bind(this, recordHandler )
			handleResponse = _handleResponse.bind( null, 'R', recordHandler )
			originalWarn = console.warn
		})

		afterAll(() => {
			console.warn = originalWarn
		})

		it( 'provider neither accept nor reject', function( done ){
			const x1 = recordHandler.getRecord( 'x/1' )
			expect( x1.hasProvider ).toBe( false )
			recordHandler.listen('x/.*', (data, isSubscribed, response) => {
				expect( connection.lastSendMessage ).not.toBe( msg( 'R|LA|x/.*|x/1+' ) )
			})

			console.warn = function(message) {
				expect( message ).toContain('DEPRECATED')
				done()
			}
			handleResponse( [ 'x/.*', 'x/1' ])
		})

		it( 'provider accepts', function( done ){
			const a1 = recordHandler.getRecord( 'a/1' )
			expect( a1.hasProvider ).toBe( false )
			recordHandler.listen('a/.*', (data, isSubscribed, response) => {
				response.accept()
				expect( connection.lastSendMessage ).toBe( msg( 'R|LA|a/.*|a/1+' ) )
				handleProvider( [ 'a/1', true ] )
				expect( a1.hasProvider ).toBe( true )
			})

			a1.on( 'hasProviderChanged', (hasProvider) => {
				expect( hasProvider ).toBe( true )
				expect( a1.hasProvider ).toBe( true )
				done()
			})

			handleResponse( [ 'a/.*', 'a/1' ])

		})

		it( 'provider rejects', function( done ){
			const b1 = recordHandler.getRecord( 'b/1' )
			expect( b1.hasProvider ).toBe( false )
			recordHandler.listen('b/.*', (data, isSubscribed, response) => {
				response.reject()
				expect( connection.lastSendMessage ).toBe( msg( 'R|LR|b/.*|b/1+' ) )
			})
			b1.on( 'hasProviderChanged', (hasProvider) => {
				expect( hasProvider ).toBe( false )
				expect( b1.hasProvider ).toBe( false )
				done()
			})

			handleProvider( [ 'b/1', false ] )
			expect( b1.hasProvider ).toBe( false )

		})

		it( 'provider accepts for c/*, but rejects for d/*', function( done ){
			let _response = null

			const c1 = recordHandler.getRecord( 'c/1' )
			const d1 = recordHandler.getRecord( 'd/1' )

			recordHandler.listen('c/.*', (data, isSubscribed, response) => {
				response.accept()
				expect( connection.lastSendMessage ).toBe( msg( 'R|LA|c/.*|c/1+' ) )
				handleProvider( [ 'c/1', true ] )
				expect( c1.hasProvider ).toBe( true )
			})

			recordHandler.listen('d/.*', (data, isSubscribed, response) => {
				response.reject()
				expect( connection.lastSendMessage ).toBe( msg( 'R|LR|d/.*|d/1+' ) )
				expect( d1.hasProvider ).toBe( false )
				done()
			})

			c1.on( 'hasProviderChanged', function(hasProvider) {
				expect( hasProvider ).toBe( true )
				expect( c1.hasProvider ).toBe( true )
			})

			handleResponse( [ 'c/.*', 'c/1' ])

			setTimeout(function() {
				expect( c1.hasProvider ).toBe( true )
				handleResponse( [ 'd/.*', 'd/1' ], true )
			}, 1 )
		})
	})

	describe( 'for events', function(){

		beforeAll(() => {
			eventHandler = new EventHandler( options, connection, client )
			handleResponse = _handleResponse.bind( this, 'E', eventHandler )
			_handleResponse = _handleResponse.bind( this, eventHandler )
			originalWarn = console.warn
		})

		afterAll(() => {
			console.warn = originalWarn
		})

		it( 'provider neither accept nor reject', function( done ){
			eventHandler.listen('x/.*', (data, isSubscribed, response) => {
				expect( connection.lastSendMessage ).not.toBe( msg( 'E|LA|x/.*|x/1+' ) )
			})

			console.warn = function(message) {
				expect( message ).toContain('DEPRECATED')
				done()
			}
			handleResponse( [ 'x/.*', 'x/1' ])
		})

		it( 'provider accepts', function( done ){
			eventHandler.listen('a/.*', (data, isSubscribed, response) => {
				response.accept()
				expect( connection.lastSendMessage ).toBe( msg( 'E|LA|a/.*|a/1+' ) )
				done()
			})
			handleResponse( [ 'a/.*', 'a/1' ])

		})

		it( 'provider rejects', function( done ){
			eventHandler.listen('b/.*', (data, isSubscribed, response) => {
				response.reject()
				expect( connection.lastSendMessage ).toBe( msg( 'E|LR|b/.*|b/1+' ) )
				done()
			})
			handleResponse( [ 'b/.*', 'b/1' ])
		})

		it( 'provider accepts for c/*, but rejects for d/*', function( done ){

			eventHandler.listen('c/.*', (data, isSubscribed, response) => {
				response.accept()
				expect( connection.lastSendMessage ).toBe( msg( 'E|LA|c/.*|c/1+' ) )
			})

			eventHandler.listen('d/.*', (data, isSubscribed, response) => {
				response.reject()
				expect( connection.lastSendMessage ).toBe( msg( 'E|LR|d/.*|d/1+' ) )
				done()
			})


			handleResponse( [ 'c/.*', 'c/1' ])

			setTimeout(function() {
				handleResponse( [ 'd/.*', 'd/1' ], true )
			}, 1 )
		})
	})

})
