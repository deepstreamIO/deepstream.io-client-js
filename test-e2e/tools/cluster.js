var DeepstreamServer = require( 'deepstream.io' ),
	RedisConnector = require( 'deepstream.io-msg-redis' ),
	Logger = require( './test-logger' ),
	util = require( 'util' ),
	config = require( '../config' ),
	EventEmitter = require( 'events' ).EventEmitter;

//TODO cluster failing somehow exists the tests. If you toggle enableLogging we'll notice
//the plugin occasional catches and logs the error which results in the tests just exiting
var Cluster = function( ports, enableLogging ) {
	this._ports = ports;
	this._enableLogging = enableLogging;
	this.servers = {};
	ports.forEach( this._startServer.bind( this ) );
};

util.inherits( Cluster, EventEmitter );

Cluster.prototype.stop = function() {
	for( var port in this.servers ) {
		this.servers[ port ].stop();
	}
};

Cluster.prototype._startServer = function( port ) {
	this.servers[ port ] = new DeepstreamServer();
	this.servers[ port ].on( 'started', this._checkReady.bind( this, port ) );
	this.servers[ port ].set( 'tcpPort', port );

	this.servers[ port ].set( 'port', port - 100 );
	// this.servers[ port ].set( 'messageConnector', new MessageConnector({
	//     localport: port - 200,
	//     localhost: 'localhost',
	//     remoteUrls: this._getRemoteUrls( port ),
	//     reconnectInterval: 100,
	//     maxReconnectAttepts: 10,
	//     securityToken: 'bla'
	// }));
	this.servers[ port ].set( 'messageConnector', new RedisConnector({
		port: config.redisPort,
		host: config.redisHost
	}));
	if( this._enableLogging !== true ) {
		this.servers[ port ].set( 'logger', new Logger() );
	}

	this.servers[ port ].set( 'showLogo', false );
	this.servers[ port ].on( 'stopped', this._checkStopped.bind( this ) );
	this.servers[ port ].start();
};

Cluster.prototype._getRemoteUrls = function( port ) {
	var i,
		remoteUrls = [];

	for( i = 0; i < this._ports.length; i++ ) {
		if( this._ports[ i ] !== port ) {
			remoteUrls.push( 'localhost:' + ( this._ports[ i ] - 200 ) );
		}
	}
	return remoteUrls;
};

Cluster.prototype._checkReady = function() {
	for( var port in this.servers ) {
		if( this.servers[ port ].isRunning() !== true ) {
			return;
		}
	}

	this.emit( 'ready' );
};

Cluster.prototype._checkStopped = function() {
	for( var port in this.servers ) {
		if( this.servers[ port ].isRunning() === true ) {
			return;
		}
	}

	this.emit( 'stopped' );
};

module.exports = Cluster;