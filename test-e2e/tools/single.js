var DeepstreamServer = require( 'deepstream.io' ),
    TestLogger = require( '../tools/test-logger' ),
    logger = new TestLogger();

var deepstreamServer;

module.exports.start = function( done ) {
    deepstreamServer = new DeepstreamServer();
    deepstreamServer.set( 'webServerEnabled', false );
    deepstreamServer.set( 'logger', logger );
    deepstreamServer.set( 'showLogo', false );
    deepstreamServer.on( 'started', done );
    deepstreamServer.start();
};

module.exports.stop = function( done ) {
    console.log( 'bob', deepstreamServer )
    deepstreamServer.on( 'stopped', done );
    deepstreamServer.stop();
};