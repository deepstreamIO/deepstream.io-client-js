const Cluster = require( '../../tools/cluster' );
const Deepstream = require( 'deepstream.io' );

module.exports = function() {

  this.Given(/"([^"]*)" permissions are used$/, function ( permissionType ) {
    global.cluster.updatePermissions( permissionType );
  });

  this.When(/^server (\S)* goes down$/, function ( server, done) {
    global.cluster.stopServer( server - 1, done );
  });

  this.When(/^server (\S)* comes back up$/, function ( server, done ) {
    global.cluster.startServer( server - 1, done );
  });

  this.registerHandler('BeforeFeature', function (features, callback) {
    global.cluster = new Cluster( [ 6001, 6002, 6003 ], false );
    global.cluster.on( 'ready', callback );
  });

  this.registerHandler('AfterFeature', function (features, callback) {
    setTimeout( () => {
      global.cluster.on('stopped', () => {
        callback()
      } );
      global.cluster.stop();
    }, 100 );
  });

};
