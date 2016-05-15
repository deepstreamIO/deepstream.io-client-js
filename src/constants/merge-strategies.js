function merge( oldData, newData, callback ) {
	var prop;
	for( prop in newData ) {
		if( typeof( newData[ prop ] ) === "object" ) {
			if( !prop in oldData || typeof( oldData[ prop ] ) !== "object" ) {
				// Safe override or addition
				oldData[ prop ]= newData[ prop ]; 
			} else {
				// Recursive
				oldData[ prop ] = this.merge( oldData[ prop ], newData[ prop ] );	
			}
		} else {
			oldData[ prop ] = newData[prop];
		}
	}
	callback( null, oldData );
}

module.exports = {
	REMOTE_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, remoteValue );
	},
	LOCAL_WINS: function( record, remoteValue, remoteVersion, callback ) {
		callback( null, record.get() );
	},
	MERGE_IF_NO_CONFLICT : function( record, remoteValue, remoteVersion, callback ) {
		merge( record.get(), remoteValue, callback );
	}
};