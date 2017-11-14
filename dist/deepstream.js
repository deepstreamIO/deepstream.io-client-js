/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _exports$ACTIONS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var META_KEYS;
(function (META_KEYS) {
    META_KEYS["payloadEncoding"] = "e";
    META_KEYS["name"] = "n";
    META_KEYS["names"] = "m";
    META_KEYS["subscription"] = "s";
    META_KEYS["correlationId"] = "c";
    META_KEYS["version"] = "v";
    META_KEYS["path"] = "p";
    META_KEYS["reason"] = "r";
    META_KEYS["url"] = "u";
    META_KEYS["originalTopic"] = "t";
    META_KEYS["originalAction"] = "a";
})(META_KEYS = exports.META_KEYS || (exports.META_KEYS = {}));
var PAYLOAD_ENCODING;
(function (PAYLOAD_ENCODING) {
    PAYLOAD_ENCODING["JSON"] = "j";
    PAYLOAD_ENCODING["BINARY"] = "b";
})(PAYLOAD_ENCODING = exports.PAYLOAD_ENCODING || (exports.PAYLOAD_ENCODING = {}));
var TOPIC;
(function (TOPIC) {
    TOPIC[TOPIC["ERROR"] = 0] = "ERROR";
    TOPIC[TOPIC["PARSER"] = 1] = "PARSER";
    TOPIC[TOPIC["CONNECTION"] = 2] = "CONNECTION";
    TOPIC[TOPIC["AUTH"] = 3] = "AUTH";
    TOPIC[TOPIC["EVENT"] = 4] = "EVENT";
    TOPIC[TOPIC["RECORD"] = 5] = "RECORD";
    TOPIC[TOPIC["RPC"] = 6] = "RPC";
    TOPIC[TOPIC["PRESENCE"] = 7] = "PRESENCE";
    TOPIC[TOPIC["SUBSCRIPTIONS"] = 16] = "SUBSCRIPTIONS";
    TOPIC[TOPIC["ONLINE_USERS"] = 17] = "ONLINE_USERS";
    TOPIC[TOPIC["EVENT_SUBSCRIPTIONS"] = 32] = "EVENT_SUBSCRIPTIONS";
    TOPIC[TOPIC["RECORD_SUBSCRIPTIONS"] = 33] = "RECORD_SUBSCRIPTIONS";
    TOPIC[TOPIC["RPC_SUBSCRIPTIONS"] = 34] = "RPC_SUBSCRIPTIONS";
    TOPIC[TOPIC["PRESENCE_SUBSCRIPTIONS"] = 35] = "PRESENCE_SUBSCRIPTIONS";
    TOPIC[TOPIC["RECORD_LISTEN_PATTERNS"] = 36] = "RECORD_LISTEN_PATTERNS";
    TOPIC[TOPIC["EVENT_LISTEN_PATTERNS"] = 37] = "EVENT_LISTEN_PATTERNS";
    TOPIC[TOPIC["RECORD_PUBLISHED_SUBSCRIPTIONS"] = 38] = "RECORD_PUBLISHED_SUBSCRIPTIONS";
    TOPIC[TOPIC["EVENT_PUBLISHED_SUBSCRIPTIONS"] = 39] = "EVENT_PUBLISHED_SUBSCRIPTIONS";
    TOPIC[TOPIC["RECORD_LISTENING"] = 40] = "RECORD_LISTENING";
    TOPIC[TOPIC["EVENT_LISTENING"] = 41] = "EVENT_LISTENING";
})(TOPIC = exports.TOPIC || (exports.TOPIC = {}));
var PARSER_ACTIONS;
(function (PARSER_ACTIONS) {
    PARSER_ACTIONS[PARSER_ACTIONS["UNKNOWN_TOPIC"] = 80] = "UNKNOWN_TOPIC";
    PARSER_ACTIONS[PARSER_ACTIONS["UNKNOWN_ACTION"] = 81] = "UNKNOWN_ACTION";
    PARSER_ACTIONS[PARSER_ACTIONS["INVALID_MESSAGE"] = 82] = "INVALID_MESSAGE";
    PARSER_ACTIONS[PARSER_ACTIONS["MESSAGE_PARSE_ERROR"] = 83] = "MESSAGE_PARSE_ERROR";
    PARSER_ACTIONS[PARSER_ACTIONS["MAXIMUM_MESSAGE_SIZE_EXCEEDED"] = 84] = "MAXIMUM_MESSAGE_SIZE_EXCEEDED";
    PARSER_ACTIONS[PARSER_ACTIONS["ERROR"] = 85] = "ERROR";
    PARSER_ACTIONS[PARSER_ACTIONS["INVALID_META_PARAMS"] = 86] = "INVALID_META_PARAMS";
})(PARSER_ACTIONS = exports.PARSER_ACTIONS || (exports.PARSER_ACTIONS = {}));
var CONNECTION_ACTIONS;
(function (CONNECTION_ACTIONS) {
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["ERROR"] = 0] = "ERROR";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["PING"] = 1] = "PING";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["PONG"] = 2] = "PONG";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["ACCEPT"] = 3] = "ACCEPT";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["CHALLENGE"] = 4] = "CHALLENGE";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["CHALLENGE_RESPONSE"] = 5] = "CHALLENGE_RESPONSE";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["REJECT"] = 6] = "REJECT";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["REDIRECT"] = 7] = "REDIRECT";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["CLOSING"] = 8] = "CLOSING";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["CLOSED"] = 9] = "CLOSED";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["AUTHENTICATION_TIMEOUT"] = 80] = "AUTHENTICATION_TIMEOUT";
    CONNECTION_ACTIONS[CONNECTION_ACTIONS["INVALID_MESSAGE"] = 82] = "INVALID_MESSAGE";
})(CONNECTION_ACTIONS = exports.CONNECTION_ACTIONS || (exports.CONNECTION_ACTIONS = {}));
var AUTH_ACTIONS;
(function (AUTH_ACTIONS) {
    AUTH_ACTIONS[AUTH_ACTIONS["ERROR"] = 0] = "ERROR";
    AUTH_ACTIONS[AUTH_ACTIONS["REQUEST"] = 1] = "REQUEST";
    AUTH_ACTIONS[AUTH_ACTIONS["AUTH_SUCCESSFUL"] = 2] = "AUTH_SUCCESSFUL";
    AUTH_ACTIONS[AUTH_ACTIONS["AUTH_UNSUCCESSFUL"] = 3] = "AUTH_UNSUCCESSFUL";
    AUTH_ACTIONS[AUTH_ACTIONS["TOO_MANY_AUTH_ATTEMPTS"] = 80] = "TOO_MANY_AUTH_ATTEMPTS";
    AUTH_ACTIONS[AUTH_ACTIONS["INVALID_MESSAGE"] = 82] = "INVALID_MESSAGE";
    AUTH_ACTIONS[AUTH_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    AUTH_ACTIONS[AUTH_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    AUTH_ACTIONS[AUTH_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
})(AUTH_ACTIONS = exports.AUTH_ACTIONS || (exports.AUTH_ACTIONS = {}));
var EVENT_ACTIONS;
(function (EVENT_ACTIONS) {
    EVENT_ACTIONS[EVENT_ACTIONS["ERROR"] = 0] = "ERROR";
    EVENT_ACTIONS[EVENT_ACTIONS["EMIT"] = 1] = "EMIT";
    EVENT_ACTIONS[EVENT_ACTIONS["SUBSCRIBE"] = 2] = "SUBSCRIBE";
    EVENT_ACTIONS[EVENT_ACTIONS["SUBSCRIBE_ACK"] = 130] = "SUBSCRIBE_ACK";
    EVENT_ACTIONS[EVENT_ACTIONS["UNSUBSCRIBE"] = 3] = "UNSUBSCRIBE";
    EVENT_ACTIONS[EVENT_ACTIONS["UNSUBSCRIBE_ACK"] = 131] = "UNSUBSCRIBE_ACK";
    EVENT_ACTIONS[EVENT_ACTIONS["LISTEN"] = 4] = "LISTEN";
    EVENT_ACTIONS[EVENT_ACTIONS["LISTEN_ACK"] = 132] = "LISTEN_ACK";
    EVENT_ACTIONS[EVENT_ACTIONS["UNLISTEN"] = 5] = "UNLISTEN";
    EVENT_ACTIONS[EVENT_ACTIONS["UNLISTEN_ACK"] = 133] = "UNLISTEN_ACK";
    EVENT_ACTIONS[EVENT_ACTIONS["LISTEN_ACCEPT"] = 6] = "LISTEN_ACCEPT";
    EVENT_ACTIONS[EVENT_ACTIONS["LISTEN_REJECT"] = 7] = "LISTEN_REJECT";
    EVENT_ACTIONS[EVENT_ACTIONS["SUBSCRIPTION_FOR_PATTERN_FOUND"] = 8] = "SUBSCRIPTION_FOR_PATTERN_FOUND";
    EVENT_ACTIONS[EVENT_ACTIONS["SUBSCRIPTION_FOR_PATTERN_REMOVED"] = 9] = "SUBSCRIPTION_FOR_PATTERN_REMOVED";
    EVENT_ACTIONS[EVENT_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    EVENT_ACTIONS[EVENT_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    EVENT_ACTIONS[EVENT_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
    EVENT_ACTIONS[EVENT_ACTIONS["MULTIPLE_SUBSCRIPTIONS"] = 99] = "MULTIPLE_SUBSCRIPTIONS";
    EVENT_ACTIONS[EVENT_ACTIONS["NOT_SUBSCRIBED"] = 100] = "NOT_SUBSCRIBED";
})(EVENT_ACTIONS = exports.EVENT_ACTIONS || (exports.EVENT_ACTIONS = {}));
var RECORD_ACTIONS;
(function (RECORD_ACTIONS) {
    RECORD_ACTIONS[RECORD_ACTIONS["ERROR"] = 0] = "ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["READ"] = 1] = "READ";
    RECORD_ACTIONS[RECORD_ACTIONS["READ_RESPONSE"] = 2] = "READ_RESPONSE";
    RECORD_ACTIONS[RECORD_ACTIONS["HEAD"] = 3] = "HEAD";
    RECORD_ACTIONS[RECORD_ACTIONS["HEAD_RESPONSE"] = 4] = "HEAD_RESPONSE";
    RECORD_ACTIONS[RECORD_ACTIONS["DELETE"] = 5] = "DELETE";
    RECORD_ACTIONS[RECORD_ACTIONS["DELETE_SUCCESS"] = 6] = "DELETE_SUCCESS";
    RECORD_ACTIONS[RECORD_ACTIONS["DELETED"] = 8] = "DELETED";
    RECORD_ACTIONS[RECORD_ACTIONS["WRITE_ACKNOWLEDGEMENT"] = 9] = "WRITE_ACKNOWLEDGEMENT";
    RECORD_ACTIONS[RECORD_ACTIONS["CREATE"] = 16] = "CREATE";
    RECORD_ACTIONS[RECORD_ACTIONS["CREATEANDUPDATE"] = 17] = "CREATEANDUPDATE";
    RECORD_ACTIONS[RECORD_ACTIONS["CREATEANDUPDATE_WITH_WRITE_ACK"] = 18] = "CREATEANDUPDATE_WITH_WRITE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["CREATEANDPATCH"] = 19] = "CREATEANDPATCH";
    RECORD_ACTIONS[RECORD_ACTIONS["CREATEANDPATCH_WITH_WRITE_ACK"] = 20] = "CREATEANDPATCH_WITH_WRITE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["UPDATE"] = 21] = "UPDATE";
    RECORD_ACTIONS[RECORD_ACTIONS["UPDATE_WITH_WRITE_ACK"] = 22] = "UPDATE_WITH_WRITE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["PATCH"] = 23] = "PATCH";
    RECORD_ACTIONS[RECORD_ACTIONS["PATCH_WITH_WRITE_ACK"] = 24] = "PATCH_WITH_WRITE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["ERASE"] = 25] = "ERASE";
    RECORD_ACTIONS[RECORD_ACTIONS["ERASE_WITH_WRITE_ACK"] = 26] = "ERASE_WITH_WRITE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBEANDHEAD"] = 32] = "SUBSCRIBEANDHEAD";
    // SUBSCRIBEANDHEAD_RESPONSE = 0x21,
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBEANDREAD"] = 34] = "SUBSCRIBEANDREAD";
    // SUBSCRIBEANDREAD_RESPONSE = 0x23,
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBECREATEANDREAD"] = 36] = "SUBSCRIBECREATEANDREAD";
    // SUBSCRIBECREATEANDREAD_RESPONSE = 0x25,
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBECREATEANDUPDATE"] = 38] = "SUBSCRIBECREATEANDUPDATE";
    // SUBSCRIBECREATEANDUPDATE_RESPONSE = 0x27,
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBE"] = 40] = "SUBSCRIBE";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIBE_ACK"] = 168] = "SUBSCRIBE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["UNSUBSCRIBE"] = 41] = "UNSUBSCRIBE";
    RECORD_ACTIONS[RECORD_ACTIONS["UNSUBSCRIBE_ACK"] = 169] = "UNSUBSCRIBE_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["LISTEN"] = 48] = "LISTEN";
    RECORD_ACTIONS[RECORD_ACTIONS["LISTEN_ACK"] = 176] = "LISTEN_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["UNLISTEN"] = 49] = "UNLISTEN";
    RECORD_ACTIONS[RECORD_ACTIONS["UNLISTEN_ACK"] = 177] = "UNLISTEN_ACK";
    RECORD_ACTIONS[RECORD_ACTIONS["LISTEN_ACCEPT"] = 50] = "LISTEN_ACCEPT";
    RECORD_ACTIONS[RECORD_ACTIONS["LISTEN_REJECT"] = 51] = "LISTEN_REJECT";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIPTION_HAS_PROVIDER"] = 52] = "SUBSCRIPTION_HAS_PROVIDER";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIPTION_HAS_NO_PROVIDER"] = 53] = "SUBSCRIPTION_HAS_NO_PROVIDER";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIPTION_FOR_PATTERN_FOUND"] = 54] = "SUBSCRIPTION_FOR_PATTERN_FOUND";
    RECORD_ACTIONS[RECORD_ACTIONS["SUBSCRIPTION_FOR_PATTERN_REMOVED"] = 55] = "SUBSCRIPTION_FOR_PATTERN_REMOVED";
    RECORD_ACTIONS[RECORD_ACTIONS["CACHE_RETRIEVAL_TIMEOUT"] = 80] = "CACHE_RETRIEVAL_TIMEOUT";
    RECORD_ACTIONS[RECORD_ACTIONS["STORAGE_RETRIEVAL_TIMEOUT"] = 81] = "STORAGE_RETRIEVAL_TIMEOUT";
    RECORD_ACTIONS[RECORD_ACTIONS["VERSION_EXISTS"] = 82] = "VERSION_EXISTS";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_LOAD_ERROR"] = 83] = "RECORD_LOAD_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_CREATE_ERROR"] = 84] = "RECORD_CREATE_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_UPDATE_ERROR"] = 85] = "RECORD_UPDATE_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_DELETE_ERROR"] = 86] = "RECORD_DELETE_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_READ_ERROR"] = 87] = "RECORD_READ_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_NOT_FOUND"] = 88] = "RECORD_NOT_FOUND";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_VERSION"] = 89] = "INVALID_VERSION";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_PATCH_ON_HOTPATH"] = 90] = "INVALID_PATCH_ON_HOTPATH";
    RECORD_ACTIONS[RECORD_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
    RECORD_ACTIONS[RECORD_ACTIONS["MULTIPLE_SUBSCRIPTIONS"] = 99] = "MULTIPLE_SUBSCRIPTIONS";
    RECORD_ACTIONS[RECORD_ACTIONS["NOT_SUBSCRIBED"] = 100] = "NOT_SUBSCRIBED";
    // Deprecated
    RECORD_ACTIONS[RECORD_ACTIONS["HAS"] = 112] = "HAS";
    RECORD_ACTIONS[RECORD_ACTIONS["HAS_RESPONSE"] = 113] = "HAS_RESPONSE";
})(RECORD_ACTIONS = exports.RECORD_ACTIONS || (exports.RECORD_ACTIONS = {}));
var RPC_ACTIONS;
(function (RPC_ACTIONS) {
    RPC_ACTIONS[RPC_ACTIONS["ERROR"] = 0] = "ERROR";
    RPC_ACTIONS[RPC_ACTIONS["REQUEST"] = 1] = "REQUEST";
    RPC_ACTIONS[RPC_ACTIONS["ACCEPT"] = 2] = "ACCEPT";
    RPC_ACTIONS[RPC_ACTIONS["RESPONSE"] = 3] = "RESPONSE";
    RPC_ACTIONS[RPC_ACTIONS["REJECT"] = 4] = "REJECT";
    RPC_ACTIONS[RPC_ACTIONS["REQUEST_ERROR"] = 5] = "REQUEST_ERROR";
    RPC_ACTIONS[RPC_ACTIONS["PROVIDE"] = 6] = "PROVIDE";
    RPC_ACTIONS[RPC_ACTIONS["PROVIDE_ACK"] = 134] = "PROVIDE_ACK";
    RPC_ACTIONS[RPC_ACTIONS["UNPROVIDE"] = 7] = "UNPROVIDE";
    RPC_ACTIONS[RPC_ACTIONS["UNPROVIDE_ACK"] = 135] = "UNPROVIDE_ACK";
    RPC_ACTIONS[RPC_ACTIONS["NO_RPC_PROVIDER"] = 80] = "NO_RPC_PROVIDER";
    RPC_ACTIONS[RPC_ACTIONS["ACCEPT_TIMEOUT"] = 82] = "ACCEPT_TIMEOUT";
    RPC_ACTIONS[RPC_ACTIONS["MULTIPLE_ACCEPT"] = 83] = "MULTIPLE_ACCEPT";
    RPC_ACTIONS[RPC_ACTIONS["INVALID_RPC_CORRELATION_ID"] = 84] = "INVALID_RPC_CORRELATION_ID";
    RPC_ACTIONS[RPC_ACTIONS["RESPONSE_TIMEOUT"] = 85] = "RESPONSE_TIMEOUT";
    RPC_ACTIONS[RPC_ACTIONS["MULTIPLE_RESPONSE"] = 86] = "MULTIPLE_RESPONSE";
    RPC_ACTIONS[RPC_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    RPC_ACTIONS[RPC_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    RPC_ACTIONS[RPC_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
    RPC_ACTIONS[RPC_ACTIONS["MULTIPLE_PROVIDERS"] = 99] = "MULTIPLE_PROVIDERS";
    RPC_ACTIONS[RPC_ACTIONS["NOT_PROVIDED"] = 100] = "NOT_PROVIDED";
})(RPC_ACTIONS = exports.RPC_ACTIONS || (exports.RPC_ACTIONS = {}));
var PRESENCE_ACTIONS;
(function (PRESENCE_ACTIONS) {
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["ERROR"] = 0] = "ERROR";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["QUERY_ALL"] = 1] = "QUERY_ALL";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["QUERY_ALL_RESPONSE"] = 2] = "QUERY_ALL_RESPONSE";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["QUERY"] = 3] = "QUERY";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["QUERY_RESPONSE"] = 4] = "QUERY_RESPONSE";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["PRESENCE_JOIN"] = 5] = "PRESENCE_JOIN";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["PRESENCE_JOIN_ALL"] = 6] = "PRESENCE_JOIN_ALL";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["PRESENCE_LEAVE"] = 7] = "PRESENCE_LEAVE";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["PRESENCE_LEAVE_ALL"] = 8] = "PRESENCE_LEAVE_ALL";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["SUBSCRIBE"] = 9] = "SUBSCRIBE";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["SUBSCRIBE_ACK"] = 137] = "SUBSCRIBE_ACK";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["UNSUBSCRIBE"] = 10] = "UNSUBSCRIBE";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["UNSUBSCRIBE_ACK"] = 138] = "UNSUBSCRIBE_ACK";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["SUBSCRIBE_ALL"] = 11] = "SUBSCRIBE_ALL";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["SUBSCRIBE_ALL_ACK"] = 139] = "SUBSCRIBE_ALL_ACK";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["UNSUBSCRIBE_ALL"] = 12] = "UNSUBSCRIBE_ALL";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["UNSUBSCRIBE_ALL_ACK"] = 140] = "UNSUBSCRIBE_ALL_ACK";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["INVALID_PRESENCE_USERS"] = 80] = "INVALID_PRESENCE_USERS";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["MULTIPLE_SUBSCRIPTIONS"] = 99] = "MULTIPLE_SUBSCRIPTIONS";
    PRESENCE_ACTIONS[PRESENCE_ACTIONS["NOT_SUBSCRIBED"] = 100] = "NOT_SUBSCRIBED";
})(PRESENCE_ACTIONS = exports.PRESENCE_ACTIONS || (exports.PRESENCE_ACTIONS = {}));
exports.ACTIONS = (_exports$ACTIONS = {}, _defineProperty(_exports$ACTIONS, TOPIC.PARSER, PARSER_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.CONNECTION, CONNECTION_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.AUTH, AUTH_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.EVENT, EVENT_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.RECORD, RECORD_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.RPC, RPC_ACTIONS), _defineProperty(_exports$ACTIONS, TOPIC.PRESENCE, PRESENCE_ACTIONS), _exports$ACTIONS);
var EVENT;
(function (EVENT) {
    EVENT["INFO"] = "INFO";
    EVENT["DEPRECATED"] = "DEPRECATED";
    EVENT["INCOMING_CONNECTION"] = "INCOMING_CONNECTION";
    EVENT["CLOSED_SOCKET_INTERACTION"] = "CLOSED_SOCKET_INTERACTION";
    EVENT["CLIENT_DISCONNECTED"] = "CLIENT_DISCONNECTED";
    EVENT["CONNECTION_ERROR"] = "CONNECTION_ERROR";
    EVENT["AUTH_ERROR"] = "AUTH_ERROR";
    EVENT["PLUGIN_ERROR"] = "PLUGIN_ERROR";
    EVENT["PLUGIN_INITIALIZATION_ERROR"] = "PLUGIN_INITIALIZATION_ERROR";
    EVENT["PLUGIN_INITIALIZATION_TIMEOUT"] = "PLUGIN_INITIALIZATION_TIMEOUT";
    EVENT["TIMEOUT"] = "TIMEOUT";
    EVENT["LEADING_LISTEN"] = "LEADING_LISTEN";
    EVENT["LOCAL_LISTEN"] = "LOCAL_LISTEN";
    EVENT["INVALID_CONFIG_DATA"] = "INVALID_CONFIG_DATA";
    EVENT["INVALID_STATE_TRANSITION"] = "INVALID_STATE_TRANSITION";
})(EVENT = exports.EVENT || (exports.EVENT = {}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var EVENT;
(function (EVENT) {
    EVENT[EVENT["UNSOLICITED_MESSAGE"] = 0] = "UNSOLICITED_MESSAGE";
    EVENT[EVENT["IS_CLOSED"] = 1] = "IS_CLOSED";
    EVENT[EVENT["MAX_RECONNECTION_ATTEMPTS_REACHED"] = 2] = "MAX_RECONNECTION_ATTEMPTS_REACHED";
    EVENT[EVENT["CONNECTION_ERROR"] = 3] = "CONNECTION_ERROR";
    EVENT[EVENT["ACK_TIMEOUT"] = 4] = "ACK_TIMEOUT";
    EVENT[EVENT["UNKNOWN_CORRELATION_ID"] = 5] = "UNKNOWN_CORRELATION_ID";
    EVENT[EVENT["HEARTBEAT_TIMEOUT"] = 6] = "HEARTBEAT_TIMEOUT";
    EVENT[EVENT["LISTENER_EXISTS"] = 7] = "LISTENER_EXISTS";
    EVENT[EVENT["NOT_LISTENING"] = 8] = "NOT_LISTENING";
    EVENT[EVENT["RECORD_ALREADY_DESTROYED"] = 9] = "RECORD_ALREADY_DESTROYED";
    EVENT[EVENT["RECORD_DELETE_TIMEOUT"] = 10] = "RECORD_DELETE_TIMEOUT";
    EVENT["CLIENT_OFFLINE"] = "client offline";
    EVENT["INVALID_AUTHENTICATION_DETAILS"] = "INVALID_AUTHENTICATION_DETAILS";
    EVENT["CONNECTION_LOST"] = "connectionLost";
    EVENT["CONNECTION_REESTABLISHED"] = "connectionReestablished";
    EVENT["CONNECTION_STATE_CHANGED"] = "connectionStateChanged";
    EVENT["AUTHENTICATION_TIMEOUT"] = "AUTHENTICATION_TIMEOUT";
    EVENT["RECORD_ERROR"] = "error";
    EVENT["RECORD_READY"] = "ready";
    EVENT["RECORD_DELETED"] = "delete";
    EVENT["RECORD_DISCARDED"] = "discard";
    EVENT["RECORD_VERSION_EXISTS"] = "versionExists";
    EVENT["RECORD_HAS_PROVIDER_CHANGED"] = "hasProviderChanged";
    EVENT["RECORD_STATE_CHANGED"] = "onRecordStateChanged";
    EVENT["ENTRY_ADDED_EVENT"] = "entry-added";
    EVENT["ENTRY_REMOVED_EVENT"] = "entry-removed";
    EVENT["ENTRY_MOVED_EVENT"] = "entry-moved";
})(EVENT = exports.EVENT || (exports.EVENT = {}));
var CONNECTION_STATE;
(function (CONNECTION_STATE) {
    CONNECTION_STATE["CLOSING"] = "CLOSING";
    CONNECTION_STATE["CLOSED"] = "CLOSED";
    CONNECTION_STATE["AWAITING_CONNECTION"] = "AWAITING_CONNECTION";
    CONNECTION_STATE["CHALLENGING"] = "CHALLENGING";
    CONNECTION_STATE["AWAITING_AUTHENTICATION"] = "AWAITING_AUTHENTICATION";
    CONNECTION_STATE["AUTHENTICATING"] = "AUTHENTICATING";
    CONNECTION_STATE["OPEN"] = "OPEN";
    CONNECTION_STATE["ERROR"] = "ERROR";
    CONNECTION_STATE["RECONNECTING"] = "RECONNECTING";
    CONNECTION_STATE["REDIRECTING"] = "REDIRECTING";
    CONNECTION_STATE["CHALLENGE_DENIED"] = "CHALLENGE_DENIED";
    CONNECTION_STATE["TOO_MANY_AUTH_ATTEMPTS"] = "TOO_MANY_AUTH_ATTEMPTS";
    CONNECTION_STATE["AUTHENTICATION_TIMEOUT"] = "AUTHENTICATION_TIMEOUT";
})(CONNECTION_STATE = exports.CONNECTION_STATE || (exports.CONNECTION_STATE = {}));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || Object.create(null);
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || Object.create(null);

  // all
  if (0 == arguments.length) {
    this._callbacks = Object.create(null);
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks[event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || Object.create(null);

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks[event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || Object.create(null);
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

/**
 * Returns an array listing the events for which the emitter has registered listeners.
 *
 * @return {Array}
 * @api public
 */
Emitter.prototype.eventNames = function(){
  return this._callbacks ? Object.keys(this._callbacks) : [];
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var URL = __webpack_require__(17);
/**
 * A regular expression that matches whitespace on either side, but
 * not in the center of a string
 */
var TRIM_REGULAR_EXPRESSION = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
/**
 * Removes whitespace from the beginning and end of a string
 */
exports.trim = function (inputString) {
    if (inputString.trim) {
        return inputString.trim();
    }
    return inputString.replace(TRIM_REGULAR_EXPRESSION, '');
};
/**
 * Compares two objects for deep (recoursive) equality
 *
 * This used to be a significantly more complex custom implementation,
 * but JSON.stringify has gotten so fast that it now outperforms the custom
 * way by a factor of 1.5 to 3.
 *
 * In IE11 / Edge the custom implementation is still slightly faster, but for
 * consistencies sake and the upsides of leaving edge-case handling to the native
 * browser / node implementation we'll go for JSON.stringify from here on.
 *
 * Please find performance test results here
 *
 * http://jsperf.com/deep-equals-code-vs-json
 */
exports.deepEquals = function (objA, objB) {
    if (objA === objB) {
        return true;
    } else if ((typeof objA === "undefined" ? "undefined" : _typeof(objA)) !== 'object' || (typeof objB === "undefined" ? "undefined" : _typeof(objB)) !== 'object') {
        return false;
    }
    return JSON.stringify(objA) === JSON.stringify(objB);
};
/**
 * Similar to deepEquals above, tests have shown that JSON stringify outperforms any attempt of
 * a code based implementation by 50% - 100% whilst also handling edge-cases and keeping
 * implementation complexity low.
 *
 * If ES6/7 ever decides to implement deep copying natively (what happened to Object.clone?
 * that was briefly a thing...), let's switch it for the native implementation. For now though,
 * even Object.assign({}, obj) only provides a shallow copy.
 *
 * Please find performance test results backing these statements here:
 *
 * http://jsperf.com/object-deep-copy-assign
 */
exports.deepCopy = function (obj) {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object') {
        return JSON.parse(JSON.stringify(obj));
    }
    return obj;
};
/**
 * Copy the top level of items, but do not copy its items recourisvely. This
 * is much quicker than deepCopy does not guarantee the object items are new/unique.
 * Mainly used to change the reference to the actual object itself, but not its children.
 */
exports.shallowCopy = function (obj) {
    if (Array.isArray(obj)) {
        return obj.slice(0);
    } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object') {
        var copy = Object.create(null);
        var props = Object.keys(obj);
        for (var i = 0; i < props.length; i++) {
            copy[props[i]] = obj[props[i]];
        }
        return copy;
    }
    return obj;
};
/**
 * Used to see if a protocol is specified within the url
 * @type {RegExp}
 */
var hasUrlProtocol = /^wss:|^ws:|^\/\//;
/**
 * Used to see if the protocol contains any unsupported protocols
 * @type {RegExp}
 */
var unsupportedProtocol = /^http:|^https:/;
/**
 * Take the url passed when creating the client and ensure the correct
 * protocol is provided
 * @param  {String} url Url passed in by client
 * @return {String} Url with supported protocol
 */
exports.parseUrl = function (initialURl, defaultPath) {
    var url = initialURl;
    if (unsupportedProtocol.test(url)) {
        throw new Error('Only ws and wss are supported');
    }
    if (!hasUrlProtocol.test(url)) {
        url = "ws://" + url;
    } else if (url.indexOf('//') === 0) {
        url = "ws:" + url;
    }
    var serverUrl = URL.parse(url);
    if (!serverUrl.host) {
        throw new Error('invalid url, missing host');
    }
    serverUrl.protocol = serverUrl.protocol ? serverUrl.protocol : 'ws:';
    serverUrl.pathname = serverUrl.pathname ? serverUrl.pathname : defaultPath;
    return URL.format(serverUrl);
};
/**
* Returns a random string. The first block of characters
* is a timestamp, in order to allow databases to optimize for semi-
* sequentuel numberings
*/
exports.getUid = function () {
    var timestamp = new Date().getTime().toString(36);
    var randomString = (Math.random() * 10000000000000000).toString(36).replace('.', '');
    return timestamp + "-" + randomString;
};
/**
 * Creates a map based on the types of the provided arguments
 */
exports.normalizeSetArguments = function (args) {
    var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var result = void 0;
    var isRootData = function isRootData(data) {
        return data !== undefined && (typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object';
    };
    var isNestedData = function isNestedData(data) {
        return typeof data !== 'function';
    };
    var isPath = function isPath(path) {
        return path !== undefined && typeof path === 'string';
    };
    var isCallback = function isCallback(callback) {
        return typeof callback === 'function';
    };
    if (args.length === startIndex + 1) {
        result = {
            path: undefined,
            data: isRootData(args[startIndex]) ? args[startIndex] : undefined,
            callback: undefined
        };
    }
    if (args.length === startIndex + 2) {
        result = { path: undefined, data: undefined, callback: undefined };
        if (!isCallback(args[startIndex + 1]) && isNestedData(args[startIndex + 1])) {
            result.path = isPath(args[startIndex]) ? args[startIndex] : false;
        }
        if (isPath(args[startIndex])) {
            result.data = isNestedData(args[startIndex + 1]) ? args[startIndex + 1] : undefined;
        } else {
            result.data = isRootData(args[startIndex]) ? args[startIndex] : undefined;
        }
        if (!isPath(args[startIndex])) {
            result.callback = isCallback(args[startIndex + 1]) ? args[startIndex + 1] : false;
        }
    }
    if (args.length === startIndex + 3) {
        result = {
            path: isPath(args[startIndex]) ? args[startIndex] : false,
            data: isNestedData(args[startIndex + 1]) ? args[startIndex + 1] : undefined,
            callback: isCallback(args[startIndex + 2]) ? args[startIndex + 2] : false
        };
    }
    if (result) {
        if (result.path !== undefined && result.path.length === 0 || result.path === false) {
            throw Error('Invalid set path argument');
        }
        if (result.data === undefined && !result.path) {
            throw Error('Invalid set data argument');
        }
        if (result.callback !== undefined && result.callback === false) {
            throw Error('Invalid set callback argument');
        }
        return result;
    }
    throw Error('Invalid set arguments');
};
/**
 * Creates a map based on the types of the provided arguments
 */
exports.normalizeArguments = function (args) {
    // If arguments is already a map of normalized parameters
    // (e.g. when called by AnonymousRecord), just return it.
    if (args.length === 1 && _typeof(args[0]) === 'object') {
        return args[0];
    }
    var result = Object.create(null);
    for (var i = 0; i < args.length; i++) {
        if (typeof args[i] === 'string') {
            result.path = args[i];
        } else if (typeof args[i] === 'function') {
            result.callback = args[i];
        } else if (typeof args[i] === 'boolean') {
            result.triggerNow = args[i];
        }
    }
    return result;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var client_options_1 = __webpack_require__(11);
var constants_1 = __webpack_require__(1);
exports.EVENT = constants_1.EVENT;
exports.CONNECTION_STATE = constants_1.CONNECTION_STATE;
var C = __webpack_require__(0);
exports.C = C;
var logger_1 = __webpack_require__(13);
var timeout_registry_1 = __webpack_require__(14);
var timer_registry_1 = __webpack_require__(15);
var connection_1 = __webpack_require__(16);
var socket_factory_1 = __webpack_require__(25);
var event_handler_1 = __webpack_require__(27);
var rpc_handler_1 = __webpack_require__(28);
var record_handler_1 = __webpack_require__(31);
var presence_handler_1 = __webpack_require__(38);
var EventEmitter = __webpack_require__(2);

var Client = function (_EventEmitter) {
    _inherits(Client, _EventEmitter);

    function Client(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

        _this.options = Object.assign({}, client_options_1.DefaultOptions, options);
        var services = {};
        services.logger = new logger_1.Logger(_this);
        services.timerRegistry = new timer_registry_1.TimerRegistry();
        services.timeoutRegistry = new timeout_registry_1.TimeoutRegistry(services, _this.options);
        services.socketFactory = options.socketFactory || socket_factory_1.socketFactory;
        services.connection = new connection_1.Connection(services, _this.options, url, _this);
        _this.services = services;
        _this.services.timeoutRegistry.onConnectionLost = services.connection.onLost.bind(_this);
        _this.event = new event_handler_1.EventHandler(_this.services, _this.options);
        _this.rpc = new rpc_handler_1.RPCHandler(_this.services, _this.options);
        _this.record = new record_handler_1.RecordHandler(_this.services, _this.options);
        _this.presence = new presence_handler_1.PresenceHandler(_this.services, _this.options);
        return _this;
    }

    _createClass(Client, [{
        key: "login",
        value: function login(details, callback) {
            this.services.connection.authenticate(details, callback);
        }
    }, {
        key: "getConnectionState",
        value: function getConnectionState() {
            return this.services.connection.getConnectionState();
        }
    }, {
        key: "close",
        value: function close() {
            this.services.connection.close();
        }
        /**
        * Returns a random string. The first block of characters
        * is a timestamp, in order to allow databases to optimize for semi-
        * sequentuel numberings
        */

    }, {
        key: "getUid",
        value: function getUid() {
            var timestamp = new Date().getTime().toString(36);
            var randomString = (Math.random() * 10000000000000000).toString(36).replace('.', '');
            return timestamp + "-" + randomString;
        }
    }]);

    return Client;
}(EventEmitter);

exports.Client = Client;
function deepstream(url, options) {
    return new Client(url, options);
}
exports.deepstream = deepstream;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
/* tslint:disable:no-bitwise */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(6);
var message_validator_1 = __webpack_require__(7);
function isError(message) {
    return message.action >= 0x50 && message.action < 0x70 || message.topic === message_constants_1.TOPIC.PARSER;
}
exports.isError = isError;
function parse(buffer) {
    var queue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var offset = 0;
    var messages = [];
    do {
        var _readBinary = readBinary(buffer, offset),
            bytesConsumed = _readBinary.bytesConsumed,
            rawMessage = _readBinary.rawMessage;

        if (!rawMessage) {
            break;
        }
        queue.push(rawMessage);
        offset += bytesConsumed;
        if (rawMessage.fin) {
            var joinedMessage = joinMessages(queue);
            var message = parseMessage(joinedMessage);
            queue.length = 0;
            messages.push(message);
        }
    } while (offset < buffer.length);
    return messages;
}
exports.parse = parse;
function parseData(message) {
    if (message.parsedData !== undefined || message.data === undefined) {
        return true;
    }
    if (message.payloadEncoding && message.payloadEncoding !== message_constants_1.PAYLOAD_ENCODING.JSON) {
        return new Error("unable to parse data of type '" + message.payloadEncoding + "'");
    }
    if (typeof message.data === 'string') {
        return new Error('tried to parse string data with binary parser');
    }
    message.parsedData = parseJSON(message.data);
    if (message.parsedData === undefined) {
        return new Error("unable to parse data " + message.data);
    }
    return true;
}
exports.parseData = parseData;
function readBinary(buff, offset) {
    if (buff.length < offset + constants_1.HEADER_LENGTH) {
        return { bytesConsumed: 0 };
    }
    var fin = !!(buff[offset] & 0x80);
    var topic = buff[offset] & 0x7F;
    var action = buff[offset + 1];
    var metaLength = buff.readUIntBE(offset + 2, 3);
    var payloadLength = buff.readUIntBE(offset + 5, 3);
    var messageLength = constants_1.HEADER_LENGTH + metaLength + payloadLength;
    if (buff.length < offset + messageLength) {
        return { bytesConsumed: 0 };
    }
    var rawHeader = buff.slice(offset, offset + constants_1.HEADER_LENGTH);
    var rawMessage = { fin: fin, topic: topic, action: action, rawHeader: rawHeader };
    if (metaLength > 0) {
        rawMessage.meta = buff.slice(offset + constants_1.HEADER_LENGTH, offset + constants_1.HEADER_LENGTH + metaLength);
    }
    if (payloadLength > 0) {
        rawMessage.payload = buff.slice(offset + constants_1.HEADER_LENGTH + metaLength, offset + messageLength);
    }
    return {
        bytesConsumed: messageLength,
        rawMessage: rawMessage
    };
}
function joinMessages(rawMessages) {
    if (rawMessages.length === 0) {
        throw new Error('parseMessage must not be called with an empty message queue');
    }
    if (rawMessages.length === 1) {
        return rawMessages[0];
    }
    var _rawMessages$ = rawMessages[0],
        topic = _rawMessages$.topic,
        action = _rawMessages$.action,
        rawHeader = _rawMessages$.rawHeader;

    var payloadSections = [];
    var metaSections = [];
    rawMessages.forEach(function (_ref) {
        var payloadSection = _ref.payload,
            metaSection = _ref.meta;

        if (payloadSection) {
            payloadSections.push(payloadSection);
        }
        if (metaSection) {
            metaSections.push(metaSection);
        }
    });
    var payload = Buffer.concat(payloadSections);
    var meta = Buffer.concat(metaSections);
    return { fin: true, topic: topic, action: action, rawHeader: rawHeader, meta: meta, payload: payload };
}
function parseMessage(rawMessage) {
    var rawTopic = rawMessage.topic,
        rawAction = rawMessage.action,
        rawHeader = rawMessage.rawHeader;

    if (message_constants_1.TOPIC[rawTopic] === undefined) {
        return {
            parseError: true,
            action: message_constants_1.PARSER_ACTIONS.UNKNOWN_TOPIC,
            parsedMessage: {
                topic: rawTopic,
                action: rawAction
            },
            description: "unknown topic " + rawTopic,
            raw: rawHeader
        };
    }
    var topic = rawTopic;
    if (message_constants_1.ACTIONS[topic][rawAction] === undefined) {
        return {
            parseError: true,
            action: message_constants_1.PARSER_ACTIONS.UNKNOWN_ACTION,
            parsedMessage: {
                topic: topic,
                action: rawAction
            },
            description: "unknown " + message_constants_1.TOPIC[topic] + " action " + rawAction,
            raw: rawHeader
        };
    }
    var action = rawAction & 0x7F;
    var message = { topic: topic, action: action };
    if (rawMessage.meta && rawMessage.meta.length > 0) {
        var meta = parseJSON(rawMessage.meta);
        if (!meta || (typeof meta === "undefined" ? "undefined" : _typeof(meta)) !== 'object') {
            return {
                parseError: true,
                action: message_constants_1.PARSER_ACTIONS.MESSAGE_PARSE_ERROR,
                parsedMessage: message,
                description: "invalid meta field " + rawMessage.meta.toString(),
                raw: rawHeader
            };
        }
        addMetadataToMessage(meta, message);
    }
    if (rawMessage.payload !== undefined) {
        if (!message_validator_1.hasPayload(message.topic, rawAction)) {
            return {
                parseError: true,
                action: message_constants_1.PARSER_ACTIONS.INVALID_MESSAGE,
                parsedMessage: message,
                description: 'should not have a payload'
            };
        }
        if (!message.payloadEncoding && topic === message_constants_1.TOPIC.PARSER) {
            message.payloadEncoding = message_constants_1.PAYLOAD_ENCODING.BINARY;
        }
        message.data = rawMessage.payload;
    }
    // if (rawMessage.payload && rawMessage.payload.length > 0) {
    //   const payload = parseJSON(rawMessage.payload)
    //   if (payload === undefined) {
    //     return {
    //       parseError: true,
    //       description: `invalid message data ${rawMessage.payload.toString()}`,
    //       parsedMessage: message,
    //       raw: rawHeader
    //     }
    //   }
    //   message.data = payload
    // }
    message.isAck = rawAction >= 0x80;
    message.isError = isError(message);
    if (message.topic === message_constants_1.TOPIC.RECORD && rawAction >= 0x10 && rawAction < 0x20) {
        message.isWriteAck = constants_1.isWriteAck(message.action);
    }
    var error = message_validator_1.validate(message);
    if (error) {
        console.trace('invalid message', message);
        return {
            parseError: true,
            action: message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS,
            parsedMessage: message,
            description: error
        };
    }
    return message;
}
function addMetadataToMessage(meta, message) {
    for (var key in message_constants_1.META_KEYS) {
        var value = meta[message_constants_1.META_KEYS[key]];
        if (value !== undefined) {
            message[key] = value;
        }
    }
}
function parseJSON(buff) {
    try {
        return JSON.parse(buff.toString());
    } catch (err) {
        return undefined;
    }
}
exports.parseJSON = parseJSON;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../../node_modules/node-libs-browser/node_modules/buffer/index.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Buffer))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _exports$actionToWrit;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
exports.HEADER_LENGTH = 8;
exports.META_PAYLOAD_OVERFLOW_LENGTH = Math.pow(2, 24) - 1;
function isWriteAck(action) {
    return action === message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK;
}
exports.isWriteAck = isWriteAck;
exports.actionToWriteAck = (_exports$actionToWrit = {}, _defineProperty(_exports$actionToWrit, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK), _defineProperty(_exports$actionToWrit, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK), _defineProperty(_exports$actionToWrit, message_constants_1.RECORD_ACTIONS.PATCH, message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK), _defineProperty(_exports$actionToWrit, message_constants_1.RECORD_ACTIONS.UPDATE, message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK), _defineProperty(_exports$actionToWrit, message_constants_1.RECORD_ACTIONS.ERASE, message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK), _exports$actionToWrit);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _payloadMap, _corrIdMap, _ackMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var payloadMap = (_payloadMap = {}, _defineProperty(_payloadMap, message_constants_1.TOPIC.PARSER, [message_constants_1.PARSER_ACTIONS.MESSAGE_PARSE_ERROR, message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS]), _defineProperty(_payloadMap, message_constants_1.TOPIC.AUTH, [message_constants_1.AUTH_ACTIONS.REQUEST, message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL, message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL]), _defineProperty(_payloadMap, message_constants_1.TOPIC.RECORD, [message_constants_1.RECORD_ACTIONS.READ_RESPONSE, message_constants_1.RECORD_ACTIONS.UPDATE, message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.PATCH, message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT, message_constants_1.RECORD_ACTIONS.VERSION_EXISTS]), _defineProperty(_payloadMap, message_constants_1.TOPIC.RPC, [message_constants_1.RPC_ACTIONS.REQUEST, message_constants_1.RPC_ACTIONS.RESPONSE]), _defineProperty(_payloadMap, message_constants_1.TOPIC.EVENT, [message_constants_1.EVENT_ACTIONS.EMIT]), _defineProperty(_payloadMap, message_constants_1.TOPIC.PRESENCE, [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.QUERY, message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE, message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE]), _payloadMap);
var corrIdMap = (_corrIdMap = {}, _defineProperty(_corrIdMap, message_constants_1.TOPIC.RPC, [message_constants_1.RPC_ACTIONS.REQUEST, message_constants_1.RPC_ACTIONS.REQUEST_ERROR, message_constants_1.RPC_ACTIONS.ACCEPT, message_constants_1.RPC_ACTIONS.REJECT, message_constants_1.RPC_ACTIONS.RESPONSE, message_constants_1.RPC_ACTIONS.MULTIPLE_RESPONSE, message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT, message_constants_1.RPC_ACTIONS.INVALID_RPC_CORRELATION_ID, message_constants_1.RPC_ACTIONS.MULTIPLE_ACCEPT, message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT, message_constants_1.RPC_ACTIONS.NO_RPC_PROVIDER, message_constants_1.RPC_ACTIONS.MESSAGE_PERMISSION_ERROR, message_constants_1.RPC_ACTIONS.MESSAGE_DENIED, message_constants_1.RPC_ACTIONS.INVALID_MESSAGE_DATA, message_constants_1.RPC_ACTIONS.MULTIPLE_PROVIDERS, message_constants_1.RPC_ACTIONS.NOT_PROVIDED]), _defineProperty(_corrIdMap, message_constants_1.TOPIC.PRESENCE, [message_constants_1.PRESENCE_ACTIONS.QUERY, message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ACK, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ACK]), _corrIdMap);
var ackMap = (_ackMap = {}, _defineProperty(_ackMap, message_constants_1.TOPIC.EVENT, [message_constants_1.EVENT_ACTIONS.SUBSCRIBE, message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE, message_constants_1.EVENT_ACTIONS.LISTEN, message_constants_1.EVENT_ACTIONS.UNLISTEN]), _defineProperty(_ackMap, message_constants_1.TOPIC.RECORD, [message_constants_1.RECORD_ACTIONS.SUBSCRIBE, message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE, message_constants_1.RECORD_ACTIONS.LISTEN, message_constants_1.RECORD_ACTIONS.UNLISTEN, message_constants_1.RECORD_ACTIONS.DELETE]), _defineProperty(_ackMap, message_constants_1.TOPIC.PRESENCE, [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL]), _defineProperty(_ackMap, message_constants_1.TOPIC.RPC, [message_constants_1.RPC_ACTIONS.PROVIDE, message_constants_1.RPC_ACTIONS.UNPROVIDE]), _ackMap);
function mapOfArraysHas(map, topic, action) {
    var actions = map[topic];
    if (!actions) {
        return false;
    }
    return actions.indexOf(action) !== -1;
}
exports.hasCorrelationId = function (topic, action) {
    return mapOfArraysHas(corrIdMap, topic, action);
};
exports.hasAck = function (topic, action) {
    return mapOfArraysHas(ackMap, topic, action);
};
exports.hasPayload = function (topic, action) {
    return mapOfArraysHas(payloadMap, topic, action);
};
function validate(message) {
    var action = message.action;
    if (message.isAck) {
        if (!exports.hasAck(message.topic, message.action)) {
            return 'should not have an ack';
        }
        action = message.action + 0x80;
    }
    /* errors e.g. MESSAGE_DENIED have might have different params dependent on the parameters of the
     * original message
     */
    if (action >= 0x60 && action < 0x70) {
        return;
    }
    var shouldHaveCorrelationId = exports.hasCorrelationId(message.topic, action);
    if (!!message.correlationId !== shouldHaveCorrelationId) {
        return "should " + (shouldHaveCorrelationId ? '' : 'not ') + "have a correlationId";
    }
    return;
}
exports.validate = validate;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var StateMachine = function () {
    function StateMachine(logger, stateMachine) {
        _classCallCheck(this, StateMachine);

        this.inEndState = false;
        this.logger = logger;
        this.transitions = stateMachine.transitions;
        this.state = stateMachine.init;
        this.stateMachine = stateMachine;
    }
    /**
     * Try to perform a state change
     */


    _createClass(StateMachine, [{
        key: "transition",
        value: function transition(transitionName) {
            var transition = void 0;
            for (var i = 0; i < this.transitions.length; i++) {
                transition = this.transitions[i];
                if (transitionName === transition.name && (this.state === transition.from || transition.from === undefined)) {
                    var oldState = this.state;
                    this.state = transition.to;
                    if (this.stateMachine.onStateChanged) {
                        this.stateMachine.onStateChanged(this.state, oldState);
                    }
                    if (transition.handler) {
                        transition.handler();
                    }
                    return;
                }
            }
            var details = JSON.stringify({ transition: transitionName, state: this.state });
            throw new Error("Invalid state transition: " + details);
        }
    }]);

    return StateMachine;
}();

exports.StateMachine = StateMachine;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);

var Listener = function () {
    function Listener(topic, services) {
        _classCallCheck(this, Listener);

        this.topic = topic;
        this.services = services;
        this.listeners = new Map();
        this.stopCallbacks = new Map();
        if (topic === message_constants_1.TOPIC.RECORD) {
            this.actions = message_constants_1.RECORD_ACTIONS;
        } else if (topic === message_constants_1.TOPIC.EVENT) {
            this.actions = message_constants_1.EVENT_ACTIONS;
        }
        this.services.connection.onLost(this.onConnectionLost.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
    }

    _createClass(Listener, [{
        key: "listen",
        value: function listen(pattern, callback) {
            if (typeof pattern !== 'string' || pattern.length === 0) {
                throw new Error('invalid argument pattern');
            }
            if (typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (this.listeners.has(pattern)) {
                this.services.logger.warn({
                    topic: this.topic,
                    action: constants_1.EVENT.LISTENER_EXISTS,
                    name: pattern
                });
                return;
            }
            this.listeners.set(pattern, callback);
            this.sendListen(pattern);
        }
    }, {
        key: "unlisten",
        value: function unlisten(pattern) {
            if (typeof pattern !== 'string' || pattern.length === 0) {
                throw new Error('invalid argument pattern');
            }
            if (!this.listeners.has(pattern)) {
                this.services.logger.warn({
                    topic: this.topic,
                    action: constants_1.EVENT.NOT_LISTENING,
                    name: pattern
                });
                return;
            }
            this.listeners.delete(pattern);
            this.sendUnlisten(pattern);
        }
        /*
        * Accepting a listener request informs deepstream that the current provider is willing to
        * provide the record or event matching the subscriptionName . This will establish the current
        * provider as the only publisher for the actual subscription with the deepstream cluster.
        * Either accept or reject needs to be called by the listener
        */

    }, {
        key: "accept",
        value: function accept(pattern, subscription) {
            this.services.connection.sendMessage({
                topic: this.topic,
                action: this.actions.LISTEN_ACCEPT,
                name: pattern,
                subscription: subscription
            });
        }
        /*
        * Rejecting a listener request informs deepstream that the current provider is not willing
        * to provide the record or event matching the subscriptionName . This will result in deepstream
        * requesting another provider to do so instead. If no other provider accepts or exists, the
        * resource will remain unprovided.
        * Either accept or reject needs to be called by the listener
        */

    }, {
        key: "reject",
        value: function reject(pattern, subscription) {
            this.services.connection.sendMessage({
                topic: this.topic,
                action: this.actions.LISTEN_REJECT,
                name: pattern,
                subscription: subscription
            });
        }
    }, {
        key: "stop",
        value: function stop(subscription, callback) {
            this.stopCallbacks.set(subscription, callback);
        }
    }, {
        key: "handle",
        value: function handle(message) {
            if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_FOUND) {
                var listener = this.listeners.get(message.name);
                if (listener) {
                    listener(message.subscription, {
                        accept: this.accept.bind(this, message.name, message.subscription),
                        reject: this.reject.bind(this, message.name, message.subscription),
                        onStop: this.stop.bind(this, message.subscription)
                    });
                }
                return;
            }
            if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
                var stopCallback = this.stopCallbacks.get(message.subscription);
                if (stopCallback) {
                    stopCallback(message.subscription);
                    this.stopCallbacks.delete(message.subscription);
                }
                return;
            }
            this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
        }
    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            this.stopCallbacks.forEach(function (callback, subscription) {
                callback(subscription);
            });
            this.stopCallbacks.clear();
        }
    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
            var _this = this;

            this.listeners.forEach(function (callback, pattern) {
                _this.sendListen(pattern);
            });
        }
        /*
        * Sends a C.ACTIONS.LISTEN to deepstream.
        */

    }, {
        key: "sendListen",
        value: function sendListen(pattern) {
            var message = {
                topic: this.topic,
                action: this.actions.LISTEN,
                name: pattern
            };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }, {
        key: "sendUnlisten",
        value: function sendUnlisten(pattern) {
            var message = {
                topic: this.topic,
                action: this.actions.UNLISTEN,
                name: pattern
            };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }]);

    return Listener;
}();

exports.Listener = Listener;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var merge_strategy_1 = __webpack_require__(12);
exports.DefaultOptions = {
    heartbeatInterval: 30000,
    reconnectIntervalIncrement: 4000,
    maxReconnectInterval: 180000,
    maxReconnectAttempts: 5,
    rpcAcceptTimeout: 6000,
    rpcResponseTimeout: 10000,
    subscriptionTimeout: 2000,
    recordReadAckTimeout: 15000,
    recordReadTimeout: 15000,
    recordDeleteTimeout: 15000,
    discardTimeout: 5000,
    path: '/deepstream',
    mergeStrategy: merge_strategy_1.REMOTE_WINS,
    recordDeepCopy: true,
    socketOptions: null
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Choose the server's state over the client's
**/
exports.REMOTE_WINS = function (record, remoteValue, remoteVersion, callback) {
  callback(null, remoteValue);
};
/**
 *  Choose the local state over the server's
**/
exports.LOCAL_WINS = function (record, remoteValue, remoteVersion, callback) {
  callback(null, record.get());
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
function isEvent(action) {
    return constants_1.EVENT[action] !== undefined;
}

var Logger = function () {
    function Logger(emitter) {
        _classCallCheck(this, Logger);

        this.emitter = emitter;
    }

    _createClass(Logger, [{
        key: "warn",
        value: function warn(message, event, meta) {
            // tslint:disable-next-line:no-console
            console.warn('warn', message, event, meta);
        }
    }, {
        key: "error",
        value: function error(message, event, meta) {
            // tslint:disable-next-line:no-console
            if (isEvent(event)) {
                if (event === constants_1.EVENT.IS_CLOSED) {
                    this.emitter.emit('error', meta, constants_1.EVENT[event], message_constants_1.TOPIC[message_constants_1.TOPIC.CONNECTION]);
                } else if (event === constants_1.EVENT.CONNECTION_ERROR) {
                    this.emitter.emit('error', meta, constants_1.EVENT[event], message_constants_1.TOPIC[message_constants_1.TOPIC.CONNECTION]);
                }
            } else {
                var action = event ? event : message.action;
                this.emitter.emit('error', meta, message_constants_1.ACTIONS[message.topic][action], message_constants_1.TOPIC[message.topic]);
            }
        }
    }]);

    return Logger;
}();

exports.Logger = Logger;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var EventEmitter = __webpack_require__(2);
/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 */

var TimeoutRegistry = function (_EventEmitter) {
    _inherits(TimeoutRegistry, _EventEmitter);

    function TimeoutRegistry(services, options) {
        _classCallCheck(this, TimeoutRegistry);

        var _this = _possibleConstructorReturn(this, (TimeoutRegistry.__proto__ || Object.getPrototypeOf(TimeoutRegistry)).call(this));

        _this.options = options;
        _this.services = services;
        _this.register = new Map();
        return _this;
    }
    /**
     * Add an entry
     */


    _createClass(TimeoutRegistry, [{
        key: "add",
        value: function add(timeout) {
            if (timeout.duration === undefined) {
                timeout.duration = this.options.subscriptionTimeout;
            }
            if (timeout.event === undefined) {
                timeout.event = constants_1.EVENT.ACK_TIMEOUT;
            }
            /*
            if (timeout.duration < 1) {
              should we throw an error?
              return -1
            }
            */
            if (!this.services.connection.isConnected) {
                return -1;
            }
            this.remove(timeout.message);
            var internalTimeout = Object.assign({}, {
                timerId: -1,
                uniqueName: this.getUniqueName(timeout.message),
                event: timeout.event
            }, { timeout: timeout });
            internalTimeout.timerId = this.services.timerRegistry.add({
                context: this,
                callback: this.onTimeout,
                duration: timeout.duration,
                data: internalTimeout
            });
            this.register.set(internalTimeout.timerId, internalTimeout);
            return internalTimeout.timerId;
        }
        /**
         * Remove an entry
         */

    }, {
        key: "remove",
        value: function remove(message) {
            var uniqueName = this.getUniqueName(message);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.register[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var timerId = _ref2[0];
                    var timeout = _ref2[1];

                    if (timeout.uniqueName === uniqueName) {
                        clearTimeout(timerId);
                        this.register.delete(timerId);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        /**
         * Processes an incoming ACK-message and removes the corresponding subscription
         */

    }, {
        key: "clear",
        value: function clear(timerId) {
            this.services.timerRegistry.remove(timerId);
            this.register.delete(timerId);
        }
        /**
         * Will be invoked if the timeout has occured before the ack message was received
         */

    }, {
        key: "onTimeout",
        value: function onTimeout(internalTimeout) {
            this.register.delete(internalTimeout.timerId);
            var timeout = internalTimeout.timeout;
            if (timeout.callback) {
                timeout.callback(timeout.event, timeout.message);
            } else {
                this.services.logger.warn(timeout.message, timeout.event);
            }
        }
        /**
         * Returns a unique name from the timeout
         */

    }, {
        key: "getUniqueName",
        value: function getUniqueName(message) {
            var action = message.originalAction || message.action;
            var name = "" + message.topic + action + "_";
            if (message.correlationId) {
                name += message.correlationId;
            } else if (message.name) {
                name += message.name;
            }
            return name;
        }
        /**
         * Remote all timeouts when connection disconnects
         */

    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.register[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = _slicedToArray(_ref3, 2);

                    var timerId = _ref4[0];
                    var timer = _ref4[1];

                    clearTimeout(timer.timerId);
                    this.register.delete(timer.timerId);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }]);

    return TimeoutRegistry;
}(EventEmitter);

exports.TimeoutRegistry = TimeoutRegistry;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var TimerRegistry = function () {
    function TimerRegistry() {
        _classCallCheck(this, TimerRegistry);
    }

    _createClass(TimerRegistry, [{
        key: "add",
        value: function add(timeout) {
            return setTimeout(timeout.callback.bind(timeout.context, timeout.data), timeout.duration);
        }
    }, {
        key: "remove",
        value: function remove(timerId) {
            clearTimeout(timerId);
            return true;
        }
    }, {
        key: "requestIdleCallback",
        value: function requestIdleCallback(callback) {
            process.nextTick(callback);
        }
    }]);

    return TimerRegistry;
}();

exports.TimerRegistry = TimerRegistry;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../../node_modules/process/browser.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var message_parser_1 = __webpack_require__(5);
var state_machine_1 = __webpack_require__(8);
var utils = __webpack_require__(3);
var Emitter = __webpack_require__(2);

var Connection = function () {
    function Connection(services, options, url, emitter) {
        var _this = this;

        _classCallCheck(this, Connection);

        this.options = options;
        this.services = services;
        this.authParams = null;
        this.handlers = new Map();
        this.isConnected = false;
        // tslint:disable-next-line:no-empty
        this.authCallback = function () {};
        this.emitter = emitter;
        this.internalEmitter = new Emitter();
        var isReconnecting = false;
        var firstOpen = true;
        this.stateMachine = new state_machine_1.StateMachine(this.services.logger, {
            init: constants_1.CONNECTION_STATE.CLOSED,
            onStateChanged: function onStateChanged(newState, oldState) {
                if (newState === oldState) {
                    return;
                }
                _this.isConnected = newState === constants_1.CONNECTION_STATE.OPEN;
                emitter.emit(constants_1.EVENT.CONNECTION_STATE_CHANGED, newState);
                if (newState === constants_1.CONNECTION_STATE.RECONNECTING) {
                    isReconnecting = true;
                    if (oldState !== constants_1.CONNECTION_STATE.RECONNECTING) {
                        _this.internalEmitter.emit(constants_1.EVENT.CONNECTION_LOST);
                    }
                } else if (newState === constants_1.CONNECTION_STATE.OPEN && (isReconnecting || firstOpen)) {
                    firstOpen = false;
                    _this.internalEmitter.emit(constants_1.EVENT.CONNECTION_REESTABLISHED);
                }
            },
            transitions: [{ name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.CLOSED, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.REDIRECTING, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.RECONNECTING, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "challenge" /* CHALLENGE */, from: constants_1.CONNECTION_STATE.AWAITING_CONNECTION, to: constants_1.CONNECTION_STATE.CHALLENGING }, { name: "redirected" /* CONNECTION_REDIRECTED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.REDIRECTING }, { name: "challenge-denied" /* CHALLENGE_DENIED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.CHALLENGE_DENIED }, { name: "accepted" /* CHALLENGE_ACCEPTED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, handler: this.onAwaitingAuthentication.bind(this) }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_CONNECTION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "authenticate" /* AUTHENTICATE */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATING }, { name: "unsuccesful-login" /* UNSUCCESFUL_LOGIN */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION }, { name: "succesful-login" /* SUCCESFUL_LOGIN */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.OPEN }, { name: "too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS }, { name: "too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "reconnect" /* RECONNECT */, from: constants_1.CONNECTION_STATE.RECONNECTING, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "closed" /* CLOSED */, from: constants_1.CONNECTION_STATE.CLOSING, to: constants_1.CONNECTION_STATE.CLOSED }, { name: "error" /* ERROR */, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "connection-lost" /* LOST */, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "close" /* CLOSE */, to: constants_1.CONNECTION_STATE.CLOSING }]
        });
        this.originalUrl = utils.parseUrl(url, this.options.path);
        this.url = this.originalUrl;
        this.createEndpoint();
    }

    _createClass(Connection, [{
        key: "onLost",
        value: function onLost(callback) {
            this.internalEmitter.on(constants_1.EVENT.CONNECTION_LOST, callback);
        }
    }, {
        key: "onReestablished",
        value: function onReestablished(callback) {
            this.internalEmitter.on(constants_1.EVENT.CONNECTION_REESTABLISHED, callback);
        }
    }, {
        key: "registerHandler",
        value: function registerHandler(topic, callback) {
            this.handlers.set(topic, callback);
        }
    }, {
        key: "sendMessage",
        value: function sendMessage(message) {
            this.endpoint.sendParsedMessage(message);
        }
        /**
         * Sends the specified authentication parameters
         * to the server. Can be called up to <maxAuthAttempts>
         * times for the same connection.
         *
         * @param   {Object}   authParams A map of user defined auth parameters.
         *                E.g. { username:<String>, password:<String> }
         * @param   {Function} callback   A callback that will be invoked with the authenticationr result
         */

    }, {
        key: "authenticate",
        value: function authenticate(authParams, callback) {
            if ((typeof authParams === "undefined" ? "undefined" : _typeof(authParams)) !== 'object') {
                throw new Error('invalid argument authParams');
            }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.CHALLENGE_DENIED || this.stateMachine.state === constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS || this.stateMachine.state === constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT) {
                this.services.logger.error({ topic: message_constants_1.TOPIC.CONNECTION }, constants_1.EVENT.IS_CLOSED);
                return;
            }
            if (authParams) {
                this.authParams = authParams;
            }
            if (callback) {
                this.authCallback = callback;
            }
            // if (this.stateMachine.state === CONNECTION_STATE.CLOSED && !this.endpoint) {
            //   this.createEndpoint()
            //   return
            // }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION && this.authParams) {
                this.sendAuthParams();
            }
        }
        /*
        * Returns the current connection state.
        */

    }, {
        key: "getConnectionState",
        value: function getConnectionState() {
            return this.stateMachine.state;
        }
        /**
         * Closes the connection. Using this method
         * will prevent the client from reconnecting.
         */

    }, {
        key: "close",
        value: function close() {
            this.services.timerRegistry.remove(this.heartbeatInterval);
            this.sendMessage({
                topic: message_constants_1.TOPIC.CONNECTION,
                action: message_constants_1.CONNECTION_ACTIONS.CLOSING
            });
            this.stateMachine.transition("close" /* CLOSE */);
        }
        /**
         * Creates the endpoint to connect to using the url deepstream
         * was initialised with.
         */

    }, {
        key: "createEndpoint",
        value: function createEndpoint() {
            this.endpoint = this.services.socketFactory(this.url, this.options.socketOptions);
            this.endpoint.onopen = this.onOpen.bind(this);
            this.endpoint.onerror = this.onError.bind(this);
            this.endpoint.onclose = this.onClose.bind(this);
            this.endpoint.onparsedmessages = this.onMessages.bind(this);
        }
        /********************************
        ****** Endpoint Callbacks ******
        /********************************/
        /**
        * Will be invoked once the connection is established. The client
        * can't send messages yet, and needs to get a connection ACK or REDIRECT
        * from the server before authenticating
        */

    }, {
        key: "onOpen",
        value: function onOpen() {
            this.clearReconnect();
            this.lastHeartBeat = Date.now();
            this.checkHeartBeat();
            this.stateMachine.transition("connected" /* CONNECTED */);
        }
        /**
         * Callback for generic connection errors. Forwards
         * the error to the client.
         *
         * The connection is considered broken once this method has been
         * invoked.
         */

    }, {
        key: "onError",
        value: function onError(error) {
            var _this2 = this;

            /*
             * If the implementation isn't listening on the error event this will throw
             * an error. So let's defer it to allow the reconnection to kick in.
             */
            setTimeout(function () {
                var msg = void 0;
                if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                    msg = "Can't connect! Deepstream server unreachable on " + _this2.originalUrl;
                } else {
                    try {
                        msg = JSON.stringify(error);
                    } catch (e) {
                        msg = error.toString();
                    }
                }
                _this2.services.logger.error({ topic: message_constants_1.TOPIC.CONNECTION }, constants_1.EVENT.CONNECTION_ERROR, msg);
            }, 1);
            this.services.timerRegistry.remove(this.heartbeatInterval);
            this.stateMachine.transition("error" /* ERROR */);
            this.tryReconnect();
        }
        /**
         * Callback when the connection closes. This might have been a deliberate
         * close triggered by the client or the result of the connection getting
         * lost.
         *
         * In the latter case the client will try to reconnect using the configured
         * strategy.
         */

    }, {
        key: "onClose",
        value: function onClose() {
            this.services.timerRegistry.remove(this.heartbeatInterval);
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.REDIRECTING) {
                this.createEndpoint();
                return;
            }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.CHALLENGE_DENIED || this.stateMachine.state === constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS || this.stateMachine.state === constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT) {
                return;
            }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.CLOSING) {
                this.stateMachine.transition("closed" /* CLOSED */);
                return;
            }
            this.stateMachine.transition("connection-lost" /* LOST */);
            this.tryReconnect();
        }
        /**
         * Callback for messages received on the connection.
         */

    }, {
        key: "onMessages",
        value: function onMessages(parseResults) {
            var _this3 = this;

            parseResults.forEach(function (parseResult) {
                if (parseResult.parseError) {
                    _this3.services.logger.error({ topic: message_constants_1.TOPIC.PARSER }, parseResult.action, parseResult.raw && parseResult.raw.toString());
                    return;
                }
                var message = parseResult;
                var res = message_parser_1.parseData(message);
                if (res !== true) {
                    _this3.services.logger.error({ topic: message_constants_1.TOPIC.PARSER }, message_constants_1.PARSER_ACTIONS.INVALID_MESSAGE, res);
                }
                if (message === null) {
                    return;
                }
                if (message.topic === message_constants_1.TOPIC.CONNECTION) {
                    _this3.handleConnectionResponse(message);
                    return;
                }
                if (message.topic === message_constants_1.TOPIC.AUTH) {
                    _this3.handleAuthResponse(message);
                    return;
                }
                var handler = _this3.handlers.get(message.topic);
                if (!handler) {
                    // this should never happen
                    return;
                }
                handler(message);
            });
        }
        /**
        * Sends authentication params to the server. Please note, this
        * doesn't use the queued message mechanism, but rather sends the message directly
        */

    }, {
        key: "sendAuthParams",
        value: function sendAuthParams() {
            this.stateMachine.transition("authenticate" /* AUTHENTICATE */);
            this.sendMessage({
                topic: message_constants_1.TOPIC.AUTH,
                action: message_constants_1.AUTH_ACTIONS.REQUEST,
                parsedData: this.authParams
            });
        }
        /**
        * Ensures that a heartbeat was not missed more than once, otherwise it considers the connection
        * to have been lost and closes it for reconnection.
        */

    }, {
        key: "checkHeartBeat",
        value: function checkHeartBeat() {
            var heartBeatTolerance = this.options.heartbeatInterval * 2;
            if (Date.now() - this.lastHeartBeat > heartBeatTolerance) {
                this.services.timerRegistry.remove(this.heartbeatInterval);
                this.services.logger.error({ topic: message_constants_1.TOPIC.CONNECTION }, constants_1.EVENT.HEARTBEAT_TIMEOUT);
                this.endpoint.close();
                return;
            }
            this.heartbeatInterval = this.services.timerRegistry.add({
                duration: this.options.heartbeatInterval,
                callback: this.checkHeartBeat,
                context: this
            });
        }
        /**
        * If the connection drops or is closed in error this
        * method schedules increasing reconnection intervals
        *
        * If the number of failed reconnection attempts exceeds
        * options.maxReconnectAttempts the connection is closed
        */

    }, {
        key: "tryReconnect",
        value: function tryReconnect() {
            if (this.reconnectTimeout !== null) {
                return;
            }
            if (this.reconnectionAttempt < this.options.maxReconnectAttempts) {
                this.stateMachine.transition("reconnect" /* RECONNECT */);
                this.reconnectTimeout = setTimeout(this.tryOpen.bind(this), Math.min(this.options.maxReconnectInterval, this.options.reconnectIntervalIncrement * this.reconnectionAttempt));
                this.reconnectionAttempt++;
                return;
            }
            this.emitter.emit(constants_1.EVENT[constants_1.EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED], this.reconnectionAttempt);
            this.clearReconnect();
            this.close();
        }
        /**
         * Attempts to open a errourosly closed connection
         */

    }, {
        key: "tryOpen",
        value: function tryOpen() {
            if (this.stateMachine.state !== constants_1.CONNECTION_STATE.REDIRECTING) {
                this.url = this.originalUrl;
            }
            this.createEndpoint();
            this.reconnectTimeout = null;
        }
        /**
         * Stops all further reconnection attempts,
         * either because the connection is open again
         * or because the maximal number of reconnection
         * attempts has been exceeded
         */

    }, {
        key: "clearReconnect",
        value: function clearReconnect() {
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
            this.reconnectTimeout = null;
            this.reconnectionAttempt = 0;
        }
        /**
         * The connection response will indicate whether the deepstream connection
         * can be used or if it should be forwarded to another instance. This
         * allows us to introduce load-balancing if needed.
         *
         * If authentication parameters are already provided this will kick of
         * authentication immediately. The actual 'open' event won't be emitted
         * by the client until the authentication is successful.
         *
         * If a challenge is recieved, the user will send the url to the server
         * in response to get the appropriate redirect. If the URL is invalid the
         * server will respond with a REJECTION resulting in the client connection
         * being permanently closed.
         *
         * If a redirect is recieved, this connection is closed and updated with
         * a connection to the url supplied in the message.
         */

    }, {
        key: "handleConnectionResponse",
        value: function handleConnectionResponse(message) {
            if (message.action === message_constants_1.CONNECTION_ACTIONS.PING) {
                this.lastHeartBeat = Date.now();
                this.sendMessage({ topic: message_constants_1.TOPIC.CONNECTION, action: message_constants_1.CONNECTION_ACTIONS.PONG });
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.ACCEPT) {
                this.stateMachine.transition("accepted" /* CHALLENGE_ACCEPTED */);
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.CHALLENGE) {
                this.stateMachine.transition("challenge" /* CHALLENGE */);
                this.sendMessage({
                    topic: message_constants_1.TOPIC.CONNECTION,
                    action: message_constants_1.CONNECTION_ACTIONS.CHALLENGE_RESPONSE,
                    url: this.originalUrl
                });
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.REJECT) {
                this.stateMachine.transition("challenge-denied" /* CHALLENGE_DENIED */);
                this.endpoint.close();
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.REDIRECT) {
                this.url = message.url;
                this.stateMachine.transition("redirected" /* CONNECTION_REDIRECTED */);
                this.endpoint.close();
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.AUTHENTICATION_TIMEOUT) {
                this.deliberateClose = true;
                this.stateMachine.transition("authentication-timeout" /* AUTHENTICATION_TIMEOUT */);
                this.services.logger.error(message);
            }
        }
        /**
         * Callback for messages received for the AUTH topic. If
         * the authentication was successful this method will
         * open the connection and send all messages that the client
         * tried to send so far.
         */

    }, {
        key: "handleAuthResponse",
        value: function handleAuthResponse(message) {
            if (message.action === message_constants_1.AUTH_ACTIONS.TOO_MANY_AUTH_ATTEMPTS) {
                this.deliberateClose = true;
                this.stateMachine.transition("too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */);
                this.services.logger.error(message);
                return;
            }
            if (message.action === message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL) {
                this.stateMachine.transition("unsuccesful-login" /* UNSUCCESFUL_LOGIN */);
                this.authCallback(false, { reason: constants_1.EVENT[constants_1.EVENT.INVALID_AUTHENTICATION_DETAILS] });
                return;
            }
            if (message.action === message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL) {
                this.stateMachine.transition("succesful-login" /* SUCCESFUL_LOGIN */);
                this.authCallback(true, message.parsedData || null);
                return;
            }
        }
    }, {
        key: "onAwaitingAuthentication",
        value: function onAwaitingAuthentication() {
            if (this.authParams) {
                this.sendAuthParams();
            }
        }
    }]);

    return Connection;
}();

exports.Connection = Connection;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(18);
var util = __webpack_require__(21);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(22);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), __webpack_require__(20)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(23);
exports.encode = exports.stringify = __webpack_require__(24);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var message_parser_1 = __webpack_require__(5);
var message_builder_1 = __webpack_require__(26);
var message_constants_1 = __webpack_require__(0);
var NodeWebSocket = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ws\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
exports.socketFactory = function (url, options) {
    var socket = new NodeWebSocket(url, options);
    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = function () {};
    socket.onmessage = function (raw) {
        var parseResults = message_parser_1.parse(raw.data);
        parseResults.forEach(function (element) {
            var msg = element;
            console.log('<<<', message_constants_1.TOPIC[msg.topic], message_constants_1.ACTIONS[msg.topic][msg.action], msg.parsedData, msg.data, msg.name);
        });
        socket.onparsedmessages(parseResults);
    };
    socket.sendParsedMessage = function (message) {
        if (message.topic === message_constants_1.TOPIC.CONNECTION && message.action === message_constants_1.CONNECTION_ACTIONS.CLOSING) {
            socket.onparsedmessages([{ topic: message_constants_1.TOPIC.CONNECTION, action: message_constants_1.CONNECTION_ACTIONS.CLOSED }]);
            socket.close();
            return;
        }
        message.data = JSON.stringify(message.parsedData);
        console.log('>>>', message_constants_1.TOPIC[message.topic], message_constants_1.ACTIONS[message.topic][message.action], message.parsedData, message.reason, message.name);
        socket.send(message_builder_1.getMessage(message, false));
    };
    return socket;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
/**
 * Functions for handling (de)serialization of the deepstream binary realtime protocol.
 *
 * In brief, a message is a variable length binary blob with the following structure:
 *
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-------------+-+-------------+-------------------------------+
 * |F|  Message    |A|  Message    |             Meta              |
 * |I|   Topic     |C|  Action     |            Length             |
 * |N|    (7)      |K|   (7)       |             (24)              |
 * +-+-------------+-+-------------+-------------------------------+
 * | Meta Cont.    |              Payload Length (24)              |
 * +---------------+-----------------------------------------------+
 * :                     Meta Data (Meta Length * 8)               :
 * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 * |                  Payload Data (Payload Length * 8)            :
 * +---------------------------------------------------------------+
 *
 * The first 6 bytes of the message are the header, and the rest of the message is the payload.
 *
 * CONT (1 bit): The continuation bit. If this is set, the following payload of the following
 *                message must be appended to this one. If this is not set, parsing may finish
 *                after the payload is read.
 * RSV{0..3} (1 bit): Reserved for extension.
 * Meta Length (24 bits, unsigned big-endian): The total length of Meta Data in bytes.
 *                If Meta Data can be no longer than 16 MB.
 * Payload Length (24 bits, unsigned big-endian): The total length of Payload in bytes.
 *                If Payload is longer than 16 MB, it must be split into chunks of
 *                less than 2^24 bytes with identical topic and action, setting the CONT bit
 *                in all but the final chunk.
 *
 */
/* tslint:disable:no-bitwise */

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(6);
var message_validator_1 = __webpack_require__(7);
function getMessage(msg, isAck) {
    var message = msg;
    var action = message.action;
    var error = message_validator_1.validate(message);
    if (error) {
        console.error("invalid message " + message_constants_1.TOPIC[message.topic] + " " + message.action + ": " + error);
    }
    // convert action to write ack if necessary
    if (message.isWriteAck && !constants_1.isWriteAck(message.action)) {
        action = constants_1.actionToWriteAck[message.action];
    }
    if (message.isAck || isAck) {
        action |= 0x80;
    }
    var meta = Object.create(null);
    for (var key in message_constants_1.META_KEYS) {
        meta[message_constants_1.META_KEYS[key]] = message[key];
    }
    if (meta[message_constants_1.META_KEYS.payloadEncoding] === message_constants_1.PAYLOAD_ENCODING.JSON) {
        delete meta[message_constants_1.META_KEYS.payloadEncoding];
    }
    var metaStr = JSON.stringify(meta);
    var metaBuff = metaStr === '{}' ? null : Buffer.from(JSON.stringify(meta), 'utf8');
    var payloadBuff = void 0;
    if (message.data instanceof Buffer) {
        payloadBuff = message.data;
    } else if (message.data !== undefined || message.parsedData !== undefined) {
        var payloadStr = message.data;
        if (payloadStr === undefined) {
            payloadStr = JSON.stringify(message.parsedData);
        }
        payloadBuff = Buffer.from(payloadStr, 'utf8');
    } else {
        payloadBuff = null;
    }
    if (payloadBuff && !message_validator_1.hasPayload(message.topic, action)) {
        console.error("invalid message " + message_constants_1.TOPIC[message.topic] + " " + message.action + ": should not have payload");
    }
    var metaBuffLength = metaBuff ? metaBuff.length : 0;
    var payloadBuffLength = payloadBuff ? payloadBuff.length : 0;
    if (metaBuffLength <= constants_1.META_PAYLOAD_OVERFLOW_LENGTH && payloadBuffLength <= constants_1.META_PAYLOAD_OVERFLOW_LENGTH) {
        return buildRaw(true, message.topic, action, metaBuff, payloadBuff);
    } else {
        return buildMultipart(message.topic, action, metaBuff, payloadBuff);
    }
}
exports.getMessage = getMessage;
function buildMultipart(topic, action, meta, payload) {
    var metaLength = meta ? meta.length : 0;
    var payloadLength = payload ? payload.length : 0;
    var messageParts = [];
    var metaSectionOffset = 0;
    var payloadSectionOffset = 0;
    var fin = void 0;
    do {
        var metaSectionLength = Math.min(metaLength - metaSectionOffset, constants_1.META_PAYLOAD_OVERFLOW_LENGTH);
        var payloadSectionLength = Math.min(payloadLength - payloadSectionOffset, constants_1.META_PAYLOAD_OVERFLOW_LENGTH);
        var metaSection = meta && meta.slice(metaSectionOffset, metaSectionOffset + metaSectionLength);
        var payloadSection = payload && payload.slice(payloadSectionOffset, payloadSectionOffset + payloadSectionLength);
        metaSectionOffset += metaSectionLength;
        payloadSectionOffset += payloadSectionLength;
        fin = metaSectionOffset === metaLength && payloadSectionOffset === payloadLength;
        messageParts.push(buildRaw(fin, topic, action, metaSection, payloadSection));
    } while (!fin);
    return Buffer.concat(messageParts);
}
function buildRaw(fin, topic, action, meta, payload) {
    var metaLength = meta ? meta.length : 0;
    var payloadLength = payload ? payload.length : 0;
    var messageBufferLength = constants_1.HEADER_LENGTH + metaLength + payloadLength;
    var messageBuffer = Buffer.allocUnsafe(messageBufferLength);
    messageBuffer[0] = (fin ? 0x80 : 0x00) | topic;
    messageBuffer[1] = action;
    messageBuffer.writeUIntBE(metaLength, 2, 3);
    messageBuffer.writeUIntBE(payloadLength, 5, 3);
    if (meta) {
        meta.copy(messageBuffer, constants_1.HEADER_LENGTH);
    }
    if (payload) {
        payload.copy(messageBuffer, constants_1.HEADER_LENGTH + metaLength);
    }
    return messageBuffer;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../../node_modules/node-libs-browser/node_modules/buffer/index.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Buffer))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var listener_1 = __webpack_require__(9);
var Emitter = __webpack_require__(2);

var EventHandler = function () {
    function EventHandler(services, options, listeners) {
        _classCallCheck(this, EventHandler);

        this.options = options;
        this.services = services;
        this.listeners = listeners || new listener_1.Listener(message_constants_1.TOPIC.EVENT, services);
        this.emitter = new Emitter();
        this.services.connection.registerHandler(message_constants_1.TOPIC.EVENT, this.handle.bind(this));
        this.services.connection.onReestablished(this.resubscribe.bind(this));
    }
    /**
    * Subscribe to an event. This will receive both locally emitted events
    * as well as events emitted by other connected clients.
    */


    _createClass(EventHandler, [{
        key: "subscribe",
        value: function subscribe(name, callback) {
            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (!this.emitter.hasListeners(name)) {
                this.sendSubscriptionMessage(name);
            }
            this.emitter.on(name, callback);
        }
        /**
         * Removes a callback for a specified event. If all callbacks
         * for an event have been removed, the server will be notified
         * that the client is unsubscribed as a listener
         */

    }, {
        key: "unsubscribe",
        value: function unsubscribe(name, callback) {
            if (!name || typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (callback !== undefined && typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (!this.emitter.hasListeners(name)) {
                this.services.logger.warn({
                    topic: message_constants_1.TOPIC.EVENT,
                    action: message_constants_1.EVENT_ACTIONS.NOT_SUBSCRIBED,
                    name: name
                });
                return;
            }
            this.emitter.off(name, callback);
            if (!this.emitter.hasListeners(name)) {
                var message = {
                    topic: message_constants_1.TOPIC.EVENT,
                    action: message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE,
                    name: name
                };
                this.services.timeoutRegistry.add({ message: message });
                this.services.connection.sendMessage(message);
            }
        }
        /**
         * Emits an event locally and sends a message to the server to
         * broadcast the event to the other connected clients
         */

    }, {
        key: "emit",
        value: function emit(name, data) {
            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (this.services.connection.isConnected) {
                this.services.connection.sendMessage({
                    topic: message_constants_1.TOPIC.EVENT,
                    action: message_constants_1.EVENT_ACTIONS.EMIT,
                    name: name,
                    parsedData: data
                });
            }
            this.emitter.emit(name, data);
        }
        /**
        * Allows to listen for event subscriptions made by this or other clients. This
        * is useful to create "active" data providers, e.g. providers that only provide
        * data for a particular event if a user is actually interested in it
        */

    }, {
        key: "listen",
        value: function listen(pattern, callback) {
            this.listeners.listen(pattern, callback);
        }
        /**
         * Removes a listener that was previously registered
         */

    }, {
        key: "unlisten",
        value: function unlisten(pattern) {
            this.listeners.unlisten(pattern);
        }
        /**
        * Handles incoming messages from the server
        */

    }, {
        key: "handle",
        value: function handle(message) {
            if (message.isAck) {
                this.services.timeoutRegistry.remove(message);
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.EMIT) {
                if (message.parsedData !== undefined) {
                    this.emitter.emit(message.name, message.parsedData);
                } else {
                    this.emitter.emit(message.name, undefined);
                }
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED) {
                this.services.logger.error({ topic: message_constants_1.TOPIC.EVENT }, message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED);
                this.services.timeoutRegistry.remove(message);
                if (message.originalAction === message_constants_1.EVENT_ACTIONS.SUBSCRIBE) {
                    this.emitter.off(message.name);
                }
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.NOT_SUBSCRIBED || message.action === message_constants_1.EVENT_ACTIONS.MULTIPLE_SUBSCRIPTIONS) {
                this.services.timeoutRegistry.remove(message);
                this.services.logger.warn(message);
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND || message.action === message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
                this.listeners.handle(message);
                return;
            }
            this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
        }
        /**
         * Resubscribes to events when connection is lost
         */

    }, {
        key: "resubscribe",
        value: function resubscribe() {
            var callbacks = this.emitter.eventNames();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var name = _step.value;

                    this.sendSubscriptionMessage(name);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "sendSubscriptionMessage",
        value: function sendSubscriptionMessage(name) {
            var message = {
                topic: message_constants_1.TOPIC.EVENT,
                action: message_constants_1.EVENT_ACTIONS.SUBSCRIBE,
                name: name
            };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }]);

    return EventHandler;
}();

exports.EventHandler = EventHandler;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var rpc_1 = __webpack_require__(29);
var rpc_response_1 = __webpack_require__(30);
var utils_1 = __webpack_require__(3);

var RPCHandler = function () {
    function RPCHandler(services, options) {
        _classCallCheck(this, RPCHandler);

        this.services = services;
        this.options = options;
        this.rpcs = new Map();
        this.providers = new Map();
        this.services.connection.registerHandler(message_constants_1.TOPIC.RPC, this.handle.bind(this));
        this.services.connection.onReestablished(this.reprovide.bind(this));
    }
    /**
     * Registers a callback function as a RPC provider. If another connected client calls
     * client.rpc.make() the request will be routed to this method
     *
     * The callback will be invoked with two arguments:
     *     {Mixed} data The data passed to the client.rpc.make function
     *     {RpcResponse} rpcResponse An object with methods to response,
     *                               acknowledge or reject the request
     *
     * Only one callback can be registered for a RPC at a time
     *
     * Please note: Deepstream tries to deliver data in its original format.
     * Data passed to client.rpc.make as a String will arrive as a String,
     * numbers or implicitly JSON serialized objects will arrive in their
     * respective format as well
     */


    _createClass(RPCHandler, [{
        key: "provide",
        value: function provide(name, callback) {
            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (this.providers.has(name)) {
                throw new Error("RPC " + name + " already registered");
            }
            if (typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            this.providers.set(name, callback);
            if (this.services.connection.isConnected) {
                this.sendProvide(name);
            }
        }
        /**
         * Unregisters this client as a provider for a remote procedure call
         */

    }, {
        key: "unprovide",
        value: function unprovide(name) {
            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (!this.providers.has(name)) {
                this.services.logger.warn({
                    topic: message_constants_1.TOPIC.RPC,
                    action: message_constants_1.RPC_ACTIONS.NOT_PROVIDED,
                    name: name
                });
                return;
            }
            this.providers.delete(name);
            if (this.services.connection.isConnected) {
                var message = { topic: message_constants_1.TOPIC.RPC, action: message_constants_1.RPC_ACTIONS.UNPROVIDE, name: name };
                this.services.timeoutRegistry.add({ message: message });
                this.services.connection.sendMessage(message);
                return;
            }
        }
    }, {
        key: "make",
        value: function make(name, data, callback) {
            var _this = this;

            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument name');
            }
            if (callback && typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (this.services.connection.isConnected === false) {
                if (callback) {
                    this.services.timerRegistry.requestIdleCallback(callback.bind(this, constants_1.EVENT.CLIENT_OFFLINE));
                    return;
                }
                return Promise.reject(constants_1.EVENT.CLIENT_OFFLINE);
            }
            var correlationId = utils_1.getUid();
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.REQUEST,
                correlationId: correlationId,
                name: name,
                parsedData: data
            });
            if (callback) {
                this.rpcs.set(correlationId, new rpc_1.RPC(name, correlationId, callback, this.options, this.services));
                return;
            }
            return new Promise(function (resolve, reject) {
                _this.rpcs.set(correlationId, new rpc_1.RPC(name, correlationId, function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }, _this.options, _this.services));
            });
        }
        /**
         * Handles incoming rpc REQUEST messages. Instantiates a new response object
         * and invokes the provider callback or rejects the request if no rpc provider
         * is present (which shouldn't really happen, but might be the result of a race condition
         * if this client sends a unprovide message whilst an incoming request is already in flight)
         */

    }, {
        key: "respondToRpc",
        value: function respondToRpc(message) {
            var provider = this.providers.get(message.name);
            if (provider) {
                provider(message.parsedData, new rpc_response_1.RPCResponse(message, this.options, this.services));
            } else {
                this.services.connection.sendMessage({
                    topic: message_constants_1.TOPIC.RPC,
                    action: message_constants_1.RPC_ACTIONS.REJECT,
                    name: message.name,
                    correlationId: message.correlationId
                });
            }
        }
        /**
         * Distributes incoming messages from the server
         * based on their action
         */

    }, {
        key: "handle",
        value: function handle(message) {
            // RPC Requests
            if (message.action === message_constants_1.RPC_ACTIONS.REQUEST) {
                this.respondToRpc(message);
                return;
            }
            // RPC subscription Acks
            if (message.isAck) {
                this.services.timeoutRegistry.remove(message);
                return;
            }
            // handle auth/denied subscription errors
            if (message.action === message_constants_1.RPC_ACTIONS.MESSAGE_PERMISSION_ERROR || message.action === message_constants_1.RPC_ACTIONS.MESSAGE_DENIED) {
                if (message.originalAction === message_constants_1.RPC_ACTIONS.PROVIDE || message.originalAction === message_constants_1.RPC_ACTIONS.UNPROVIDE) {
                    this.services.timeoutRegistry.remove(message);
                    this.providers.delete(message.name);
                    this.services.logger.error(message);
                    return;
                }
                if (message.originalAction === message_constants_1.RPC_ACTIONS.REQUEST) {
                    var invalidRPC = this.getRPC(message);
                    if (invalidRPC) {
                        invalidRPC.error(message_constants_1.RPC_ACTIONS[message.action]);
                        this.rpcs.delete(message.correlationId);
                        return;
                    }
                }
            }
            // RPC Responses
            var rpc = this.getRPC(message);
            if (rpc) {
                if (message.action === message_constants_1.RPC_ACTIONS.ACCEPT) {
                    rpc.accept();
                    return;
                }
                if (message.action === message_constants_1.RPC_ACTIONS.RESPONSE) {
                    rpc.respond(message.parsedData);
                } else if (message.action === message_constants_1.RPC_ACTIONS.REQUEST_ERROR) {
                    rpc.error(message.parsedData);
                } else if (message.action === message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT || message.action === message_constants_1.RPC_ACTIONS.NO_RPC_PROVIDER) {
                    rpc.error(message_constants_1.RPC_ACTIONS[message.action]);
                }
                this.rpcs.delete(message.correlationId);
            }
        }
    }, {
        key: "getRPC",
        value: function getRPC(message) {
            var rpc = this.rpcs.get(message.correlationId);
            if (rpc === undefined) {
                this.services.logger.error(message, constants_1.EVENT.UNKNOWN_CORRELATION_ID);
            }
            return rpc;
        }
    }, {
        key: "reprovide",
        value: function reprovide() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var name = _ref2[0];
                    var callback = _ref2[1];

                    this.sendProvide(name);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "sendProvide",
        value: function sendProvide(name) {
            var message = {
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.PROVIDE,
                name: name
            };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }]);

    return RPCHandler;
}();

exports.RPCHandler = RPCHandler;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */

var RPC = function () {
    function RPC(name, correlationId, response, options, services) {
        _classCallCheck(this, RPC);

        this.options = options;
        this.services = services;
        this.name = name;
        this.response = response;
        this.acceptTimeout = this.services.timeoutRegistry.add({
            message: {
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.ACCEPT,
                name: name,
                correlationId: correlationId
            },
            event: message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT,
            duration: this.options.rpcAcceptTimeout,
            callback: this.onTimeout.bind(this)
        });
        this.responseTimeout = this.services.timeoutRegistry.add({
            message: {
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.REQUEST,
                name: name,
                correlationId: correlationId
            },
            event: message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT,
            duration: this.options.rpcResponseTimeout,
            callback: this.onTimeout.bind(this)
        });
    }
    /**
     * Called once an ack message is received from the server
     */


    _createClass(RPC, [{
        key: "accept",
        value: function accept() {
            this.services.timeoutRegistry.clear(this.acceptTimeout);
        }
        /**
         * Called once a response message is received from the server.
         */

    }, {
        key: "respond",
        value: function respond(data) {
            this.response(null, data);
            this.complete();
        }
        /**
         * Called once an error is received from the server.
         */

    }, {
        key: "error",
        value: function error(data) {
            this.response(data);
            this.complete();
        }
        /**
         * Callback for error messages received from the server. Once
         * an error is received the request is considered completed. Even
         * if a response arrives later on it will be ignored / cause an
         * UNSOLICITED_MESSAGE error
         */

    }, {
        key: "onTimeout",
        value: function onTimeout(event, message) {
            this.response(message_constants_1.RPC_ACTIONS[event]);
            this.complete();
        }
        /**
         * Called after either an error or a response
         * was received
        */

    }, {
        key: "complete",
        value: function complete() {
            this.services.timeoutRegistry.clear(this.acceptTimeout);
            this.services.timeoutRegistry.clear(this.responseTimeout);
        }
    }]);

    return RPC;
}();

exports.RPC = RPC;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */

var RPCResponse = function () {
    function RPCResponse(message, options, services) {
        _classCallCheck(this, RPCResponse);

        this.name = message.name;
        this.correlationId = message.correlationId;
        this.options = options;
        this.services = services;
        this.isAccepted = false;
        this.isComplete = false;
        this.autoAccept = true;
        this.services.timerRegistry.requestIdleCallback(this.performAutoAck.bind(this));
    }
    /**
     * Acknowledges the receipt of the request. This
     * will happen implicitly unless the request callback
     * explicitly sets autoAck to false
     */


    _createClass(RPCResponse, [{
        key: "accept",
        value: function accept() {
            if (this.isAccepted === false) {
                this.services.connection.sendMessage({
                    topic: message_constants_1.TOPIC.RPC,
                    action: message_constants_1.RPC_ACTIONS.ACCEPT,
                    name: this.name,
                    correlationId: this.correlationId
                });
                this.isAccepted = true;
            }
        }
        /**
         * Reject the request. This might be necessary if the client
         * is already processing a large number of requests. If deepstream
         * receives a rejection message it will try to route the request to
         * another provider - or return a NO_RPC_PROVIDER error if there are no
         * providers left
         */

    }, {
        key: "reject",
        value: function reject() {
            if (this.isComplete === true) {
                throw new Error("Rpc " + this.name + " already completed");
            }
            this.autoAccept = false;
            this.isComplete = true;
            this.isAccepted = true;
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.REJECT,
                name: this.name,
                correlationId: this.correlationId
            });
        }
        /**
         * Notifies the server that an error has occured while trying to process the request.
         * This will complete the rpc.
         */

    }, {
        key: "error",
        value: function error(_error) {
            if (this.isComplete === true) {
                throw new Error("Rpc " + this.name + " already completed");
            }
            this.autoAccept = false;
            this.isComplete = true;
            this.isAccepted = true;
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.REQUEST_ERROR,
                name: this.name,
                correlationId: this.correlationId,
                parsedData: _error
            });
        }
        /**
         * Completes the request by sending the response data
         * to the server. If data is an array or object it will
         * automatically be serialised.
         * If autoAck is disabled and the response is sent before
         * the ack message the request will still be completed and the
         * ack message ignored
         */

    }, {
        key: "send",
        value: function send(data) {
            if (this.isComplete === true) {
                throw new Error("Rpc " + this.name + " already completed");
            }
            this.accept();
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.RESPONSE,
                name: this.name,
                correlationId: this.correlationId,
                parsedData: data
            });
            this.isComplete = true;
        }
        /**
         * Callback for the autoAck timeout. Executes ack
         * if autoAck is not disabled
         */

    }, {
        key: "performAutoAck",
        value: function performAutoAck() {
            if (this.autoAccept === true) {
                this.accept();
            }
        }
    }]);

    return RPCResponse;
}();

