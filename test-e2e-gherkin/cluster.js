var DeepstreamServer = require( 'deepstream.io' ),
	RedisConnector = require( 'deepstream.io-msg-redis' ),
	util = require( 'util' ),
	config = require( './config' ),
	EventEmitter = require( 'events' ).EventEmitter,
	Logger = require('../test-e2e/tools/test-logger'),
	ports;

var Cluster = function( tcpPorts, enableLogging ) {
	ports = tcpPorts;
	this._ports = tcpPorts;
	this._enableLogging = enableLogging;
	this.servers = {};
	ports.forEach( this._startServer.bind( this ) );
};
util.inherits( Cluster, EventEmitter );

Cluster.getUrl = function( serverId ) {
	return 'localhost:' + ports[ serverId ];
};

Cluster.prototype.stopServer = function( serverNumber, done ) {
	var server = this.servers[ Object.keys( this.servers )[ serverNumber ] ];
	server.on( 'stopped',() => {
		setTimeout( done, 1000 );
	});
	server.stop();
};

Cluster.prototype.startServer = function( serverNumber, done ) {
	var serverPort =  Object.keys( this.servers )[ serverNumber ];
	this._startServer( serverPort, () => {
		setTimeout( done, 1000 );
	});
};

Cluster.prototype.stop = function() {
	for( var port in this.servers ) {
		this.servers[ port ].stop();
	}
};

Cluster.prototype._startServer = function( port, done ) {
  this.servers[ port ] = new DeepstreamServer({
    port       : port - 100,
    tcpPort    : port,
    serverName : 'server-' + port,

    stateReconciliationTimeout : 100,
    clusterKeepAliveInterval   : 100,
    clusterActiveCheckInterval : 100,
    clusterNodeInactiveTimeout : 200,
    lockTimeout                : 1000,

    showLogo : false,
    stopped  : this._checkStopped.bind( this ),

    plugins : {
      message : {
        name    : 'redis',
        options : { host   : 'localhost', port : 6379 }
      }
    },

    maxAuthAttempts              : 2,
    unauthenticatedClientTimeout : 200,
    auth : {
      type    : 'file',
      options : {
        path : './test-e2e-gherkin/users.yml'
      }
    }
  });
	if( done instanceof Function ) {
		this.servers[ port ].on( 'started', done );
	} else {
		this.servers[ port ].on( 'started', this._checkReady.bind( this, port ) );
	}

	if( this._enableLogging !== true ) {
		this.servers[ port ].set( 'logger', new Logger() );
	}

	this.servers[ port ].set( 'showLogo', false );
	!done && this.servers[ port ].on( 'stopped', this._checkStopped.bind( this ) );
	this.servers[ port ].start();
};

Cluster.prototype._checkReady = function() {
	for( var port in this.servers ) {
		if( this.servers[ port ].isRunning() !== true ) {
			return;
		}
	}
	setTimeout( () => {
		this.emit( 'ready' );
	}, 500);
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
