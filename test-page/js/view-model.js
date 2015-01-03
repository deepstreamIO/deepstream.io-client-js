ViewModel = function() {
	this._client = null;

	this.hasClient = ko.observable( false );

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
	this._client = deepstream( 'localhost:6020' );
	this._client.on( 'connectionStateChanged', this._setConnectionState.bind( this ) );
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