var Cluster = require( './cluster' ),
		cluster = new Cluster([ 6001, 6002, 6003, 6004, 6005 ]);

cluster.on( 'ready', function(){
		console.log( 'CLUSTER READY' );
		setTimeout( cluster.stop.bind( cluster ), 100 );
});

cluster.on( 'stopped', function(){
		console.log( 'CLUSTER STOPPED' );
});