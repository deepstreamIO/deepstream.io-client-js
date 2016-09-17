const DeepstreamClient = require( '../src/client' )
const ds = DeepstreamClient( 'localhost:2021' )
ds.on( 'connectionStateChanged', ( a,b) => {
	console.log( a,b)
})
