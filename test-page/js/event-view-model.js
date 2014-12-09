EventViewModel = function( client, eventName ) {
	this._client = client;
	this._onEventFn = this._onEvent.bind( this );

	this.isSubscribed = ko.observable( false );
	this.eventName = ko.observable( eventName );
	this.receivedEvents = ko.observableArray();

	this.toggleSubscribe();
};

EventViewModel.prototype.toggleSubscribe = function() {
	if( this.isSubscribed() ) {
		this._client.event.unsubscribe( this.eventName(), this._onEventFn );
		this.isSubscribed( false );
	} else {
		this._client.event.subscribe( this.eventName(), this._onEventFn );
		this.isSubscribed( true );
	}
};

EventViewModel.prototype._onEvent = function( data ) {
	this.receivedEvents.push( data );
};
