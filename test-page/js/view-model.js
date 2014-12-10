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
		data = JSON.parse( data );
		response.send( data.numA + data.numB );
	});
};

ViewModel.prototype.makeAddTwoRpc = function() {
	var data = {
		numA: this.rpcNumA(),
		numB: this.rpcNumB()
	};

	var startTime = performance.now();

	this._client.rpc.make( 'addTwo', data, function( error, response ){
		if( error ) {
			alert( error );
		}
		this.rpcResponse( response );
		this.rpcResponseTime( performance.now() - startTime );
	}.bind( this ) );
};

ViewModel.prototype._onLoginResult = function( result, errorEvent, errorMessage ) {

};

ViewModel.prototype._setConnectionState = function() {
	this.connectionState( this._client.getConnectionState() );
};