exports.RPCResponse = RPCResponse;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(3);
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var record_core_1 = __webpack_require__(32);
var record_1 = __webpack_require__(34);
var anonymous_record_1 = __webpack_require__(35);
var list_1 = __webpack_require__(36);
var listener_1 = __webpack_require__(9);
var single_notifier_1 = __webpack_require__(37);
var Emitter = __webpack_require__(2);

var RecordHandler = function () {
    function RecordHandler(services, options, listener) {
        _classCallCheck(this, RecordHandler);

        this.services = services;
        this.options = options;
        this.emitter = new Emitter();
        this.listener = listener || new listener_1.Listener(message_constants_1.TOPIC.RECORD, this.services);
        this.recordCores = new Map();
        this.readRegistry = new single_notifier_1.SingleNotifier(services, message_constants_1.TOPIC.RECORD, message_constants_1.RECORD_ACTIONS.READ, options.recordReadTimeout);
        this.headRegistry = new single_notifier_1.SingleNotifier(services, message_constants_1.TOPIC.RECORD, message_constants_1.RECORD_ACTIONS.HEAD, options.recordReadTimeout);
        this.getRecordCore = this.getRecordCore.bind(this);
        this.services.connection.registerHandler(message_constants_1.TOPIC.RECORD, this.handle.bind(this));
    }
    /**
    * Returns an existing record or creates a new one.
    *
    * @param   {String} name              the unique name of the record
    */


    _createClass(RecordHandler, [{
        key: "getRecord",
        value: function getRecord(name) {
            return new record_1.Record(this.getRecordCore(name));
        }
        /**
         * Returns an existing List or creates a new one. A list is a specialised
         * type of record that holds an array of recordNames.
         *
         * @param   {String} name       the unique name of the list
         */

    }, {
        key: "getList",
        value: function getList(name) {
            return new list_1.List(this.getRecordCore(name));
        }
        /**
         * Returns an anonymous record. A anonymous record is effectively
         * a wrapper that mimicks the API of a record, but allows for the
         * underlying record to be swapped without loosing subscriptions etc.
         *
         * This is particularly useful when selecting from a number of similarly
         * structured records. E.g. a list of users that can be choosen from a list
         *
         * The only API difference to a normal record is an additional setName( name ) method.
         */

    }, {
        key: "getAnonymousRecord",
        value: function getAnonymousRecord() {
            return new anonymous_record_1.AnonymousRecord(this.getRecordCore);
        }
        /**
         * Allows to listen for record subscriptions made by this or other clients. This
         * is useful to create "active" data providers, e.g. providers that only provide
         * data for a particular record if a user is actually interested in it
         *
         * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
         * @param   {Function} callback
         */

    }, {
        key: "listen",
        value: function listen(pattern, callback) {
            this.listener.listen(pattern, callback);
        }
        /**
         * Removes a listener that was previously registered with listenForSubscriptions
         *
         * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
         */

    }, {
        key: "unlisten",
        value: function unlisten(pattern) {
            this.listener.unlisten(pattern);
        }
    }, {
        key: "snapshot",
        value: function snapshot(name, callback) {
            var _this = this;

            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument: name');
            }
            if (callback !== undefined && typeof callback !== 'function') {
                throw new Error('invalid argument: callback');
            }
            var recordCore = this.recordCores.get(name);
            if (recordCore && recordCore.isReady) {
                if (callback) {
                    callback(null, recordCore.get());
                    return;
                } else {
                    return Promise.resolve(recordCore.get());
                }
            }
            if (callback) {
                this.readRegistry.request(name, { callback: callback });
            } else {
                return new Promise(function (resolve, reject) {
                    _this.readRegistry.request(name, { resolve: resolve, reject: reject });
                });
            }
        }
    }, {
        key: "has",
        value: function has(name, callback) {
            var _this2 = this;

            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument: name');
            }
            if (callback !== undefined && typeof callback !== 'function') {
                throw new Error('invalid argument: callback');
            }
            if (!callback) {
                return new Promise(function (resolve, reject) {
                    _this2.head(name, function (error, version) {
                        if (error && error === message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.RECORD_NOT_FOUND]) {
                            resolve(false);
                        } else if (error) {
                            reject(error);
                        } else {
                            resolve(version !== -1);
                        }
                    });
                });
            }
            this.head(name, function (error, version) {
                if (error && error === message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.RECORD_NOT_FOUND]) {
                    callback(null, false);
                } else if (error) {
                    callback(error, null);
                } else {
                    callback(null, version !== -1);
                }
            });
        }
    }, {
        key: "head",
        value: function head(name, callback) {
            var _this3 = this;

            if (typeof name !== 'string' || name.length === 0) {
                throw new Error('invalid argument: name');
            }
            if (callback !== undefined && typeof callback !== 'function') {
                throw new Error('invalid argument: callback');
            }
            var recordCore = this.recordCores.get(name);
            if (recordCore && recordCore.isReady) {
                if (callback) {
                    callback(null, recordCore.version);
                    return;
                }
                return Promise.resolve(recordCore.version);
            }
            if (callback) {
                this.headRegistry.request(name, { callback: callback });
            } else {
                return new Promise(function (resolve, reject) {
                    _this3.headRegistry.request(name, { resolve: resolve, reject: reject });
                });
            }
        }
    }, {
        key: "setDataWithAck",
        value: function setDataWithAck(recordName) {
            var _this4 = this;

            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                rest[_key - 1] = arguments[_key];
            }

            var args = utils.normalizeSetArguments(arguments, 1);
            if (args.callback) {
                return new Promise(function (resolve, reject) {
                    args.callback = function (error) {
                        return error === null ? resolve() : reject(error);
                    };
                    _this4.setData(recordName, args);
                });
            }
            this.setData(recordName, args);
        }
    }, {
        key: "setData",
        value: function setData(recordName) {
            var _utils$normalizeSetAr = utils.normalizeSetArguments(arguments, 1),
                path = _utils$normalizeSetAr.path,
                data = _utils$normalizeSetAr.data,
                callback = _utils$normalizeSetAr.callback;

            if (!path && (data === null || (typeof data === "undefined" ? "undefined" : _typeof(data)) !== 'object')) {
                throw new Error('invalid argument: data must be an object when no path is provided');
            }
            var recordCores = this.recordCores.get(recordName);
            if (recordCores) {
                recordCores.set({ path: path, data: data, callback: callback });
                return;
            }
            if (callback) {
                // register with write ack service
            }
            var action = void 0;
            if (path) {
                action = callback ? message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK : message_constants_1.RECORD_ACTIONS.CREATEANDPATCH;
            } else {
                action = callback ? message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK : message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE;
            }
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RECORD,
                action: action,
                name: recordName,
                version: -1
            });
        }
        /**
         * Will be called by the client for incoming messages on the RECORD topic
         *
         * @param   {Object} message parsed and validated deepstream message
         */

    }, {
        key: "handle",
        value: function handle(message) {
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
                this.listener.handle(message);
                return;
            }
            var recordCore = this.recordCores.get(message.name);
            if (recordCore) {
                recordCore.handle(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.VERSION_EXISTS) {
                // do something
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED || message.action === message_constants_1.RECORD_ACTIONS.MESSAGE_PERMISSION_ERROR) {
                // do something
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.READ_RESPONSE || message.originalAction === message_constants_1.RECORD_ACTIONS.READ) {
                if (message.isError) {
                    this.readRegistry.recieve(message, message_constants_1.RECORD_ACTIONS[message.action], undefined);
                } else {
                    this.readRegistry.recieve(message, null, message.parsedData);
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE || message.originalAction === message_constants_1.RECORD_ACTIONS.HEAD) {
                if (message.isError) {
                    this.headRegistry.recieve(message, message_constants_1.RECORD_ACTIONS[message.action], undefined);
                } else {
                    this.headRegistry.recieve(message, null, message.version);
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.DELETED) {
                // do something
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT) {
                // handle write ack
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER) {
                // record can receive a HAS_PROVIDER after discarding the record
                return;
            }
            this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
        }
        /**
         * Callback for 'deleted' and 'discard' events from a record. Removes the record from
         * the registry
         */

    }, {
        key: "removeRecord",
        value: function removeRecord(recordName) {
            this.recordCores.delete(recordName);
        }
    }, {
        key: "getRecordCore",
        value: function getRecordCore(recordName) {
            var recordCore = this.recordCores.get(recordName);
            if (!recordCore) {
                recordCore = new record_core_1.RecordCore(recordName, this.services, this.options, this.removeRecord.bind(this));
                this.recordCores.set(recordName, recordCore);
            } else {
                recordCore.usages++;
            }
            return recordCore;
        }
    }]);

    return RecordHandler;
}();

