const Cluster = require( '../cluster' );
const Deepstream = require( 'deepstream.io' );
var cluster;

module.exports = function() {

	this.When(/^server (\S)* goes down$/, function ( server, done) {
		cluster.stopServer( server - 1, done );
	});

	this.When(/^server (\S)* comes back up$/, function ( server, done ) {
		cluster.startServer( server - 1, done );
	});

	this.registerHandler('BeforeFeature', function (features, callback) {
		cluster = new Cluster( [ 6001, 6002, 6003 ], false );
		cluster.on( 'ready', callback );
	});

	this.registerHandler('AfterFeature', function (features, callback) {
		setTimeout( () => {
			cluster.on('stopped', () => {
				callback()
			} );
			cluster.stop();
		}, 500 );
	});
};
