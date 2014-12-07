ViewModel = function() {
	this._client = null;

	this.username = ko.observable( 'Wolfram');
	this.password = ko.observable( 'blah' );
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
};

ViewModel.prototype.disconnect = function() {
	this._client.close();
};

ViewModel.prototype._onLoginResult = function( result, errorEvent, errorMessage ) {

};

ViewModel.prototype._setConnectionState = function() {
	this.connectionState( this._client.getConnectionState() );
};