exports.RecordHandler = RecordHandler;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var json_path_1 = __webpack_require__(33);
var Emitter = __webpack_require__(2);
var utils = __webpack_require__(3);
var state_machine_1 = __webpack_require__(8);

var RecordCore = function (_Emitter) {
    _inherits(RecordCore, _Emitter);

    function RecordCore(name, services, options, whenComplete) {
        _classCallCheck(this, RecordCore);

        var _this = _possibleConstructorReturn(this, (RecordCore.__proto__ || Object.getPrototypeOf(RecordCore)).call(this));

        _this.services = services;
        _this.options = options;
        _this.emitter = new Emitter();
        _this.data = Object.create(null);
        _this.writeCallbacks = new Map();
        _this.name = name;
        _this.whenComplete = whenComplete;
        _this.references = 1;
        _this.offlineDirty = false;
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        _this.setMergeStrategy(options.mergeStrategy);
        _this.stateMachine = new state_machine_1.StateMachine(_this.services.logger, {
            init: 0 /* INITIAL */
            , onStateChanged: function onStateChanged(newState, oldState) {
                _this.emitter.emit(constants_1.EVENT.RECORD_STATE_CHANGED, newState);
            },
            transitions: [{ name: message_constants_1.RECORD_ACTIONS.SUBSCRIBE, from: 0 /* INITIAL */, to: 1 /* SUBSCRIBING */, handler: _this.onSubscribing.bind(_this) }, { name: 0 /* LOAD */, from: 0 /* INITIAL */, to: 3 /* LOADING_OFFLINE */, handler: _this.onOfflineLoading.bind(_this) }, { name: 1 /* LOADED */, from: 3 /* LOADING_OFFLINE */, to: 4 /* READY */, handler: _this.onReady.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.READ_RESPONSE, from: 1 /* SUBSCRIBING */, to: 4 /* READY */, handler: _this.onReady.bind(_this) }, { name: 2 /* RESUBSCRIBE */, from: 4 /* READY */, to: 2 /* RESUBSCRIBING */, handler: _this.onResubscribing.bind(_this) }, { name: 3 /* RESUBSCRIBED */, from: 2 /* RESUBSCRIBING */, to: 4 /* READY */ }, { name: 4 /* INVALID_VERSION */, from: 2 /* RESUBSCRIBING */, to: 5 /* MERGING */ }, { name: message_constants_1.RECORD_ACTIONS.DELETE, from: 4 /* READY */, to: 8 /* DELETING */ }, { name: message_constants_1.RECORD_ACTIONS.DELETED, from: 4 /* READY */, to: 9 /* DELETED */, handler: _this.onDeleted.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS, from: 8 /* DELETING */, to: 9 /* DELETED */, handler: _this.onDeleted.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE, from: 4 /* READY */, to: 6 /* UNSUBSCRIBING */ }, { name: message_constants_1.RECORD_ACTIONS.SUBSCRIBE, from: 6 /* UNSUBSCRIBING */, to: 4 /* READY */ }, { name: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE_ACK, from: 6 /* UNSUBSCRIBING */, to: 7 /* UNSUBSCRIBED */, handler: _this.onUnsubscribed.bind(_this) }, { name: 4 /* INVALID_VERSION */, from: 4 /* READY */, to: 5 /* MERGING */ }]
        });
        if (_this.services.connection.isConnected) {
            _this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.SUBSCRIBE);
        } else {
            _this.stateMachine.transition(0 /* LOAD */);
        }
        return _this;
    }

    _createClass(RecordCore, [{
        key: "whenReady",

        /**
        * Convenience method, similar to promises. Executes callback
        * whenever the record is ready, either immediatly or once the ready
        * event is fired
        * @param   {[Function]} callback Will be called when the record is ready
        */
        value: function whenReady(context, callback) {
            var _this2 = this;

            if (this.isReady === true) {
                if (callback) {
                    callback(context);
                    return;
                }
                return Promise.resolve(context);
            }
            if (callback) {
                this.once(constants_1.EVENT.RECORD_READY, function () {
                    return callback(context);
                });
            } else {
                return new Promise(function (resolve, reject) {
                    _this2.once(constants_1.EVENT.RECORD_READY, function () {
                        return resolve(context);
                    });
                });
            }
        }
        /**
        * Sets the value of either the entire dataset
        * or of a specific path within the record
        * and submits the changes to the server
        *
        * If the new data is equal to the current data, nothing will happen
        *
        * @param {[String|Object]} pathOrData Either a JSON path when called with
        *                                     two arguments or the data itself
        * @param {Object} data     The data that should be stored in the record
        */

    }, {
        key: "set",
        value: function set(_ref) {
            var path = _ref.path,
                data = _ref.data,
                callback = _ref.callback;

            if (!path && (data === null || (typeof data === "undefined" ? "undefined" : _typeof(data)) !== 'object')) {
                throw new Error('invalid arguments, scalar values cannot be set without path');
            }
            if (this.checkDestroyed('set')) {
                return;
            }
            if (!this.isReady) {
                // TODO
                return;
            }
            var oldValue = this.data;
            var newValue = json_path_1.setValue(oldValue, path || null, data);
            if (oldValue === newValue) {
                if (callback) {
                    this.services.timerRegistry.requestIdleCallback(function () {
                        return callback(null);
                    });
                }
                return;
            }
            var writeSuccess = false;
            if (callback) {
                writeSuccess = true;
                if (this.services.connection.isConnected) {
                    this.setupWriteCallback(this.version, callback);
                } else {
                    this.services.timerRegistry.requestIdleCallback(function () {
                        return callback(constants_1.EVENT.CLIENT_OFFLINE);
                    });
                }
            }
            this.applyChange(newValue);
            if (this.services.connection.isConnected) {
                this.sendUpdate(path, data, writeSuccess);
            } else {
                this.saveUpdate();
            }
        }
        /**
         * Wrapper function around the record.set that returns a promise
         * if no callback is supplied.
         * @returns {Promise} if a callback is omitted a Promise is returned with the result of the write
         */

    }, {
        key: "setWithAck",
        value: function setWithAck(args) {
            var _this3 = this;

            if (!args.callback) {
                return new Promise(function (resolve, reject) {
                    args.callback = function (error) {
                        return error === null ? resolve() : reject(error);
                    };
                    _this3.set(args);
                });
            } else {
                this.set(args);
            }
        }
        /**
        * Returns a copy of either the entire dataset of the record
        * or - if called with a path - the value of that path within
        * the record's dataset.
        *
        * Returning a copy rather than the actual value helps to prevent
        * the record getting out of sync due to unintentional changes to
        * its data
        */

    }, {
        key: "get",
        value: function get(path) {
            return json_path_1.get(this.data, path || null, this.options.recordDeepCopy);
        }
        /**
        * Subscribes to changes to the records dataset.
        *
        * Callback is the only mandatory argument.
        *
        * When called with a path, it will only subscribe to updates
        * to that path, rather than the entire record
        *
        * If called with true for triggerNow, the callback will
        * be called immediatly with the current value
        */

    }, {
        key: "subscribe",
        value: function subscribe(args) {
            var _this4 = this;

            if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
                throw new Error('invalid argument path');
            }
            if (typeof args.callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (this.checkDestroyed('subscribe')) {
                return;
            }
            if (args.triggerNow) {
                this.whenReady(null, function () {
                    _this4.emitter.on(args.path || '', args.callback);
                    args.callback(_this4.get(args.path));
                });
            } else {
                this.emitter.on(args.path || '', args.callback);
            }
        }
        /**
         * Removes a subscription that was previously made using record.subscribe()
         *
         * Can be called with a path to remove the callback for this specific
         * path or only with a callback which removes it from the generic subscriptions
         *
         * Please Note: unsubscribe is a purely client side operation. If the app is no longer
         * interested in receiving updates for this record from the server it needs to call
         * discard instead
         *
         * @param   {String}           path  A JSON path
         * @param   {Function}         callback     The callback method. Please note, if a bound
         *                                          method was passed to subscribe, the same method
         *                                          must be passed to unsubscribe as well.
         */

    }, {
        key: "unsubscribe",
        value: function unsubscribe(args) {
            if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
                throw new Error('invalid argument path');
            }
            if (args.callback !== undefined && typeof args.callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (this.checkDestroyed('unsubscribe')) {
                return;
            }
            this.emitter.off(args.path || '', args.callback);
        }
        /**
        * Removes all change listeners and notifies the server that the client is
        * no longer interested in updates for this record
        */

    }, {
        key: "discard",
        value: function discard() {
            var _this5 = this;

            if (this.checkDestroyed('discard')) {
                return;
            }
            this.whenReady(null, function () {
                _this5.references--;
                if (_this5.references <= 0) {
                    _this5.discardTimeout = _this5.services.timerRegistry.add({
                        duration: _this5.options.discardTimeout,
                        callback: _this5.stateMachine.transition,
                        context: _this5.stateMachine,
                        data: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE_ACK
                    });
                }
            });
            this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE);
        }
        /**
         * Deletes the record on the server.
         */

    }, {
        key: "delete",
        value: function _delete(callback) {
            var _this6 = this;

            if (this.checkDestroyed('delete')) {
                return;
            }
            this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.DELETE);
            if (callback && typeof callback === 'function') {
                this.deleteResponse = { callback: callback };
                this.sendDelete();
            } else {
                return new Promise(function (resolve, reject) {
                    _this6.deleteResponse = { resolve: resolve, reject: reject };
                    _this6.sendDelete();
                });
            }
        }
        /**
         * Set a merge strategy to resolve any merge conflicts that may occur due
         * to offline work or write conflicts. The function will be called with the
         * local record, the remote version/data and a callback to call once the merge has
         * completed or if an error occurs ( which leaves it in an inconsistent state until
         * the next update merge attempt ).
         */

    }, {
        key: "setMergeStrategy",
        value: function setMergeStrategy(mergeStrategy) {
            if (typeof mergeStrategy === 'function') {
                this.mergeStrategy = mergeStrategy;
            } else {
                throw new Error('Invalid merge strategy: Must be a Function');
            }
        }
        /**
         * Transition States
         */

    }, {
        key: "onSubscribing",
        value: function onSubscribing() {
            this.services.timeoutRegistry.add({
                message: {
                    topic: message_constants_1.TOPIC.RECORD,
                    action: message_constants_1.RECORD_ACTIONS.SUBSCRIBE,
                    name: this.name
                }
            });
            this.responseTimeout = this.services.timeoutRegistry.add({
                message: {
                    topic: message_constants_1.TOPIC.RECORD,
                    action: message_constants_1.RECORD_ACTIONS.READ_RESPONSE,
                    name: this.name
                }
            });
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD,
                name: this.name
            });
        }
    }, {
        key: "onResubscribing",
        value: function onResubscribing() {
            this.services.timeoutRegistry.add({
                message: {
                    topic: message_constants_1.TOPIC.RECORD,
                    action: message_constants_1.RECORD_ACTIONS.SUBSCRIBE,
                    name: this.name
                }
            });
            this.responseTimeout = this.services.timeoutRegistry.add({
                message: {
                    topic: message_constants_1.TOPIC.RECORD,
                    action: message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE,
                    name: this.name
                }
            });
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDHEAD,
                name: this.name
            });
        }
    }, {
        key: "onOfflineLoading",
        value: function onOfflineLoading() {
            var _this7 = this;

            this.services.storage.get(this.name, function (recordName, version, data) {
                if (_this7.version === -1) {
                    _this7.data = {};
                    _this7.version = 1;
                } else {
                    _this7.data = data;
                    _this7.version = version;
                }
                _this7.stateMachine.transition(1 /* LOADED */);
            });
        }
    }, {
        key: "onReady",
        value: function onReady() {
            this.isReady = true;
            this.emit(constants_1.EVENT.RECORD_READY);
        }
    }, {
        key: "onUnsubscribed",
        value: function onUnsubscribed() {
            if (this.services.connection.isConnected) {
                var message = {
                    topic: message_constants_1.TOPIC.RECORD,
                    action: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE,
                    name: this.name
                };
                this.services.timeoutRegistry.add({ message: message });
                this.services.connection.sendMessage(message);
            }
            this.emit(constants_1.EVENT.RECORD_DISCARDED);
            this.destroy();
        }
    }, {
        key: "onDeleted",
        value: function onDeleted() {
            console.log('onDeleted');
            this.emit(constants_1.EVENT.RECORD_DELETED);
            this.destroy();
        }
    }, {
        key: "handle",
        value: function handle(message) {
            if (message.action === message_constants_1.RECORD_ACTIONS.READ_RESPONSE) {
                if (this.stateMachine.state === 5 /* MERGING */) {
                        this.recoverRecord(message.version, message.parsedData, message);
                        return;
                    }
                this.version = message.version;
                this.applyChange(json_path_1.setValue(this.data, null, message.parsedData));
                this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.READ_RESPONSE);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE) {
                if (this.version === message.version) {
                    this.stateMachine.transition(3 /* RESUBSCRIBED */);
                    return;
                }
                if (this.version + 1 === message.version) {
                    this.version = message.version;
                    this.applyChange(json_path_1.setValue(this.data, null, message.parsedData));
                    this.stateMachine.transition(3 /* RESUBSCRIBED */);
                    return;
                }
                this.stateMachine.transition(4 /* INVALID_VERSION */);
                this.sendRead();
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.PATCH || message.action === message_constants_1.RECORD_ACTIONS.UPDATE) {
                this.applyUpdate(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS) {
                this.stateMachine.transition(message.action);
                if (this.deleteResponse.callback) {
                    this.deleteResponse.callback(null);
                } else if (this.deleteResponse.resolve) {
                    this.deleteResponse.resolve();
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.DELETED) {
                this.stateMachine.transition(message.action);
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.VERSION_EXISTS) {
                // what kind of message is version exists?
                // this.recoverRecord(message)
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED) {
                if (message.originalAction === message_constants_1.RECORD_ACTIONS.PATCH || message.originalAction === message_constants_1.RECORD_ACTIONS.UPDATE || message.originalAction === message_constants_1.RECORD_ACTIONS.ERASE || message.originalAction === message_constants_1.RECORD_ACTIONS.DELETE || message.originalAction === message_constants_1.RECORD_ACTIONS.CREATE || message.originalAction === message_constants_1.RECORD_ACTIONS.READ) {
                    this.emit(constants_1.EVENT.RECORD_ERROR, message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED], message_constants_1.RECORD_ACTIONS[message.originalAction]);
                }
                if (message.originalAction === message_constants_1.RECORD_ACTIONS.DELETE) {
                    if (this.deleteResponse.callback) {
                        this.deleteResponse.callback(message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED]);
                    } else if (this.deleteResponse.reject) {
                        this.deleteResponse.reject(message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED]);
                    }
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT) {
                this.handleWriteAcknowledgements(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER) {
                this.hasProvider = message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER;
                this.emit(constants_1.EVENT.RECORD_HAS_PROVIDER_CHANGED, this.hasProvider);
                return;
            }
        }
    }, {
        key: "sendRead",
        value: function sendRead() {
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.READ,
                name: this.name
            });
        }
    }, {
        key: "handleWriteAcknowledgements",
        value: function handleWriteAcknowledgements(message) {
            var versions = message.parsedData[0];
            var error = message.parsedData[1];
            for (var i = 0; i < versions.length; i++) {
                var version = versions[i];
                var callback = this.writeCallbacks.get(version);
                if (callback) {
                    this.writeCallbacks.delete(version);
                    callback(error);
                }
            }
        }
    }, {
        key: "saveUpdate",
        value: function saveUpdate() {
            if (!this.offlineDirty) {
                this.version++;
                this.offlineDirty = true;
            }
            this.services.storage.set(this.name, this.version, this.data, function () {});
        }
    }, {
        key: "sendUpdate",
        value: function sendUpdate() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var data = arguments[1];
            var writeSuccess = arguments[2];

            this.version++;
            if (data === undefined && path !== null) {
                this.services.connection.sendMessage({
                    topic: message_constants_1.TOPIC.RECORD,
                    action: writeSuccess ? message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK : message_constants_1.RECORD_ACTIONS.ERASE,
                    name: this.name,
                    path: path,
                    version: this.version
                });
                return;
            }
            if (path === null) {
                this.services.connection.sendMessage({
                    topic: message_constants_1.TOPIC.RECORD,
                    action: writeSuccess ? message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK : message_constants_1.RECORD_ACTIONS.UPDATE,
                    name: this.name,
                    parsedData: data,
                    version: this.version
                });
                return;
            }
            this.services.connection.sendMessage({
                topic: message_constants_1.TOPIC.RECORD,
                action: writeSuccess ? message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK : message_constants_1.RECORD_ACTIONS.PATCH,
                name: this.name,
                path: path,
                parsedData: data,
                version: this.version
            });
        }
        /**
         * Applies incoming updates and patches to the record's dataset
         */

    }, {
        key: "applyUpdate",
        value: function applyUpdate(message) {
            var version = message.version;
            var data = message.parsedData;
            if (this.version === null) {
                this.version = version;
            } else if (this.version + 1 !== version) {
                if (message.action === message_constants_1.RECORD_ACTIONS.PATCH) {
                    /**
                    * Request a snapshot so that a merge can be done with the read reply which contains
                    * the full state of the record
                    **/
                    this.sendRead();
                } else {
                    this.recoverRecord(message.version, message.parsedData, message);
                }
                return;
            }
            this.version = version;
            var newData = json_path_1.setValue(this.data, message.path || null, data);
            this.applyChange(newData);
        }
        /**
         * Compares the new values for every path with the previously stored ones and
         * updates the subscribers if the value has changed
         */

    }, {
        key: "applyChange",
        value: function applyChange(newData) {
            if (this.stateMachine.inEndState) {
                return;
            }
            var oldData = this.data;
            this.data = newData;
            var paths = this.emitter.eventNames();
            for (var i = 0; i < paths.length; i++) {
                var newValue = json_path_1.get(newData, paths[i], false);
                var oldValue = json_path_1.get(oldData, paths[i], false);
                if (newValue !== oldValue) {
                    this.emitter.emit(paths[i], this.get(paths[i]));
                }
            }
        }
        /**
         * If connected sends the delete message to server, otherwise
         * we delete in local storage and transition to delete success.
         */

    }, {
        key: "sendDelete",
        value: function sendDelete() {
            var _this8 = this;

            this.whenReady(null, function () {
                if (_this8.services.connection.isConnected) {
                    var message = {
                        topic: message_constants_1.TOPIC.RECORD,
                        action: message_constants_1.RECORD_ACTIONS.DELETE,
                        name: _this8.name
                    };
                    _this8.deletedTimeout = _this8.services.timeoutRegistry.add({
                        message: message,
                        event: constants_1.EVENT.RECORD_DELETE_TIMEOUT,
                        duration: _this8.options.recordDeleteTimeout
                    });
                    _this8.services.connection.sendMessage(message);
                } else {
                    _this8.services.storage.delete(_this8.name, function () {
                        _this8.services.timerRegistry.requestIdleCallback(function () {
                            _this8.stateMachine.transition(message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS);
                        });
                    });
                }
            });
        }
        /**
         * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
         * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
         * error and the record will remain in an inconsistent state.
         *
         * @param   {Number} remoteVersion The remote version number
         * @param   {Object} remoteData The remote object data
         * @param   {Object} message parsed and validated deepstream message
         */

    }, {
        key: "recoverRecord",
        value: function recoverRecord(remoteVersion, remoteData, message) {
            if (this.mergeStrategy) {
                this.mergeStrategy(this, remoteData, remoteVersion, this.onRecordRecovered.bind(this, remoteVersion, remoteData, message));
                return;
            }
            this.services.logger.error(message, constants_1.EVENT.RECORD_VERSION_EXISTS, { remoteVersion: remoteVersion, record: this });
        }
        /**
        * Callback once the record merge has completed. If successful it will set the
        * record state, else emit and error and the record will remain in an
        * inconsistent state until the next update.
        *
        * @param   {Number} remoteVersion The remote version number
        * @param   {Object} remoteData The remote object data
        * @param   {Object} message parsed and validated deepstream message
        */

    }, {
        key: "onRecordRecovered",
        value: function onRecordRecovered(remoteVersion, remoteData, message, error, data) {
            if (error) {
                this.services.logger.error(message, constants_1.EVENT.RECORD_VERSION_EXISTS);
            }
            var oldVersion = this.version;
            this.version = remoteVersion;
            var oldValue = this.data;
            if (utils.deepEquals(oldValue, remoteData)) {
                return;
            }
            var newValue = json_path_1.setValue(oldValue, null, data);
            if (utils.deepEquals(data, remoteData)) {
                this.applyChange(data);
                var callback = this.writeCallbacks.get(remoteVersion);
                if (callback !== undefined) {
                    callback(null);
                    this.writeCallbacks.delete(remoteVersion);
                }
                return;
            }
            if (message.isWriteAck) {
                var _callback = this.writeCallbacks.get(oldVersion);
                if (_callback) {
                    this.writeCallbacks.delete(remoteVersion);
                    this.setupWriteCallback(this.version, _callback);
                }
            }
            this.sendUpdate(null, data, message.isWriteAck);
            this.applyChange(newValue);
        }
        /**
        * A quick check that's carried out by most methods that interact with the record
        * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
        */

    }, {
        key: "checkDestroyed",
        value: function checkDestroyed(methodName) {
            if (this.stateMachine.inEndState) {
                this.services.logger.error({ topic: message_constants_1.TOPIC.RECORD }, constants_1.EVENT.RECORD_ALREADY_DESTROYED, { methodName: methodName });
                return true;
            }
            return false;
        }
    }, {
        key: "setupWriteCallback",
        value: function setupWriteCallback(version, callback) {
            this.writeCallbacks.set(this.version + 1, callback);
        }
        /**
         * Destroys the record and nulls all
         * its dependencies
         */

    }, {
        key: "destroy",
        value: function destroy() {
            this.services.timerRegistry.remove(this.deletedTimeout);
            this.services.timerRegistry.remove(this.discardTimeout);
            this.services.timerRegistry.remove(this.responseTimeout);
            this.emitter.off();
            this.isReady = false;
            this.whenComplete(this.name);
        }
    }, {
        key: "recordState",
        get: function get() {
            return this.stateMachine.state;
        }
    }, {
        key: "usages",
        set: function set(usages) {
            this.references = usages;
            if (this.references === 1) {
                this.services.timerRegistry.remove(this.discardTimeout);
                this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.SUBSCRIBE);
            }
        },
        get: function get() {
            return this.references;
        }
    }]);

    return RecordCore;
}(Emitter);

