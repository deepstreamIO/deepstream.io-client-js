/* global describe, it, expect */
var C = require( '../../../src/constants/constants' ),
	messageBuilder = require( '../../../src/message/message-builder' ),
	msg = require( '../../test-helper/test-helper' ).msg;

describe( 'messageBuilder composes valid deepstream messages', function(){

	it( 'creates a simple authentication ack message', function(){
		var message = messageBuilder.getMsg( C.TOPIC.AUTH, C.ACTIONS.ACK );
		expect( message ).toBe( msg( 'A|A+' ) );
	});

	it( 'creates an event subscription message', function(){
		var message = messageBuilder.getMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ 'someEvent' ] );
		expect( message ).toBe( msg( 'E|S|someEvent+') );
	});

	it( 'creates an event message with serialized data', function(){
		var message = messageBuilder.getMsg( C.TOPIC.EVENT, C.ACTIONS.EVENT, [ 'someEvent', { some: 'data' } ] );
		expect( message ).toBe( msg( 'E|EVT|someEvent|{"some":"data"}+' ) );
	});
});