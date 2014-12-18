module.exports = {
	/************************************************
	* Deepstream									*
	************************************************/

	/**
	 * @param {Boolean} recordPersistDefault Whether records should be 
	 *                                       persisted by default. Can be overwritten
	 *                                       for individual records when calling getRecord( name, persist );
	 */
	recordPersistDefault: true,

	/**
	 * @param {Number} reconnectIntervalIncrement Specifies the number of milliseconds by which the time until
	 *                                            the next reconnection attempt will be incremented after every
	 *                                            unsuccesful attempt.
	 *                                            E.g. for 1500: if the connection is lost, the client will attempt to reconnect
	 *                                            immediatly, if that fails it will try again after 1.5 seconds, if that fails
	 *                                            it will try again after 3 seconds and so on
	 */
	reconnectIntervalIncrement: 4000,

	/**
	 * @param {Number} maxReconnectAttempts		The number of reconnection attempts until the client gives
	 *                                       	up and declares the connection closed
	 */
	maxReconnectAttempts: 5,
	
	/**
	 * @param {Number} rpcAckTimeout			The number of milliseconds after which a rpc will create an error if
	 * 											no Ack-message has been received
	 */
	 rpcAckTimeout: 2000,
	 
	 /**
	 * @param {Number} rpcResponseTimeout		The number of milliseconds after which a rpc will create an error if
	 * 											no response-message has been received
	 */
	 rpcResponseTimeout: 10000,

	 /**
	 * @param {Number} subscriptionTimeout		The number of milliseconds that can pass after providing a RPC or subscribing
	 *                                      	to a record before an error is thrown
	 */
	 subscriptionTimeout: 2000,

	/************************************************
	* Engine.io										*
	************************************************/

	/**
	 * @param {http.Agent} agent http.Agent to use, defaults to false (NodeJS only)
	 */
	agent: false,

	/**
	 * @param {Boolean} upgrade 	whether the client should try to upgrade the 
	 *                          	transport from long-polling to something better
	 */
	upgrade: false,

	/**
	 * @param {Boolean} forceJSONP forces JSONP for polling transport
	 */
	forceJSONP: false,

	/**
	 * @param {Boolean} jsonp determines whether to use JSONP when 
	 *                        necessary for polling. If disabled (by settings to false) 
	 *                        an error will be emitted (saying "No transports available") 
	 *                        if no other transports are available. If another transport 
	 *                        is available for opening a connection (e.g. WebSocket) 
	 *                        that transport will be used instead.
	 */
	jsonp: true,

	/**
	 * @param {Boolean} forceBase64 forces base 64 encoding for polling transport even when XHR2 responseType 
	 *                              is available and WebSocket even if the used standard supports binary.
	 */
	forceBase64: false,

	/**
	 * @param {Boolean} enablesXDR 	enables XDomainRequest for IE8 to avoid loading bar flashing with click sound. 
	 *                              default to false because XDomainRequest has a flaw of not sending cookie.
	 */
	enablesXDR: false,

	/**
	 * @param {Boolean} timestampRequests 	whether to add the timestamp with each transport request. Note: this is 
	 *                                     	ignored if the browser is IE or Android, in which case requests are always stamped
	 */
	timestampRequests: false,

	/**
	 * @param {String} timestampParam timestamp parameter
	 */
	timestampParam: 't',

	/**
	 * @param {Number} policyPort ort the policy server listens on
	 */
	policyPort: 843,

	/**
	 * @param {String} path path to connect to
	 */
	path: '/engine.io',

	/**
	 * @param {Array} transports 	a list of transports to try (in order). Engine always 
	 *                             	attempts to connect directly with the first one, 
	 *                             	provided the feature detection test for it passes.
	 */
	transports: [ 'polling', 'websocket' ],

	/**
	 * @param {Boolean} rememberUpgrade 	If true and if the previous websocket connection to 
	 *                                   	the server succeeded, the connection attempt will bypass the normal 
	 *                                   	upgrade process and will initially try websocket. A connection 
	 *                                   	attempt following a transport error will use the normal upgrade 
	 *                                   	process. It is recommended you turn this on only when using 
	 *                                   	SSL/TLS connections, or if you know that 
	 *                                   	your network does not block websockets.
	 */
	rememberUpgrade: false
};