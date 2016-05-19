module.exports = {
	/**
	*	Choose the server's state over the client's
	**/
	REMOTE_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, remoteValue );
	},
	/**
	*	Choose the local state over the server's
	**/
	LOCAL_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, record.get() );
	}
};