## [1.0.0] - 2016-07-10

### Features

###### Merge Conflict Resolution #4
Users can now set a global and per record merge strategy. This allows the application to respond to `VERSION_EXISTS` and use a `REMOTE_WINS`, `LOCAL_WINS` or a custom merge strategy

Global:
```javascript
const client = deepstream( 'localhost:6020', {
    mergeStrategy: deepstream.MERGE_STRATEGIES.REMOTE_WINS
});
```

Local:
```javascript
const record = client.record.getRecord( 'user/1' )
record.setMergeStrategy( ( record, remoteValue, remoteVersion, callback ) => {
  callback( null, remoteValue )
} )
```


#### Enhancements

###### Connection Redirects
deepstream protocol now has a connection establishment handshake that allows the client to be redirected to another deepstream before requesting/publishing data

###### Record deletes #111
Users can now delete content within records by setting it to undefined

```javascript
record.set( path, undefined )
```

###### Reduced client size #75
Client size bundle has been reduced by not including mocks for the tcp connection

###### Discard/Delete only on ready #94
Record discards and deletes now get called after when ready, which makes the API cleaner

Before:
```javascript
record = client.record.getRecord( 'user1' )
record.set( 'name', 'bob' )
record.onReady( () => {
  record.discard()
})
```

Now:
```javascript
record = client.record.getRecord( 'user1' )
record
  .set( 'name', 'bob' )
  .discard()
```

###### Exposed Constants
You can now access constants on deepstream

```javascript
// on the constructor
const C = deepstream.CONSTANTS;
// and instance
const client = deepstream( 'localhost:6020' )
CONST C = client.CONSTANTS;
```

### Breaking Changes

###### Login callback

The login callback now only takes two arguments instead of three. This is to make it easier for the user to send their own custom data from an authentication hander or when using the http authentication handler

```javascript
client.login( {}, ( success, data ) => {
  if( success ) {
    // data is meta data associated with user session
    // or null
  } else {
    // data is error message or custom error object
    // with reason why or null
  }
} )
```

###### EngineIO Default Path
We now use `deepstream` instead of `engine.io` as the default engineio path

### Bug Fixes

- Login after logout doesn't overide auth parameters #88

- Deepstream not updating object properties #96 ( @drsirmrpresidentfathercharles )