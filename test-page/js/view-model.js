ViewModel = function() {
	this._client = null;

	this.hasClient = ko.observable( false );

	this.host = ko.observable( 'localhost' );
	this.port = ko.observable( 6020 );

	this.username = ko.observable( 'Wolfram');
	this.password = ko.observable( 'blah' );

	this.events = ko.observableArray();
	this.eventName = ko.observable();
	this.emitEventName = ko.observable();
	this.emitEventData = ko.observable();

	this.rpcNumA = ko.observable( 3 );
	this.rpcNumB = ko.observable( 4 );
	this.rpcResponse = ko.observable('-');
	this.rpcResponseTime = ko.observable('-');

	this._record = null;

	this.firstname = ko.observable();
	this.lastname = ko.observable();
	this.firstname.subscribe( this._updateRecord.bind( this, 'firstname' ) );
	this.lastname.subscribe( this._updateRecord.bind( this, 'lastname' ) );

	this.isSubscribed = ko.observable( false );

	this.recordTimeDelta = ko.observable( '-' );

	window.viewModel = this;
	this.connectionState = ko.observable( 'CLOSED' );
};

ViewModel.prototype.login = function() {
	this._client.login({
		username: this.username(),
		password: this.password()
	}, this._onLoginResult.bind( this ) );
};

ViewModel.prototype.connect = function() {
	if( !this._client ) {
		this._client = deepstream( this.host() + ':' + this.port() );
		this._client.on( 'connectionStateChanged', this._setConnectionState.bind( this ) );	
	} else {
		this._client.start();
	}
	this.hasClient( true );
};

ViewModel.prototype.disconnect = function() {
	this._client.close();
};

ViewModel.prototype.subscribeToEvent = function() {
	this.events.push( new EventViewModel( this._client, this.eventName() ) );
	this.eventName( '' );
};

ViewModel.prototype.emitEvent = function() {
	this._client.event.emit( this.emitEventName(), this.emitEventData() );
};

ViewModel.prototype.provideAddTwo = function() {
	this._client.rpc.provide( 'addTwo', function( data, response ){
		response.send( data.numA + data.numB );
	});
};

ViewModel.prototype.makeAddTwoRpc = function() {
	var data = {
		numA: this.rpcNumA(),
		numB: this.rpcNumB()
	};

	var startTime = performance.now();

	console.time( 'rpcStart' );
	console.log( performance.now(), 'makeRpc' );
	this._client.rpc.make( 'addTwo', data, function( error, response ){
		console.log( performance.now(), 'receivedResponse' );
		if( error ) {
			console.error( 'RPC ERROR', error );
		}
		this.rpcResponse( response );
		this.rpcResponseTime( ( performance.now() - startTime ).toFixed( 4 ) );
	}.bind( this ) );
};

ViewModel.prototype.getSomeUserRecord = function() {
	this._record = this._client.record.getRecord( 'someUser' );
	this._record.subscribe( 'firstname', this.firstname.bind( this ), true );
	this._record.subscribe( 'lastname', this.lastname.bind( this ), true );
	this._record.subscribe( 'sendTime', this._setRecordTimeDelta.bind( this ) );
	this.isSubscribed( true );
};

ViewModel.prototype.setTimestamp = function() {
	this._record.set( 'sendTime', Date.now() );
};

ViewModel.prototype.createRecords = function() {
	var i = 0;
	this._interval = interval = setInterval(function(){
		i++;
		if( i === 300 ) {
			clearInterval( interval );
			console.log( 'DONE' );
		}
		var record = this._client.record.getRecord( 'testRecord' );
		record.subscribe( 'testPath', function( val ){  });
		record.on( 'ready', function(){
			record.set( 'testPath', 'entry' + i );
			setTimeout(function(){
				record.discard();
			}, 200 );
		});
	}.bind( this ), 500 );
};

ViewModel.prototype.stopCreateRecords = function() {
	clearInterval( this._interval );
};

ViewModel.prototype._setRecordTimeDelta = function( time ) {
	this.recordTimeDelta( Date.now() - time );
};

ViewModel.prototype.unsubscribeSomeUserRecord = function() {
	this._record.unsubscribe();
	this.isSubscribed( false );
};

ViewModel.prototype.deleteSomeUserRecord = function() {
	this._record.delete();
	this.isSubscribed( false );
};

ViewModel.prototype.snapshotSomeUserRecord = function() {
	this._client.record.snapshot( 'someUser', function( error, data ) {
		if( error ) {
			alert( 'snapshot error: someuser does not exist yet' );
		} else {
			this.firstname( data.firstname );
			this.lastname( data.lastname );	
		}
	}.bind( this ) );
};

ViewModel.prototype.hasSomeUserRecord = function() {
	this._client.record.has( 'someUser', function( error, hasRecord ) {
		alert( 'Record someUser exists: ' + hasRecord );
	}.bind( this ) );
};

ViewModel.prototype._onLoginResult = function( result, errorEvent, errorMessage ) {
};

ViewModel.prototype._updateRecord = function( path ) {
	if( this._record ) {
		this._record.set( path, this[ path ]() );
	}
};

ViewModel.prototype._setConnectionState = function() {
	this.connectionState( this._client.getConnectionState() );
};