exports.RecordCore = RecordCore;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(3);
var SPLIT_REG_EXP = /[[\]]/g;
/**
* Returns the value of the path or
* undefined if the path can't be resolved
*/
function get(data, path, deepCopy) {
    var tokens = tokenize(path);
    var value = data;
    for (var i = 0; i < tokens.length; i++) {
        if (value === undefined) {
            return undefined;
        }
        if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== 'object') {
            throw new Error('invalid data or path');
        }
        value = value[tokens[i]];
    }
    return deepCopy !== false ? utils.deepCopy(value) : value;
}
exports.get = get;
/**
 * This class allows to set or get specific
 * values within a json data structure using
 * string-based paths
 */
function setValue(root, path, value) {
    if (path === null) {
        return value;
    }
    var tokens = tokenize(path);
    var copy = utils.deepCopy(root);
    var node = copy;
    var i = void 0;
    for (i = 0; i < tokens.length - 1; i++) {
        var token = tokens[i];
        if (node[token] !== undefined && _typeof(node[token]) === 'object') {
            node = node[token];
        } else if (typeof tokens[i + 1] === 'number') {
            node = node[token] = [];
        } else {
            node = node[token] = {};
        }
    }
    if (value === undefined) {
        delete node[tokens[i]];
    } else {
        node[tokens[i]] = value;
    }
    return copy;
}
exports.setValue = setValue;
/**
 * Parses the path. Splits it into
 * keys for objects and indices for arrays.
 */
