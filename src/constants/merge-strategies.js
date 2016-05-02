module.exports = {
	/**
	*	Choose the server state over the clients
	**/
	REMOTE_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, remoteValue );
	},
	/**
	*	Choose the local state over the servers
	**/
	LOCAL_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, record.get() );
	}
};