module.exports = {
	REMOTE_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, remoteValue );
	},
	LOCAL_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, record.get() );
	},
	MERGE_IF_NO_CONFLICT : function( record, remoteValue, remoteVersion, callback ) {
		callback( null, { name: 'bob' } );
	}
};