function tokenize(path) {
    if (path === null) {
        return [];
    }
    var tokens = [];
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i].trim();
        if (part.length === 0) {
            continue;
        }
        var arrayIndexes = part.split(SPLIT_REG_EXP);
        if (arrayIndexes.length === 0) {
            // TODO
            continue;
        }
        tokens.push(arrayIndexes[0]);
        for (var j = 1; j < arrayIndexes.length; j++) {
            if (arrayIndexes[j].length === 0) {
                continue;
            }
            tokens.push(Number(arrayIndexes[j]));
        }
    }
    return tokens;
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(3);
var constants_1 = __webpack_require__(1);
var Emitter = __webpack_require__(2);

var Record = function (_Emitter) {
    _inherits(Record, _Emitter);

    function Record(record) {
        _classCallCheck(this, Record);

        var _this = _possibleConstructorReturn(this, (Record.__proto__ || Object.getPrototypeOf(Record)).call(this));

        _this.record = record;
        _this.subscriptions = [];
        _this.record.on(constants_1.EVENT.RECORD_READY, _this.emit.bind(_this, constants_1.EVENT.RECORD_READY, _this));
        _this.record.on(constants_1.EVENT.RECORD_DISCARDED, _this.emit.bind(_this, constants_1.EVENT.RECORD_DISCARDED));
        _this.record.on(constants_1.EVENT.RECORD_DELETED, _this.emit.bind(_this, constants_1.EVENT.RECORD_DELETED));
        _this.record.on(constants_1.EVENT.RECORD_ERROR, _this.emit.bind(_this, constants_1.EVENT.RECORD_ERROR));
        return _this;
    }

    _createClass(Record, [{
        key: "whenReady",
        value: function whenReady(callback) {
            return this.record.whenReady(this, callback);
        }
    }, {
        key: "get",
        value: function get(path) {
            return this.record.get(path);
        }
    }, {
        key: "set",
        value: function set(path, data, callback) {
            return this.record.set(utils.normalizeSetArguments(arguments));
        }
    }, {
        key: "setWithAck",
        value: function setWithAck(path, data, callback) {
            return this.record.setWithAck(utils.normalizeSetArguments(arguments));
        }
    }, {
        key: "subscribe",
        value: function subscribe(path, callback, triggerNow) {
            var parameters = utils.normalizeArguments(arguments);
            this.subscriptions.push(parameters);
            this.record.subscribe(parameters);
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe(path, callback) {
            var parameters = utils.normalizeArguments(arguments);
            this.subscriptions = this.subscriptions.filter(function (subscription) {
                return subscription.path !== parameters.path || subscription.callback !== parameters.callback;
            });
            this.record.unsubscribe(parameters);
        }
    }, {
        key: "discard",
        value: function discard() {
            for (var i = 0; i < this.subscriptions.length; i++) {
                this.record.unsubscribe(this.subscriptions[i]);
            }
            return this.record.discard();
        }
    }, {
        key: "delete",
        value: function _delete(callback) {
            return this.record.delete(callback);
        }
    }, {
        key: "setMergeStrategy",
        value: function setMergeStrategy(mergeStrategy) {
            this.record.setMergeStrategy(mergeStrategy);
        }
    }, {
        key: "name",
        get: function get() {
            return this.record.name;
        }
    }, {
        key: "isReady",
        get: function get() {
            return this.record.isReady;
        }
    }, {
        key: "version",
        get: function get() {
            return this.record.version;
        }
    }]);

    return Record;
}(Emitter);

exports.Record = Record;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(3);
var Emitter = __webpack_require__(2);

var AnonymousRecord = function (_Emitter) {
    _inherits(AnonymousRecord, _Emitter);

    function AnonymousRecord(getRecordCore) {
        _classCallCheck(this, AnonymousRecord);

        var _this = _possibleConstructorReturn(this, (AnonymousRecord.__proto__ || Object.getPrototypeOf(AnonymousRecord)).call(this));

        _this.record = null;
        _this.subscriptions = [];
        _this.getRecordCore = getRecordCore;
        return _this;
    }

    _createClass(AnonymousRecord, [{
        key: "whenReady",
        value: function whenReady(callback) {
            if (this.record) {
                return this.record.whenReady(this, callback);
            }
        }
    }, {
        key: "setName",
        value: function setName(recordName, callback) {
            if (this.name === recordName) {
                return;
            }
            this.discard();
            this.record = this.getRecordCore(recordName);
            for (var i = 0; i < this.subscriptions.length; i++) {
                this.record.subscribe(this.subscriptions[i]);
            }
            this.emit('nameChanged', recordName);
            return this.record.whenReady(this, callback);
        }
    }, {
        key: "get",
        value: function get(path) {
            if (this.record) {
                return this.record.get(path);
            }
        }
    }, {
        key: "set",
        value: function set(path, data, callback) {
            if (this.record) {
                return this.record.set(utils.normalizeSetArguments(arguments));
            }
        }
    }, {
        key: "setWithAck",
        value: function setWithAck(path, data, callback) {
            if (this.record) {
                return this.record.setWithAck(utils.normalizeSetArguments(arguments));
            }
        }
    }, {
        key: "subscribe",
        value: function subscribe(path, callback, triggerNow) {
            var parameters = utils.normalizeArguments(arguments);
            this.subscriptions.push(parameters);
            if (this.record) {
                this.record.subscribe(parameters);
            }
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe(path, callback) {
            var parameters = utils.normalizeArguments(arguments);
            this.subscriptions = this.subscriptions.filter(function (subscription) {
                return subscription.path !== parameters.path || subscription.callback !== parameters.callback;
            });
            if (this.record) {
                this.record.unsubscribe(parameters);
            }
        }
    }, {
        key: "discard",
        value: function discard() {
            if (this.record) {
                for (var i = 0; i < this.subscriptions.length; i++) {
                    this.record.unsubscribe(this.subscriptions[i]);
                }
                return this.record.discard();
            }
        }
    }, {
        key: "delete",
        value: function _delete(callback) {
            if (this.record) {
                return this.record.delete(callback);
            }
        }
    }, {
        key: "setMergeStrategy",
        value: function setMergeStrategy(mergeStrategy) {
            if (this.record) {
                this.record.setMergeStrategy(mergeStrategy);
            }
        }
    }, {
        key: "name",
        get: function get() {
            if (!this.record) {
                return '';
            }
            return this.record.name;
        }
    }, {
        key: "isReady",
        get: function get() {
            if (!this.record) {
                return false;
            }
            return this.record.isReady;
        }
    }, {
        key: "version",
        get: function get() {
            if (!this.record) {
                return -1;
            }
            return this.record.version;
        }
    }]);

    return AnonymousRecord;
}(Emitter);

exports.AnonymousRecord = AnonymousRecord;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(3);
var constants_1 = __webpack_require__(1);
var Emitter = __webpack_require__(2);

var List = function (_Emitter) {
    _inherits(List, _Emitter);

    function List(record) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));

        _this.record = record;
        _this.originalApplyUpdate = _this.record.applyUpdate.bind(_this.record);
        _this.record.applyUpdate = _this.applyUpdate.bind(_this);
        _this.wrappedFunctions = new Map();
        return _this;
    }

    _createClass(List, [{
        key: "whenReady",
        value: function whenReady(callback) {
            return this.record.whenReady(this, callback);
        }
        /**
         * Returns the array of list entries or an
         * empty array if the list hasn't been populated yet.
         */

    }, {
        key: "getEntries",
        value: function getEntries() {
            var entries = this.record.get();
            if (!(entries instanceof Array)) {
                return [];
            }
            return entries;
        }
        /**
        * Returns true if the list is empty
        */

    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.getEntries().length === 0;
        }
        /**
        * Updates the list with a new set of entries
        */

    }, {
        key: "setEntriesWithAck",
        value: function setEntriesWithAck(entries, callback) {
            var _this2 = this;

            if (!callback) {
                return new Promise(function (resolve, reject) {
                    _this2.setEntries(entries, function (error) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
            }
            this.setEntries(entries, callback);
        }
        /**
        * Updates the list with a new set of entries
        */

    }, {
        key: "setEntries",
        value: function setEntries(entries, callback) {
            var errorMsg = 'entries must be an array of record names';
            var i = void 0;
            if (!(entries instanceof Array)) {
                throw new Error(errorMsg);
            }
            for (i = 0; i < entries.length; i++) {
                if (typeof entries[i] !== 'string') {
                    throw new Error(errorMsg);
                }
            }
            if (this.record.isReady === false) {
                // ...
            } else {
                this.beforeChange();
                this.record.set({ data: entries, callback: callback });
                this.afterChange();
            }
        }
        /**
         * Removes an entry from the list
         *
         * @param {String} entry
         * @param {Number} [index]
         */

    }, {
        key: "removeEntry",
        value: function removeEntry(entry, index, callback) {
            if (this.record.isReady === false) {
                // ...
                return;
            }
            var currentEntries = this.record.get();
            var hasIndex = this.hasIndex(index);
            var entries = [];
            var i = void 0;
            for (i = 0; i < currentEntries.length; i++) {
                if (currentEntries[i] !== entry || hasIndex && index !== i) {
                    entries.push(currentEntries[i]);
                }
            }
            this.beforeChange();
            this.record.set({ data: entries, callback: callback });
            this.afterChange();
        }
        /**
        * Adds an entry to the list
        *
        * @param {String} entry
        * @param {Number} [index]
        */

    }, {
        key: "addEntry",
        value: function addEntry(entry, index, callback) {
            if (typeof entry !== 'string') {
                throw new Error('Entry must be a recordName');
            }
            if (this.record.isReady === false) {
                // ..
                return;
            }
            var hasIndex = this.hasIndex(index);
            var entries = this.getEntries();
            if (hasIndex) {
                entries.splice(index, 0, entry);
            } else {
                entries.push(entry);
            }
            this.beforeChange();
            this.record.set({ data: entries, callback: callback });
            this.afterChange();
        }
        /**
        * Proxies the underlying Record's subscribe method. Makes sure
        * that no path is provided
        */

    }, {
        key: "subscribe",
        value: function subscribe(callback) {
            var parameters = utils.normalizeArguments(arguments);
            if (parameters.path) {
                throw new Error('path is not supported for List.subscribe');
            }
            // Make sure the callback is invoked with an empty array for new records
            var listCallback = function (cb) {
                cb(this.getEntries());
            }.bind(this, parameters.callback);
            /**
            * Adding a property onto a function directly is terrible practice,
            * and we will change this as soon as we have a more seperate approach
            * of creating lists that doesn't have records default state.
            *
            * The reason we are holding a referencing to wrapped array is so that
            * on unsubscribe it can provide a reference to the actual method the
            * record is subscribed too.
            **/
            this.wrappedFunctions.set(parameters.callback, listCallback);
            parameters.callback = listCallback;
            this.record.subscribe(parameters);
        }
        /**
        * Proxies the underlying Record's unsubscribe method. Makes sure
        * that no path is provided
        */

    }, {
        key: "unsubscribe",
        value: function unsubscribe(callback) {
            var parameters = utils.normalizeArguments(arguments);
            if (parameters.path) {
                throw new Error('path is not supported for List.unsubscribe');
            }
            var listenCallback = this.wrappedFunctions.get(parameters.callback);
            parameters.callback = listenCallback;
            this.record.unsubscribe(parameters);
            this.wrappedFunctions.delete(parameters.callback);
        }
        /**
         * Proxies the underlying Record's _update method. Set's
         * data to an empty array if no data is provided.
         */

    }, {
        key: "applyUpdate",
        value: function applyUpdate(message) {
            if (!(message.parsedData instanceof Array)) {
                message.parsedData = [];
            }
            this.beforeChange();
            this.originalApplyUpdate(message);
            this.afterChange();
        }
        /**
         * Validates that the index provided is within the current set of entries.
         */

    }, {
        key: "hasIndex",
        value: function hasIndex(index) {
            var hasIndex = false;
            var entries = this.getEntries();
            if (index !== undefined) {
                if (isNaN(index)) {
                    throw new Error('Index must be a number');
                }
                if (index !== entries.length && (index >= entries.length || index < 0)) {
                    throw new Error('Index must be within current entries');
                }
                hasIndex = true;
            }
            return hasIndex;
        }
        /**
         * Establishes the current structure of the list, provided the client has attached any
         * add / move / remove listener
         *
         * This will be called before any change to the list, regardsless if the change was triggered
         * by an incoming message from the server or by the client
         */

    }, {
        key: "beforeChange",
        value: function beforeChange() {
            this.hasAddListener = this.listeners(constants_1.EVENT.ENTRY_ADDED_EVENT).length > 0;
            this.hasRemoveListener = this.listeners(constants_1.EVENT.ENTRY_REMOVED_EVENT).length > 0;
            this.hasMoveListener = this.listeners(constants_1.EVENT.ENTRY_MOVED_EVENT).length > 0;
            if (this.hasAddListener || this.hasRemoveListener || this.hasMoveListener) {
                this.beforeStructure = this.getStructure();
            } else {
                this.beforeStructure = null;
            }
        }
        /**
         * Compares the structure of the list after a change to its previous structure and notifies
         * any add / move / remove listener. Won't do anything if no listeners are attached.
         */

    }, {
        key: "afterChange",
        value: function afterChange() {
            if (this.beforeStructure === null) {
                return;
            }
            var after = this.getStructure();
            var before = this.beforeStructure;
            var entry = void 0;
            var i = void 0;
            if (this.hasRemoveListener) {
                for (entry in before) {
                    for (i = 0; i < before[entry].length; i++) {
                        if (after[entry] === undefined || after[entry][i] === undefined) {
                            this.emit(constants_1.EVENT.ENTRY_REMOVED_EVENT, entry, before[entry][i]);
                        }
                    }
                }
            }
            if (this.hasAddListener || this.hasMoveListener) {
                for (entry in after) {
                    if (before[entry] === undefined) {
                        for (i = 0; i < after[entry].length; i++) {
                            this.emit(constants_1.EVENT.ENTRY_ADDED_EVENT, entry, after[entry][i]);
                        }
                    } else {
                        for (i = 0; i < after[entry].length; i++) {
                            if (before[entry][i] !== after[entry][i]) {
                                if (before[entry][i] === undefined) {
                                    this.emit(constants_1.EVENT.ENTRY_ADDED_EVENT, entry, after[entry][i]);
                                } else {
                                    this.emit(constants_1.EVENT.ENTRY_MOVED_EVENT, entry, after[entry][i]);
                                }
                            }
                        }
                    }
                }
            }
        }
        /**
         * Iterates through the list and creates a map with the entry as a key
         * and an array of its position(s) within the list as a value, e.g.
         *
         * {
         *   'recordA': [ 0, 3 ],
         *   'recordB': [ 1 ],
         *   'recordC': [ 2 ]
         * }
         */

    }, {
        key: "getStructure",
        value: function getStructure() {
            var structure = {};
            var i = void 0;
            var entries = this.record.get();
            for (i = 0; i < entries.length; i++) {
                if (structure[entries[i]] === undefined) {
                    structure[entries[i]] = [i];
                } else {
                    structure[entries[i]].push(i);
                }
            }
            return structure;
        }
    }, {
        key: "name",
        get: function get() {
            return this.record.name;
        }
    }, {
        key: "isReady",
        get: function get() {
            return this.record.isReady;
        }
    }, {
        key: "version",
        get: function get() {
            return this.record.version;
        }
    }]);

    return List;
}(Emitter);

exports.List = List;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(4);
/**
 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT
 * and HAS functionality. The SingleNotifier multiplexes all the client requests so
 * that they can can be notified at once, and also includes reconnection funcionality
 * incase the connection drops.
 *
 * @param {Services} services          The deepstream client
 * @param {Options} options     Function to call to allow resubscribing
 *
 * @constructor
 */

var SingleNotifier = function () {
    function SingleNotifier(services, topic, action, timeoutDuration) {
        _classCallCheck(this, SingleNotifier);

        this.services = services;
        this.topic = topic;
        this.action = action;
        this.timeoutDuration = timeoutDuration;
        this.requests = new Map();
    }
    /**
    * Add a request. If one has already been made it will skip the server request
    * and multiplex the response
    *
    * @param {String} name An identifier for the request, e.g. a record name
    * @param {Object} response An object with property `callback` or `resolve` and `reject`
    *
    * @public
    * @returns {void}
    */


    _createClass(SingleNotifier, [{
        key: "request",
        value: function request(name, response) {
            if (this.services.connection.isConnected === false) {
                if (response.callback) {
                    this.services.timerRegistry.requestIdleCallback(response.callback.bind(this, client_1.EVENT.CLIENT_OFFLINE));
                } else if (response.reject) {
                    response.reject(client_1.EVENT.CLIENT_OFFLINE);
                }
                return;
            }
            var message = {
                topic: this.topic,
                action: this.action,
                name: name
            };
            this.services.timeoutRegistry.add({ message: message });
            var req = this.requests.get(name);
            if (req === undefined) {
                this.requests.set(name, [response]);
                this.services.connection.sendMessage(message);
            } else {
                req.push(response);
            }
        }
    }, {
        key: "recieve",
        value: function recieve(message, error, data) {
            var name = message.name;
            var responses = this.requests.get(name);
            if (!responses) {
                this.services.logger.error(message, client_1.EVENT.UNSOLICITED_MESSAGE);
                return;
            }
            for (var i = 0; i < responses.length; i++) {
                var response = responses[i];
                if (response.callback) {
                    response.callback(error, data);
                } else if (error && response.reject) {
                    response.reject(error);
                } else if (response.resolve) {
                    response.resolve(data);
                }
            }
            this.requests.delete(name);
        }
    }]);

    return SingleNotifier;
}();

exports.SingleNotifier = SingleNotifier;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(4);
var message_constants_1 = __webpack_require__(0);
var Emitter = __webpack_require__(2);
var ONLY_EVENT = 'OE';
function validateQueryArguments(rest) {
    var users = null;
    var cb = null;
    if (rest.length === 1) {
        if (Array.isArray(rest[0])) {
            users = rest[0];
        } else {
            if (typeof rest[0] !== 'function') {
                throw new Error('invalid argument: "callback"');
            }
            cb = rest[0];
        }
    } else if (rest.length === 2) {
        users = rest[0];
        cb = rest[1];
        if (!Array.isArray(users) || typeof cb !== 'function') {
            throw new Error('invalid argument: "users" or "callback"');
        }
    }
    return { users: users, callback: cb };
}

var PresenceHandler = function () {
    function PresenceHandler(services, options) {
        _classCallCheck(this, PresenceHandler);

        this.services = services;
        this.options = options;
        this.subscriptionEmitter = new Emitter();
        this.globalSubscriptionEmitter = new Emitter();
        this.queryEmitter = new Emitter();
        this.queryAllEmitter = new Emitter();
        this.resubscribe = this.resubscribe.bind(this);
        this.services.connection.registerHandler(message_constants_1.TOPIC.PRESENCE, this.handle.bind(this));
        this.services.connection.onReestablished(this.resubscribe.bind(this));
        this.counter = 0;
        this.pendingSubscribes = new Set();
        this.pendingUnsubscribes = new Set();
    }

    _createClass(PresenceHandler, [{
        key: "subscribe",
        value: function subscribe(userOrCallback, callback) {
            if (typeof userOrCallback === 'string' && userOrCallback.length > 0 && typeof callback === 'function') {
                var user = userOrCallback;
                if (!this.subscriptionEmitter.hasListeners(user)) {
                    this.pendingSubscribes.add(user);
                }
                this.subscriptionEmitter.on(user, callback);
                this.pendingUnsubscribes.delete(user);
                this.registerFlushTimeout();
                return;
            }
            if (typeof userOrCallback === 'function' && typeof callback === 'undefined') {
                if (!this.subscriptionEmitter.hasListeners(ONLY_EVENT)) {
                    this.subscribeToAllChanges();
                }
                this.globalSubscriptionEmitter.on(ONLY_EVENT, userOrCallback);
                return;
            }
            throw new Error('invalid arguments: "user" or "callback"');
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe(userOrCallback, callback) {
            if (userOrCallback && typeof userOrCallback === 'string' && userOrCallback.length > 0) {
                var user = userOrCallback;
                if (callback) {
                    if (typeof callback !== 'function') {
                        throw new Error('invalid argument: "callback"');
                    }
                    this.subscriptionEmitter.off(user, callback);
                } else {
                    this.subscriptionEmitter.off(user);
                }
                if (!this.subscriptionEmitter.hasListeners(user)) {
                    this.pendingSubscribes.delete(user);
                    this.pendingUnsubscribes.add(user);
                    this.registerFlushTimeout();
                }
                return;
            }
            if (userOrCallback && typeof userOrCallback === 'function') {
                callback = userOrCallback;
                this.globalSubscriptionEmitter.off(ONLY_EVENT, callback);
                if (!this.subscriptionEmitter.hasListeners(ONLY_EVENT)) {
                    this.unsubscribeToAllChanges();
                }
                return;
            }
            if (typeof userOrCallback === 'undefined' && typeof callback === 'undefined') {
                this.subscriptionEmitter.off();
                this.globalSubscriptionEmitter.off();
                this.pendingSubscribes.clear();
                var users = this.subscriptionEmitter.eventNames();
                for (var i = 0; i < users.length; i++) {
                    this.pendingUnsubscribes.add(users[i]);
                }
                this.registerFlushTimeout();
                this.unsubscribeToAllChanges();
                return;
            }
            throw new Error('invalid argument: "user" or "callback"');
        }
    }, {
        key: "getAll",
        value: function getAll() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var _validateQueryArgumen = validateQueryArguments(rest),
                callback = _validateQueryArgumen.callback,
                users = _validateQueryArgumen.users;

            if (!this.services.connection.isConnected) {
                if (callback) {
                    this.services.timerRegistry.requestIdleCallback(callback.bind(this, client_1.EVENT.CLIENT_OFFLINE));
                    return;
                }
                return Promise.reject(client_1.EVENT.CLIENT_OFFLINE);
            }
            var message = void 0;
            var emitter = void 0;
            var emitterAction = void 0;
            if (users) {
                var queryId = (this.counter++).toString();
                message = {
                    topic: message_constants_1.TOPIC.PRESENCE,
                    action: message_constants_1.PRESENCE_ACTIONS.QUERY,
                    correlationId: queryId,
                    names: users
                };
                emitter = this.queryEmitter;
                emitterAction = queryId;
            } else {
                message = {
                    topic: message_constants_1.TOPIC.PRESENCE,
                    action: message_constants_1.PRESENCE_ACTIONS.QUERY_ALL
                };
                emitter = this.queryAllEmitter;
                emitterAction = ONLY_EVENT;
            }
            this.services.connection.sendMessage(message);
            this.services.timeoutRegistry.add({ message: message });
            if (callback) {
                emitter.once(emitterAction, callback);
                return;
            }
            return new Promise(function (resolve, reject) {
                emitter.once(emitterAction, function (error, results) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
    }, {
        key: "handle",
        value: function handle(message) {
            if (message.isAck) {
                this.services.timeoutRegistry.remove(message);
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE) {
                this.queryAllEmitter.emit(ONLY_EVENT, null, message.names);
                this.services.timeoutRegistry.remove(Object.assign({}, message, { action: message_constants_1.PRESENCE_ACTIONS.QUERY_ALL }));
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE) {
                this.queryEmitter.emit(message.correlationId, null, message.parsedData);
                this.services.timeoutRegistry.remove(Object.assign({}, message, { action: message_constants_1.PRESENCE_ACTIONS.QUERY }));
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN) {
                this.subscriptionEmitter.emit(message.name, message.name, true);
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN_ALL) {
                this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, true);
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE) {
                this.subscriptionEmitter.emit(message.name, message.name, false);
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL) {
                this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, false);
                return;
            }
            if (message.isError) {
                this.services.timeoutRegistry.remove(message);
                if (message.originalAction === message_constants_1.PRESENCE_ACTIONS.QUERY) {
                    this.queryEmitter.emit(message.correlationId, message_constants_1.PRESENCE_ACTIONS[message.action]);
                } else if (message.originalAction === message_constants_1.PRESENCE_ACTIONS.QUERY_ALL) {
                    this.queryAllEmitter.emit(ONLY_EVENT, message_constants_1.PRESENCE_ACTIONS[message.action]);
                } else {
                    this.services.logger.error(message);
                }
                return;
            }
            this.services.logger.error(message, client_1.EVENT.UNSOLICITED_MESSAGE);
        }
    }, {
        key: "flush",
        value: function flush() {
            if (!this.services.connection.isConnected) {
                // will be handled by resubscribe
                return;
            }
            var subUsers = Array.from(this.pendingSubscribes.keys());
            if (subUsers.length > 0) {
                this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, subUsers);
                this.pendingSubscribes.clear();
            }
            var unsubUsers = Array.from(this.pendingUnsubscribes.keys());
            if (unsubUsers.length > 0) {
                this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, unsubUsers);
                this.pendingUnsubscribes.clear();
            }
            this.flushTimeout = null;
        }
    }, {
        key: "resubscribe",
        value: function resubscribe() {
            var keys = this.subscriptionEmitter.eventNames();
            if (keys.length > 0) {
                this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, keys);
            }
            var hasGlobalSubscription = this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT);
            if (hasGlobalSubscription) {
                this.subscribeToAllChanges();
            }
        }
    }, {
        key: "bulkSubscription",
        value: function bulkSubscription(action, names) {
            var correlationId = this.counter++;
            var message = {
                topic: message_constants_1.TOPIC.PRESENCE,
                action: action,
                correlationId: correlationId.toString(),
                names: names
            };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }, {
        key: "subscribeToAllChanges",
        value: function subscribeToAllChanges() {
            if (!this.services.connection.isConnected) {
                return;
            }
            var message = { topic: message_constants_1.TOPIC.PRESENCE, action: message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }, {
        key: "unsubscribeToAllChanges",
        value: function unsubscribeToAllChanges() {
            if (!this.services.connection.isConnected) {
                return;
            }
            var message = { topic: message_constants_1.TOPIC.PRESENCE, action: message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL };
            this.services.timeoutRegistry.add({ message: message });
            this.services.connection.sendMessage(message);
        }
    }, {
        key: "registerFlushTimeout",
        value: function registerFlushTimeout() {
            if (!this.flushTimeout) {
                this.flushTimeout = this.services.timerRegistry.add({
                    duration: 0,
                    context: this,
                    callback: this.flush
                });
            }
        }
    }]);

    return PresenceHandler;
}();

exports.PresenceHandler = PresenceHandler;

/***/ })
/******/ ]);