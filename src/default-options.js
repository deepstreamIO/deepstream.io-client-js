var MERGE_STRATEGIES = require( './constants/merge-strategies' );

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
	 * @param {Number} maxReconnectInterval       Specifies the maximum number of milliseconds for the reconnectIntervalIncrement
	 *                                            The amount of reconnections will reach this value
	 *                                            then reconnectIntervalIncrement will be ignored.
	 */
	maxReconnectInterval: 180000,

	/**
	 * @param {Number} maxReconnectAttempts		The number of reconnection attempts until the client gives
	 *                                       	up and declares the connection closed
	 */
	maxReconnectAttempts: 5,

	/**
	 * @param {Number} rpcAckTimeout			The number of milliseconds after which a rpc will create an error if
	 * 											no Ack-message has been received
	 */
	 rpcAckTimeout: 6000,

	 /**
	 * @param {Number} rpcResponseTimeout		The number of milliseconds after which a rpc will create an error if
	 * 											no response-message has been received
	 */
	 rpcResponseTimeout: 10000,

	 /**
	 * @param {Number} subscriptionTimeout		The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/
	 * 											listening to a record before an error is thrown
	 */
	 subscriptionTimeout: 2000,

	 /**
	  * @param {Number} maxMessagesPerPacket	If the implementation tries to send a large number of messages at the same
	  *                                      	time, the deepstream client will try to split them into smaller packets and send
	  *                                      	these every <timeBetweenSendingQueuedPackages> ms.
	  *
	  *                                       	This parameter specifies the number of messages after which deepstream sends the
	  *                                       	packet and queues the remaining messages. Set to Infinity to turn the feature off.
	  *
	  */
	 maxMessagesPerPacket: 100,

	 /**
	  * @param {Number} timeBetweenSendingQueuedPackages Please see description for maxMessagesPerPacket. Sets the time in ms.
	  */
	 timeBetweenSendingQueuedPackages: 16,

	 /**
	  * @param {Number} recordReadAckTimeout 	The number of milliseconds from the moment client.record.getRecord() is called
	  *                                       	until an error is thrown since no ack message has been received.
	  */
	 recordReadAckTimeout: 1000,

	 /**
	  * @param {Number} recordReadTimeout 		The number of milliseconds from the moment client.record.getRecord() is called
	  *                                       	until an error is thrown since no data has been received.
	  */
	 recordReadTimeout: 3000,

	 /**
	  * @param {Number} recordDeleteTimeout 	The number of milliseconds from the moment record.delete() is called
	  *                                       	until an error is thrown since no delete ack message had been received. Please
	  *                                       	take into account that the deletion is only complete after the record has been
	  *                                       	deleted from both cache and storage
	  */
	 recordDeleteTimeout: 3000,

	 /**
	  * @param {Number} calleeAckTimeout 		The number of milliseconds from the moment webrtc.registerCallee has been
	  *                                    		called until an error is thrown since no ACK response has been received
	  */
	 calleeAckTimeout: 3000,

	 /**
	  * @param {Object} rtcPeerConnectionConfig An RTCConfiguration (https://developer.mozilla.org/en/docs/Web/API/RTCConfiguration). This
	  *                                         is used to establish your public IP address when behind a NAT (Network Address Translation)
	  *                                         Set to null if you only intend to use WebRTC within your local network
	  */
	 rtcPeerConnectionConfig: { iceServers: [
		{ url: 'stun:stun.services.mozilla.com' },
		{ url: 'stun:stun.l.google.com:19302' }
	]},

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
	upgrade: true,

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
	path: '/deepstream',

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
	rememberUpgrade: false,

	/**
   *  @param {Function} mergeStrategy 	This provides the default strategy used to deal with merge conflicts.
	 *                                   If the merge strategy is not succesfull it will set an error, else set the
	 *                                   returned data as the latest revision. This can be overriden on a per record
	 *                                   basis by setting the `setMergeStrategy`.
	 */
	mergeStrategy: MERGE_STRATEGIES.REMOTE_WINS
};
