const DeepstreamClient = require( '../src/client' )
const ds = DeepstreamClient( 'ws://localhost:6020' )
ds.on( 'connectionStateChanged', ( a,b) => {
	console.log( a,b)
})

ds.on('error',function(e){
	console.log(e)
})
