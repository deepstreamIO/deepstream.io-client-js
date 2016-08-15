const Cluster = require( '../cluster' );
const Deepstream = require( 'deepstream.io' );
var cluster;

module.exports = function() {
	this.Given( /the servers are ready/, function (done) {
		cluster = new Cluster( [ 6001, 6002, 6003 ], false );
		cluster.on( 'ready', done );
	});

	this.When(/^the first server goes down$/, function (done) {
		cluster.stopServer( 1, done );
	});

	this.When(/^the connection to the first server is reestablished$/, function ( done ) {
		cluster.startServer( 1, done );
	});
};