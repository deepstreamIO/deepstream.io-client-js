(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("deepstream", [], factory);
	else if(typeof exports === 'object')
		exports["deepstream"] = factory();
	else
		root["deepstream"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
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
    META_KEYS["protocolVersion"] = "x";
    META_KEYS["requestorName"] = "rn";
    META_KEYS["requestorData"] = "rd";
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
    EVENT_ACTIONS[EVENT_ACTIONS["INVALID_LISTEN_REGEX"] = 80] = "INVALID_LISTEN_REGEX";
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
    RECORD_ACTIONS[RECORD_ACTIONS["RECORD_NOT_FOUND"] = 88] = "RECORD_NOT_FOUND";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_VERSION"] = 89] = "INVALID_VERSION";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_PATCH_ON_HOTPATH"] = 90] = "INVALID_PATCH_ON_HOTPATH";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_LISTEN_REGEX"] = 91] = "INVALID_LISTEN_REGEX";
    RECORD_ACTIONS[RECORD_ACTIONS["MESSAGE_PERMISSION_ERROR"] = 96] = "MESSAGE_PERMISSION_ERROR";
    RECORD_ACTIONS[RECORD_ACTIONS["MESSAGE_DENIED"] = 97] = "MESSAGE_DENIED";
    RECORD_ACTIONS[RECORD_ACTIONS["INVALID_MESSAGE_DATA"] = 98] = "INVALID_MESSAGE_DATA";
    RECORD_ACTIONS[RECORD_ACTIONS["MULTIPLE_SUBSCRIPTIONS"] = 99] = "MULTIPLE_SUBSCRIPTIONS";
    RECORD_ACTIONS[RECORD_ACTIONS["NOT_SUBSCRIBED"] = 100] = "NOT_SUBSCRIBED";
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
    EVENT["EXIT_LIMBO"] = "exitLimbo";
    EVENT["CONNECTION_STATE_CHANGED"] = "connectionStateChanged";
    EVENT["CLIENT_DATA_CHANGED"] = "clientDataChanged";
    EVENT["REAUTHENTICATION_FAILURE"] = "reauthenticationFailure";
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
    CONNECTION_STATE["INITIALISING"] = "INITIALISING";
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
    CONNECTION_STATE["PAUSING"] = "PAUSING";
    CONNECTION_STATE["OFFLINE"] = "OFFLINE";
})(CONNECTION_STATE = exports.CONNECTION_STATE || (exports.CONNECTION_STATE = {}));

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(39)
var ieee754 = __webpack_require__(40)
var isArray = __webpack_require__(19)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var URL = __webpack_require__(55);
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
        if (!isCallback(args[startIndex]) && isNestedData(args[startIndex])) {
            result.path = isPath(args[startIndex]) ? args[startIndex] : undefined;
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
            path: isPath(args[startIndex]) ? args[startIndex] : undefined,
            data: isNestedData(args[startIndex + 1]) ? args[startIndex + 1] : undefined,
            callback: isCallback(args[startIndex + 2]) ? args[startIndex + 2] : undefined
        };
    }
    if (result) {
        if (result.path !== undefined && result.path.length === 0 || result.path === undefined && !result.data) {
            throw Error('Invalid set path argument');
        }
        if (result.data === undefined && result.path === undefined) {
            throw Error('Invalid set data argument');
        }
        if (result.callback !== undefined && result.callback === false || result.callback === undefined && args.length === startIndex + 3) {
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
/* 7 */
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

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

var Readable = __webpack_require__(30);
var Writable = __webpack_require__(17);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _exports$ACTION_TO_WR, _message_constants_1$, _message_constants_1$2, _message_constants_1$3, _exports$RESPONSE_TO_;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
function isWriteAck(action) {
    return action === message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK || action === message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT;
}
exports.isWriteAck = isWriteAck;
exports.ACTION_TO_WRITE_ACK = (_exports$ACTION_TO_WR = {}, _defineProperty(_exports$ACTION_TO_WR, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK), _defineProperty(_exports$ACTION_TO_WR, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK), _defineProperty(_exports$ACTION_TO_WR, message_constants_1.RECORD_ACTIONS.PATCH, message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK), _defineProperty(_exports$ACTION_TO_WR, message_constants_1.RECORD_ACTIONS.UPDATE, message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK), _defineProperty(_exports$ACTION_TO_WR, message_constants_1.RECORD_ACTIONS.ERASE, message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK), _exports$ACTION_TO_WR);
/**
 * Like reverseMap but the values will be cast using Number(k)
 */
function reverseMapNumeric(map) {
    var reversedMap = {};
    for (var key in map) {
        reversedMap[map[key]] = Number(key);
    }
    return reversedMap;
}
exports.reverseMapNumeric = reverseMapNumeric;
exports.WRITE_ACK_TO_ACTION = reverseMapNumeric(exports.ACTION_TO_WRITE_ACK);
exports.RESPONSE_TO_REQUEST = (_exports$RESPONSE_TO_ = {}, _defineProperty(_exports$RESPONSE_TO_, message_constants_1.TOPIC.RECORD, (_message_constants_1$ = {}, _defineProperty(_message_constants_1$, message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE, message_constants_1.RECORD_ACTIONS.HEAD), _defineProperty(_message_constants_1$, message_constants_1.RECORD_ACTIONS.READ_RESPONSE, message_constants_1.RECORD_ACTIONS.READ), _defineProperty(_message_constants_1$, message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS, message_constants_1.RECORD_ACTIONS.DELETE), _message_constants_1$)), _defineProperty(_exports$RESPONSE_TO_, message_constants_1.TOPIC.PRESENCE, (_message_constants_1$2 = {}, _defineProperty(_message_constants_1$2, message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE, message_constants_1.PRESENCE_ACTIONS.QUERY), _defineProperty(_message_constants_1$2, message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE, message_constants_1.PRESENCE_ACTIONS.QUERY_ALL), _message_constants_1$2)), _defineProperty(_exports$RESPONSE_TO_, message_constants_1.TOPIC.RPC, (_message_constants_1$3 = {}, _defineProperty(_message_constants_1$3, message_constants_1.RPC_ACTIONS.ACCEPT, message_constants_1.RPC_ACTIONS.REQUEST), _defineProperty(_message_constants_1$3, message_constants_1.RPC_ACTIONS.ERROR, message_constants_1.RPC_ACTIONS.REQUEST), _message_constants_1$3)), _defineProperty(_exports$RESPONSE_TO_, message_constants_1.TOPIC.EVENT, {}), _exports$RESPONSE_TO_);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
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

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ }),
/* 12 */
/***/ (function(module, exports) {



/***/ }),
/* 13 */
/***/ (function(module, exports) {

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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(30);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(17);
exports.Duplex = __webpack_require__(7);
exports.Transform = __webpack_require__(34);
exports.PassThrough = __webpack_require__(92);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(5)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
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

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(91)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(31);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(16).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = __webpack_require__(32);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(7);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(89).setImmediate, __webpack_require__(4)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(97);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(98);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(2)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(21);
var util = __webpack_require__(9);
var ArraySet = __webpack_require__(22).ArraySet;
var MappingList = __webpack_require__(43).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(42);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(9);
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
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

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
/* tslint:disable:no-bitwise */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(25);
var utils_1 = __webpack_require__(10);
var message_validator_1 = __webpack_require__(26);
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
    // mask out uppermost bit(ACK)
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
        var metaError = message_validator_1.validateMeta(topic, rawAction, meta);
        if (metaError) {
            throw new Error("invalid meta " + message_constants_1.TOPIC[message.topic] + " " + message_constants_1.ACTIONS[message.topic][message.action] + ": " + metaError);
            // return {
            //   parseError: true,
            //   action: PARSER_ACTIONS.INVALID_META_PARAMS,
            //   parsedMessage: message,
            //   description: 'invalid ack'
            // }
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
    if (message.topic === message_constants_1.TOPIC.RECORD && utils_1.isWriteAck(rawAction)) {
        message.isWriteAck = true;
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_LENGTH = 8;
exports.META_PAYLOAD_OVERFLOW_LENGTH = Math.pow(2, 24) - 1;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _message_constants_1$, _message_constants_1$2, _message_constants_1$3, _message_constants_1$4, _message_constants_1$5, _message_constants_1$6, _message_constants_1$7, _exports$META_PARAMS_, _payloadMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
/*
 * Specification of  fields within Meta Params used for message validation
 * (see `validateMeta`)
 *
 * META_PARAMS_SPEC[topic][action] => [required, optional]
 * The keys in `required` must be present in all instances of the message
 * The keys in `optional` may be present in some instances of the message
 */
exports.META_PARAMS_SPEC = (_exports$META_PARAMS_ = {}, _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.PARSER, (_message_constants_1$ = {}, _defineProperty(_message_constants_1$, message_constants_1.PARSER_ACTIONS.UNKNOWN_TOPIC, [[message_constants_1.META_KEYS.originalTopic], []]), _defineProperty(_message_constants_1$, message_constants_1.PARSER_ACTIONS.UNKNOWN_ACTION, [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []]), _defineProperty(_message_constants_1$, message_constants_1.PARSER_ACTIONS.INVALID_MESSAGE, [[], []]), _defineProperty(_message_constants_1$, message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS, [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []]), _message_constants_1$)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.CONNECTION, (_message_constants_1$2 = {}, _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.PING, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.PONG, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.CHALLENGE, [[message_constants_1.META_KEYS.url, message_constants_1.META_KEYS.protocolVersion], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.ACCEPT, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.REJECT, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.REDIRECT, [[message_constants_1.META_KEYS.url], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.CLOSING, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.CLOSED, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.ERROR, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.AUTHENTICATION_TIMEOUT, [[], []]), _defineProperty(_message_constants_1$2, message_constants_1.CONNECTION_ACTIONS.INVALID_MESSAGE, [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []]), _message_constants_1$2)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.AUTH, (_message_constants_1$3 = {}, _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.REQUEST, [[], []]), _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL, [[], []]), _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL, [[], []]), _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.TOO_MANY_AUTH_ATTEMPTS, [[], []]), _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.INVALID_MESSAGE, [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []]), _defineProperty(_message_constants_1$3, message_constants_1.AUTH_ACTIONS.INVALID_MESSAGE_DATA, [[message_constants_1.META_KEYS.originalAction], []]), _message_constants_1$3)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.RECORD, (_message_constants_1$4 = {}, _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.MULTIPLE_SUBSCRIPTIONS, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.NOT_SUBSCRIBED, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.HEAD, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDHEAD, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.READ, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDREAD, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.READ_RESPONSE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UPDATE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.PATCH, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.ERASE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDUPDATE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.DELETE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.DELETED, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.VERSION_EXISTS, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], [message_constants_1.META_KEYS.originalAction]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.CACHE_RETRIEVAL_TIMEOUT, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.STORAGE_RETRIEVAL_TIMEOUT, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.RECORD_LOAD_ERROR, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.RECORD_CREATE_ERROR, [[message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.RECORD_UPDATE_ERROR, [[message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.RECORD_DELETE_ERROR, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.RECORD_NOT_FOUND, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.INVALID_VERSION, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.INVALID_PATCH_ON_HOTPATH, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.LISTEN, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.LISTEN_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UNLISTEN, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.UNLISTEN_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.LISTEN_ACCEPT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.LISTEN_REJECT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.INVALID_LISTEN_REGEX, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.MESSAGE_PERMISSION_ERROR, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$4, message_constants_1.RECORD_ACTIONS.INVALID_MESSAGE_DATA, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]]), _message_constants_1$4)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.RPC, (_message_constants_1$5 = {}, _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.REQUEST_ERROR, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], [message_constants_1.META_KEYS.reason]]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.REQUEST, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], [message_constants_1.META_KEYS.requestorName, message_constants_1.META_KEYS.requestorData]]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.ACCEPT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.REJECT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.RESPONSE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.PROVIDE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.PROVIDE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.UNPROVIDE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.UNPROVIDE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.MULTIPLE_PROVIDERS, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.NOT_PROVIDED, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.MULTIPLE_RESPONSE, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.INVALID_RPC_CORRELATION_ID, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.MULTIPLE_ACCEPT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.NO_RPC_PROVIDER, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.MESSAGE_PERMISSION_ERROR, [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.MESSAGE_DENIED, [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$5, message_constants_1.RPC_ACTIONS.INVALID_MESSAGE_DATA, [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]]), _message_constants_1$5)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.EVENT, (_message_constants_1$6 = {}, _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.EMIT, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.SUBSCRIBE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.SUBSCRIBE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.MULTIPLE_SUBSCRIPTIONS, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.NOT_SUBSCRIBED, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.MESSAGE_PERMISSION_ERROR, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.LISTEN, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.LISTEN_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.UNLISTEN, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.UNLISTEN_ACK, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.LISTEN_ACCEPT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.LISTEN_REJECT, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.INVALID_LISTEN_REGEX, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.MESSAGE_PERMISSION_ERROR, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$6, message_constants_1.EVENT_ACTIONS.INVALID_MESSAGE_DATA, [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], []]), _message_constants_1$6)), _defineProperty(_exports$META_PARAMS_, message_constants_1.TOPIC.PRESENCE, (_message_constants_1$7 = {}, _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ACK, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL, [[], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL_ACK, [[], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ACK, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL_ACK, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.NOT_SUBSCRIBED, [[], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.MULTIPLE_SUBSCRIPTIONS, [[], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction]]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.QUERY, [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE, [[message_constants_1.META_KEYS.correlationId], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.QUERY_ALL, [[], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE, [[message_constants_1.META_KEYS.names], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL, [[message_constants_1.META_KEYS.name], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.INVALID_PRESENCE_USERS, [[], []]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.MESSAGE_PERMISSION_ERROR, [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]]), _defineProperty(_message_constants_1$7, message_constants_1.PRESENCE_ACTIONS.MESSAGE_DENIED, [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.name]]), _message_constants_1$7)), _exports$META_PARAMS_);
var payloadMap = (_payloadMap = {}, _defineProperty(_payloadMap, message_constants_1.TOPIC.PARSER, [message_constants_1.PARSER_ACTIONS.MESSAGE_PARSE_ERROR, message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS]), _defineProperty(_payloadMap, message_constants_1.TOPIC.AUTH, [message_constants_1.AUTH_ACTIONS.REQUEST, message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL, message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL]), _defineProperty(_payloadMap, message_constants_1.TOPIC.RECORD, [message_constants_1.RECORD_ACTIONS.READ_RESPONSE, message_constants_1.RECORD_ACTIONS.UPDATE, message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.PATCH, message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE, message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH, message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK, message_constants_1.RECORD_ACTIONS.VERSION_EXISTS]), _defineProperty(_payloadMap, message_constants_1.TOPIC.RPC, [message_constants_1.RPC_ACTIONS.REQUEST, message_constants_1.RPC_ACTIONS.RESPONSE, message_constants_1.RPC_ACTIONS.REQUEST_ERROR]), _defineProperty(_payloadMap, message_constants_1.TOPIC.EVENT, [message_constants_1.EVENT_ACTIONS.EMIT]), _defineProperty(_payloadMap, message_constants_1.TOPIC.PRESENCE, [message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE]), _payloadMap);
function mapOfArraysHas(map, topic, action) {
    var actions = map[topic];
    if (!actions) {
        return false;
    }
    return actions.indexOf(action) !== -1;
}
exports.hasPayload = function (topic, action) {
    return mapOfArraysHas(payloadMap, topic, action);
};
function validateMeta(topic, action, meta) {
    var spec = exports.META_PARAMS_SPEC[topic][action];
    if (!spec) {
        return 'no meta spec';
    }

    var _spec = _slicedToArray(spec, 2),
        required = _spec[0],
        optional = _spec[1];

    for (var key in meta) {
        if (meta[key] !== undefined && required.indexOf(key) === -1 && optional.indexOf(key) === -1) {
            return "meta object has unknown key " + key;
        }
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = required[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var req = _step.value;

            if (meta[req] === undefined) {
                return "meta object does not have required key " + req;
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

    return;
}
exports.validateMeta = validateMeta;
function hasCorrelationId(topic, action) {
    var spec = exports.META_PARAMS_SPEC[topic][action];
    if (!spec) {
        return;
    }

    var _spec2 = _slicedToArray(spec, 2),
        required = _spec2[0],
        optional = _spec2[1];

    return required.indexOf(message_constants_1.META_KEYS.correlationId) !== -1 || optional.indexOf(message_constants_1.META_KEYS.correlationId) !== -1;
}
exports.hasCorrelationId = hasCorrelationId;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var StateMachine = function () {
    function StateMachine(logger, stateMachine) {
        _classCallCheck(this, StateMachine);

        this.inEndState = false;
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
/* 28 */
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
            if (message.isAck) {
                this.services.timeoutRegistry.remove(message);
                return;
            }
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(12)

module.exports = clone(fs)

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(19);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(13).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(31);
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = __webpack_require__(16).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(87);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(88);
var destroyImpl = __webpack_require__(32);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(33).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(7);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(33).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(2)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13).EventEmitter;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

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

var Buffer = __webpack_require__(5).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 34 */
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

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(7);

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = bindActor
function bindActor () {
  var args = 
        Array.prototype.slice.call
        (arguments) // jswtf.
    , obj = null
    , fn
  if (typeof args[0] === "object") {
    obj = args.shift()
    fn = args.shift()
    if (typeof fn === "string")
      fn = obj[ fn ]
  } else fn = args.shift()
  return function (cb) {
    fn.apply(obj, args.concat(cb)) }
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(37);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(38).install();
var client_1 = __webpack_require__(48);
var constants_1 = __webpack_require__(1);
var C = __webpack_require__(0);
var client = function client(url, options) {
    return new client_1.Client(url, options);
};
module.exports = Object.assign(client, {
    CONNECTION_STATE: constants_1.CONNECTION_STATE,
    C: C,
    EVENT: constants_1.EVENT,
    deepstream: client
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Buffer) {var SourceMapConsumer = __webpack_require__(41).SourceMapConsumer;
var path = __webpack_require__(23);

var fs;
try {
  fs = __webpack_require__(12);
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = null;
  if (!fs) {
    // Use SJAX if we are in the browser
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    var contents = null
    if (xhr.readyState === 4 && xhr.status === 200) {
      contents = xhr.responseText
    }
  } else if (fs.existsSync(path)) {
    // Otherwise, use the filesystem
    try {
      contents = fs.readFileSync(path, 'utf8');
    } catch (er) {
      contents = '';
    }
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = new Buffer(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map) {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame) {
  if(frame.isNative()) {
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    var headerLength = 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    frame = cloneCallSite(frame);
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  return error + stack.map(function(frame) {
    return '\n    at ' + wrapCallSite(frame);
  }).join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      try {
        contents = fs.readFileSync(source, 'utf8');
      } catch (er) {
        contents = '';
      }
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  process.exit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    var Module;
    try {
      Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    } catch (err) {
      // NOP: Loading in catch block to convert webpack error to warning.
    }
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(5).Buffer))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 40 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(20).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(44).SourceMapConsumer;
exports.SourceNode = __webpack_require__(47).SourceNode;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(9);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(9);
var binarySearch = __webpack_require__(45);
var ArraySet = __webpack_require__(22).ArraySet;
var base64VLQ = __webpack_require__(21);
var quickSort = __webpack_require__(46).quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(20).SourceMapGenerator;
var util = __webpack_require__(9);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var client_options_1 = __webpack_require__(49);
var logger_1 = __webpack_require__(51);
var timeout_registry_1 = __webpack_require__(52);
var timer_registry_1 = __webpack_require__(53);
var connection_1 = __webpack_require__(54);
var socket_factory_1 = __webpack_require__(62);
var event_handler_1 = __webpack_require__(65);
var rpc_handler_1 = __webpack_require__(66);
var record_handler_1 = __webpack_require__(69);
var storage_service_1 = __webpack_require__(79);
var presence_handler_1 = __webpack_require__(104);
var EventEmitter = __webpack_require__(3);

var Client = function (_EventEmitter) {
    _inherits(Client, _EventEmitter);

    function Client(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

        _this.options = Object.assign({}, client_options_1.DefaultOptions, options);
        var services = {};
        services.storage = options.storage || new storage_service_1.Storage(_this.options);
        services.logger = new logger_1.Logger(_this);
        services.timerRegistry = new timer_registry_1.TimerRegistry();
        services.timeoutRegistry = new timeout_registry_1.TimeoutRegistry(services, _this.options);
        services.socketFactory = options.socketFactory || socket_factory_1.socketFactory;
        services.connection = new connection_1.Connection(services, _this.options, url, _this);
        _this.services = services;
        _this.services.connection.onLost(services.timeoutRegistry.onConnectionLost.bind(services.timeoutRegistry));
        _this.event = new event_handler_1.EventHandler(_this.services, _this.options);
        _this.rpc = new rpc_handler_1.RPCHandler(_this.services, _this.options);
        _this.record = new record_handler_1.RecordHandler(_this.services, _this.options);
        _this.presence = new presence_handler_1.PresenceHandler(_this.services, _this.options);
        return _this;
    }

    _createClass(Client, [{
        key: "login",
        value: function login(detailsOrCallback, callback) {
            var _this2 = this;

            if (detailsOrCallback && (typeof detailsOrCallback === "undefined" ? "undefined" : _typeof(detailsOrCallback)) === 'object') {
                if (callback) {
                    this.services.connection.authenticate(detailsOrCallback, callback);
                } else {
                    return new Promise(function (resolve, reject) {
                        _this2.services.connection.authenticate(detailsOrCallback, function (success, data) {
                            success ? resolve(data) : reject(data);
                        });
                    });
                }
            } else {
                if (typeof detailsOrCallback === 'function') {
                    this.services.connection.authenticate({}, detailsOrCallback);
                } else {
                    return new Promise(function (resolve, reject) {
                        _this2.services.connection.authenticate({}, function (success, data) {
                            success ? resolve(data) : reject(data);
                        });
                    });
                }
            }
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
    }, {
        key: "pause",
        value: function pause() {
            this.services.connection.pause();
        }
    }, {
        key: "resume",
        value: function resume(callback) {
            var _this3 = this;

            if (callback) {
                this.services.connection.resume(callback);
                return;
            }
            return new Promise(function (resolve, reject) {
                _this3.services.connection.resume(function (error) {
                    error ? reject(error) : resolve();
                });
            });
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

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var merge_strategy_1 = __webpack_require__(50);
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
    offlineBufferTimeout: 2000,
    discardTimeout: 5000,
    path: '/deepstream',
    mergeStrategy: merge_strategy_1.REMOTE_WINS,
    recordDeepCopy: true,
    socketOptions: null,
    dirtyStorageName: '__ds__dirty_records',
    nodeStoragePath: './local-storage',
    nodeStorageSize: 5,
    lazyConnect: false
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Choose the server's state over the client's
**/
exports.REMOTE_WINS = function (localValue, localVersion, remoteValue, remoteVersion, callback) {
  callback(null, remoteValue);
};
/**
 *  Choose the local state over the server's
**/
exports.LOCAL_WINS = function (localValue, localVersion, remoteValue, remoteVersion, callback) {
  callback(null, localValue);
};

/***/ }),
/* 51 */
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
            var warnMessage = "Warning: " + message_constants_1.TOPIC[message.topic];
            var action = message.action;
            if (action) {
                warnMessage += " (" + message_constants_1.ACTIONS[message.topic][action] + ")";
            }
            if (event) {
                warnMessage += ": " + constants_1.EVENT[event];
            }
            if (meta) {
                warnMessage += " \u2013 " + (typeof meta === 'string' ? meta : JSON.stringify(meta));
            }
            console.warn(warnMessage);
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(10);
var EventEmitter = __webpack_require__(3);
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
            var requestMsg = void 0;
            var action = utils_1.RESPONSE_TO_REQUEST[message.topic][message.action];
            if (!action) {
                requestMsg = message;
            } else {
                requestMsg = Object.assign({}, message, { action: action });
            }
            var uniqueName = this.getUniqueName(requestMsg);
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
                        this.services.timerRegistry.remove(timerId);
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

                    var _ref4 = _slicedToArray(_ref3, 1);

                    var timerId = _ref4[0];

                    clearTimeout(timerId);
                    this.register.delete(timerId);
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
/* 53 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var message_parser_1 = __webpack_require__(24);
var state_machine_1 = __webpack_require__(27);
var utils = __webpack_require__(6);
var Emitter = __webpack_require__(3);

var Connection = function () {
    function Connection(services, options, url, emitter) {
        var _this = this;

        _classCallCheck(this, Connection);

        this.options = options;
        this.services = services;
        this.authParams = null;
        this.handlers = new Map();
        // tslint:disable-next-line:no-empty
        this.authCallback = null;
        this.resumeCallback = null;
        this.emitter = emitter;
        this.internalEmitter = new Emitter();
        this.isInLimbo = true;
        var isReconnecting = false;
        var firstOpen = true;
        this.stateMachine = new state_machine_1.StateMachine(this.services.logger, {
            init: constants_1.CONNECTION_STATE.CLOSED,
            onStateChanged: function onStateChanged(newState, oldState) {
                if (newState === oldState) {
                    return;
                }
                emitter.emit(constants_1.EVENT.CONNECTION_STATE_CHANGED, newState);
                if (newState === constants_1.CONNECTION_STATE.RECONNECTING) {
                    _this.isInLimbo = true;
                    isReconnecting = true;
                    if (oldState !== constants_1.CONNECTION_STATE.CLOSED) {
                        _this.internalEmitter.emit(constants_1.EVENT.CONNECTION_LOST);
                        _this.limboTimeout = _this.services.timerRegistry.add({
                            duration: _this.options.offlineBufferTimeout,
                            context: _this,
                            callback: function callback() {
                                _this.isInLimbo = false;
                                _this.internalEmitter.emit(constants_1.EVENT.EXIT_LIMBO);
                            }
                        });
                    }
                } else if (newState === constants_1.CONNECTION_STATE.OPEN && (isReconnecting || firstOpen)) {
                    firstOpen = false;
                    _this.isInLimbo = false;
                    _this.internalEmitter.emit(constants_1.EVENT.CONNECTION_REESTABLISHED);
                    _this.services.timerRegistry.remove(_this.limboTimeout);
                }
            },
            transitions: [{ name: "initialised" /* INITIALISED */, from: constants_1.CONNECTION_STATE.CLOSED, to: constants_1.CONNECTION_STATE.INITIALISING }, { name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.INITIALISING, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.REDIRECTING, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "connected" /* CONNECTED */, from: constants_1.CONNECTION_STATE.RECONNECTING, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION }, { name: "challenge" /* CHALLENGE */, from: constants_1.CONNECTION_STATE.AWAITING_CONNECTION, to: constants_1.CONNECTION_STATE.CHALLENGING }, { name: "redirected" /* CONNECTION_REDIRECTED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.REDIRECTING }, { name: "challenge-denied" /* CHALLENGE_DENIED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.CHALLENGE_DENIED }, { name: "accepted" /* CHALLENGE_ACCEPTED */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, handler: this.onAwaitingAuthentication.bind(this) }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_CONNECTION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "authenticate" /* AUTHENTICATE */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATING }, { name: "unsuccesful-login" /* UNSUCCESFUL_LOGIN */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION }, { name: "succesful-login" /* SUCCESFUL_LOGIN */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.OPEN }, { name: "too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */, from: constants_1.CONNECTION_STATE.AUTHENTICATING, to: constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS }, { name: "too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS }, { name: "authentication-timeout" /* AUTHENTICATION_TIMEOUT */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT }, { name: "reconnect" /* RECONNECT */, from: constants_1.CONNECTION_STATE.RECONNECTING, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "closed" /* CLOSED */, from: constants_1.CONNECTION_STATE.CLOSING, to: constants_1.CONNECTION_STATE.CLOSED }, { name: "offline" /* OFFLINE */, from: constants_1.CONNECTION_STATE.PAUSING, to: constants_1.CONNECTION_STATE.OFFLINE }, { name: "error" /* ERROR */, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "connection-lost" /* LOST */, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "resume" /* RESUME */, to: constants_1.CONNECTION_STATE.RECONNECTING }, { name: "pause" /* PAUSE */, to: constants_1.CONNECTION_STATE.PAUSING }, { name: "close" /* CLOSE */, to: constants_1.CONNECTION_STATE.CLOSING }]
        });
        this.stateMachine.transition("initialised" /* INITIALISED */);
        this.originalUrl = utils.parseUrl(url, this.options.path);
        this.url = this.originalUrl;
        if (!options.lazyConnect) {
            this.createEndpoint();
        }
    }

    _createClass(Connection, [{
        key: "onLost",
        value: function onLost(callback) {
            this.internalEmitter.on(constants_1.EVENT.CONNECTION_LOST, callback);
        }
    }, {
        key: "removeOnLost",
        value: function removeOnLost(callback) {
            this.internalEmitter.off(constants_1.EVENT.CONNECTION_LOST, callback);
        }
    }, {
        key: "onReestablished",
        value: function onReestablished(callback) {
            this.internalEmitter.on(constants_1.EVENT.CONNECTION_REESTABLISHED, callback);
        }
    }, {
        key: "removeOnReestablished",
        value: function removeOnReestablished(callback) {
            this.internalEmitter.off(constants_1.EVENT.CONNECTION_REESTABLISHED, callback);
        }
    }, {
        key: "onExitLimbo",
        value: function onExitLimbo(callback) {
            this.internalEmitter.on(constants_1.EVENT.EXIT_LIMBO, callback);
        }
    }, {
        key: "registerHandler",
        value: function registerHandler(topic, callback) {
            this.handlers.set(topic, callback);
        }
    }, {
        key: "sendMessage",
        value: function sendMessage(message) {
            if (!this.isOpen()) {
                this.services.logger.error(message, constants_1.EVENT.IS_CLOSED);
                return;
            }
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
        value: function authenticate(authParamsOrCallback, callback) {
            if (authParamsOrCallback && (typeof authParamsOrCallback === "undefined" ? "undefined" : _typeof(authParamsOrCallback)) !== 'object' && typeof authParamsOrCallback !== 'function') {
                throw new Error('invalid argument authParamsOrCallback');
            }
            if (callback && typeof callback !== 'function') {
                throw new Error('invalid argument callback');
            }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.CHALLENGE_DENIED || this.stateMachine.state === constants_1.CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS || this.stateMachine.state === constants_1.CONNECTION_STATE.AUTHENTICATION_TIMEOUT) {
                this.services.logger.error({ topic: message_constants_1.TOPIC.CONNECTION }, constants_1.EVENT.IS_CLOSED);
                return;
            }
            if (authParamsOrCallback) {
                this.authParams = (typeof authParamsOrCallback === "undefined" ? "undefined" : _typeof(authParamsOrCallback)) === 'object' ? authParamsOrCallback : {};
            }
            if (authParamsOrCallback && typeof authParamsOrCallback === 'function') {
                this.authCallback = authParamsOrCallback;
            } else if (callback) {
                this.authCallback = callback;
            } else {
                this.authCallback = function () {};
            }
            // if (this.stateMachine.state === CONNECTION_STATE.CLOSED && !this.endpoint) {
            //   this.createEndpoint()
            //   return
            // }
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION && this.authParams) {
                this.sendAuthParams();
            }
            if (!this.endpoint) {
                this.createEndpoint();
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
    }, {
        key: "isOpen",
        value: function isOpen() {
            var connState = this.getConnectionState();
            return connState !== constants_1.CONNECTION_STATE.CLOSED && connState !== constants_1.CONNECTION_STATE.ERROR && connState !== constants_1.CONNECTION_STATE.CLOSING;
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
    }, {
        key: "pause",
        value: function pause() {
            this.stateMachine.transition("pause" /* PAUSE */);
            this.services.timerRegistry.remove(this.heartbeatInterval);
            this.endpoint.close();
        }
    }, {
        key: "resume",
        value: function resume(callback) {
            this.stateMachine.transition("resume" /* RESUME */);
            this.resumeCallback = callback;
            this.tryReconnect();
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
            this.sendMessage({
                topic: message_constants_1.TOPIC.CONNECTION,
                action: message_constants_1.CONNECTION_ACTIONS.CHALLENGE,
                url: this.originalUrl,
                protocolVersion: '0.1a'
            });
            this.stateMachine.transition("challenge" /* CHALLENGE */);
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
            if (this.stateMachine.state === constants_1.CONNECTION_STATE.PAUSING) {
                this.stateMachine.transition("offline" /* OFFLINE */);
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
                if (this.getConnectionState() !== constants_1.CONNECTION_STATE.CLOSING && this.getConnectionState() !== constants_1.CONNECTION_STATE.PAUSING) {
                    this.sendMessage({ topic: message_constants_1.TOPIC.CONNECTION, action: message_constants_1.CONNECTION_ACTIONS.PONG });
                }
                return;
            }
            if (message.action === message_constants_1.CONNECTION_ACTIONS.ACCEPT) {
                this.stateMachine.transition("accepted" /* CHALLENGE_ACCEPTED */);
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
                this.stateMachine.transition("too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */);
                this.services.logger.error(message);
                return;
            }
            if (message.action === message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL) {
                this.stateMachine.transition("unsuccesful-login" /* UNSUCCESFUL_LOGIN */);
                this.onAuthUnSuccessful();
                return;
            }
            if (message.action === message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL) {
                this.stateMachine.transition("succesful-login" /* SUCCESFUL_LOGIN */);
                this.onAuthSuccessful(message.parsedData);
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
    }, {
        key: "onAuthSuccessful",
        value: function onAuthSuccessful(clientData) {
            this.updateClientData(clientData);
            if (this.resumeCallback) {
                this.resumeCallback();
                this.resumeCallback = null;
            }
            if (this.authCallback === null) {
                return;
            }
            this.authCallback(true, this.clientData);
            this.authCallback = null;
        }
    }, {
        key: "onAuthUnSuccessful",
        value: function onAuthUnSuccessful() {
            var reason = { reason: constants_1.EVENT[constants_1.EVENT.INVALID_AUTHENTICATION_DETAILS] };
            if (this.resumeCallback) {
                this.resumeCallback(reason);
                this.resumeCallback = null;
            }
            if (this.authCallback === null) {
                this.emitter.emit(constants_1.EVENT.REAUTHENTICATION_FAILURE, reason);
                return;
            }
            this.authCallback(false, reason);
            this.authCallback = null;
        }
    }, {
        key: "updateClientData",
        value: function updateClientData(data) {
            var newClientData = data || null;
            if (this.clientData === undefined && (newClientData === null || Object.keys(newClientData).length === 0)) {
                return;
            }
            if (!utils.deepEquals(this.clientData, data)) {
                this.emitter.emit(constants_1.EVENT.CLIENT_DATA_CHANGED, Object.assign({}, newClientData));
                this.clientData = newClientData;
            }
        }
    }, {
        key: "isConnected",
        get: function get() {
            return this.stateMachine.state === constants_1.CONNECTION_STATE.OPEN;
        }
    }]);

    return Connection;
}();

exports.Connection = Connection;

/***/ }),
/* 55 */
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



var punycode = __webpack_require__(56);
var util = __webpack_require__(58);

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
    querystring = __webpack_require__(59);

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
/* 56 */
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
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)(module), __webpack_require__(4)))

/***/ }),
/* 57 */
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
/* 58 */
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
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(60);
exports.encode = exports.stringify = __webpack_require__(61);


/***/ }),
/* 60 */
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
/* 61 */
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Buffer) {

Object.defineProperty(exports, "__esModule", { value: true });
var message_parser_1 = __webpack_require__(24);
var message_builder_1 = __webpack_require__(63);
var message_constants_1 = __webpack_require__(0);
var BrowserWebsocket = global.WebSocket || global.MozWebSocket;
var NodeWebSocket = __webpack_require__(64);
exports.socketFactory = function (url, options) {
    var socket = BrowserWebsocket ? new BrowserWebsocket(url, [], options) : new NodeWebSocket(url, options);
    if (BrowserWebsocket) {
        socket.binaryType = 'arraybuffer';
    }
    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = function () {};
    socket.onmessage = function (raw) {
        var parseResults = message_parser_1.parse(BrowserWebsocket ? new Buffer(new Uint8Array(raw.data)) : raw.data);
        socket.onparsedmessages(parseResults);
    };
    socket.sendParsedMessage = function (message) {
        if (message.topic === message_constants_1.TOPIC.CONNECTION && message.action === message_constants_1.CONNECTION_ACTIONS.CLOSING) {
            socket.onparsedmessages([{ topic: message_constants_1.TOPIC.CONNECTION, action: message_constants_1.CONNECTION_ACTIONS.CLOSED }]);
            socket.close();
            return;
        }
        message.data = JSON.stringify(message.parsedData);
        // if (message.action !== CONNECTION_ACTIONS.PONG && message.action !== CONNECTION_ACTIONS.PING) {
        //     console.log('>>>', TOPIC[message.topic], (ACTIONS as any)[message.topic][message.action], message.parsedData, message.data, message.name)
        // }
        socket.send(message_builder_1.getMessage(message, false));
    };
    return socket;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(5).Buffer))

/***/ }),
/* 63 */
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
var utils_1 = __webpack_require__(10);
var constants_1 = __webpack_require__(25);
var message_validator_1 = __webpack_require__(26);
function getMessage(msg, isAck) {
    var message = msg;
    var action = message.action;
    // convert action to write ack if necessary
    if (message.isWriteAck && !utils_1.isWriteAck(message.action)) {
        action = utils_1.ACTION_TO_WRITE_ACK[message.action];
    }
    if (message.isAck || isAck) {
        action |= 0x80;
        if (message_constants_1.ACTIONS[message.topic][message.action] === undefined) {
            throw new Error("message " + message_constants_1.TOPIC[message.topic] + " " + message.action + " should not have an ack");
        }
    }
    var meta = Object.create(null);
    for (var key in message_constants_1.META_KEYS) {
        meta[message_constants_1.META_KEYS[key]] = message[key];
    }
    if (meta[message_constants_1.META_KEYS.payloadEncoding] === message_constants_1.PAYLOAD_ENCODING.JSON) {
        delete meta[message_constants_1.META_KEYS.payloadEncoding];
    }
    var metaError = message_validator_1.validateMeta(message.topic, action, meta);
    if (metaError) {
        throw new Error("invalid " + message_constants_1.TOPIC[message.topic] + " " + (message_constants_1.ACTIONS[message.topic][action] || action) + ": " + metaError);
    }
    var metaStr = JSON.stringify(meta);
    var metaBuff = metaStr === '{}' ? null : Buffer.from(metaStr, 'utf8');
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ }),
/* 64 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var listener_1 = __webpack_require__(28);
var Emitter = __webpack_require__(3);

var EventHandler = function () {
    function EventHandler(services, options, listeners) {
        _classCallCheck(this, EventHandler);

        this.services = services;
        this.listeners = listeners || new listener_1.Listener(message_constants_1.TOPIC.EVENT, services);
        this.emitter = new Emitter();
        this.limboQueue = [];
        this.services.connection.registerHandler(message_constants_1.TOPIC.EVENT, this.handle.bind(this));
        this.services.connection.onExitLimbo(this.onExitLimbo.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
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
                if (this.services.connection.isConnected) {
                    this.sendSubscriptionMessage(name);
                }
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
            var message = {
                topic: message_constants_1.TOPIC.EVENT,
                action: message_constants_1.EVENT_ACTIONS.EMIT,
                name: name,
                parsedData: data
            };
            if (this.services.connection.isConnected) {
                this.services.connection.sendMessage(message);
            } else if (this.services.connection.isInLimbo) {
                this.limboQueue.push(message);
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
            if (message.action === message_constants_1.EVENT_ACTIONS.MULTIPLE_SUBSCRIPTIONS) {
                this.services.timeoutRegistry.remove(Object.assign({}, message, {
                    action: message_constants_1.EVENT_ACTIONS.SUBSCRIBE
                }));
                this.services.logger.warn(message);
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.NOT_SUBSCRIBED) {
                this.services.timeoutRegistry.remove(Object.assign({}, message, {
                    action: message_constants_1.EVENT_ACTIONS.SUBSCRIBE
                }));
                this.services.logger.warn(message);
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND || message.action === message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
                this.listeners.handle(message);
                return;
            }
            if (message.action === message_constants_1.EVENT_ACTIONS.INVALID_LISTEN_REGEX) {
                this.services.logger.error(message);
                return;
            }
            this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
        }
        /**
         * Resubscribes to events when connection is lost
         */

    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
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

            for (var i = 0; i < this.limboQueue.length; i++) {
                this.services.connection.sendMessage(this.limboQueue[i]);
            }
            this.limboQueue = [];
        }
    }, {
        key: "onExitLimbo",
        value: function onExitLimbo() {
            this.limboQueue = [];
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var rpc_1 = __webpack_require__(67);
var rpc_response_1 = __webpack_require__(68);
var utils_1 = __webpack_require__(6);

var RPCHandler = function () {
    function RPCHandler(services, options) {
        _classCallCheck(this, RPCHandler);

        this.services = services;
        this.options = options;
        this.rpcs = new Map();
        this.providers = new Map();
        this.limboQueue = [];
        this.services.connection.registerHandler(message_constants_1.TOPIC.RPC, this.handle.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
        this.services.connection.onExitLimbo(this.onExitLimbo.bind(this));
        this.services.connection.onLost(this.onConnectionLost.bind(this));
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
            var correlationId = utils_1.getUid();
            if (this.services.connection.isConnected) {
                if (callback) {
                    this.rpcs.set(correlationId, new rpc_1.RPC(name, correlationId, data, callback, this.options, this.services));
                    return;
                }
                return new Promise(function (resolve, reject) {
                    _this.rpcs.set(correlationId, new rpc_1.RPC(name, correlationId, data, function (error, result) {
                        return error ? reject(error) : resolve(result);
                    }, _this.options, _this.services));
                });
            } else if (this.services.connection.isInLimbo) {
                if (callback) {
                    this.limboQueue.push({ correlationId: correlationId, name: name, data: data, callback: callback });
                } else {
                    return new Promise(function (resolve, reject) {
                        _this.limboQueue.push({ correlationId: correlationId, name: name, data: data, callback: function callback(error, result) {
                                return error ? reject(error) : resolve(result);
                            } });
                    });
                }
            } else {
                if (callback) {
                    callback(constants_1.EVENT.CLIENT_OFFLINE);
                } else {
                    return Promise.reject(constants_1.EVENT.CLIENT_OFFLINE);
                }
            }
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
    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.providers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 1);

                    var name = _ref2[0];

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

            for (var i = 0; i < this.limboQueue.length; i++) {
                var _limboQueue$i = this.limboQueue[i],
                    correlationId = _limboQueue$i.correlationId,
                    _name = _limboQueue$i.name,
                    data = _limboQueue$i.data,
                    callback = _limboQueue$i.callback;

                this.rpcs.set(correlationId, new rpc_1.RPC(_name, correlationId, data, callback, this.options, this.services));
            }
            this.limboQueue = [];
        }
    }, {
        key: "onExitLimbo",
        value: function onExitLimbo() {
            for (var i = 0; i < this.limboQueue.length; i++) {
                this.limboQueue[i].callback(constants_1.EVENT.CLIENT_OFFLINE);
            }
            this.limboQueue = [];
        }
    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            this.rpcs.forEach(function (rpc) {
                rpc.error(constants_1.EVENT.CLIENT_OFFLINE);
            });
            this.rpcs.clear();
        }
    }]);

    return RPCHandler;
}();

exports.RPCHandler = RPCHandler;

/***/ }),
/* 67 */
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
    function RPC(name, correlationId, data, response, options, services) {
        _classCallCheck(this, RPC);

        this.options = options;
        this.services = services;
        this.name = name;
        this.correlationId = correlationId;
        this.response = response;
        var message = {
            topic: message_constants_1.TOPIC.RPC,
            action: message_constants_1.RPC_ACTIONS.REQUEST,
            correlationId: correlationId,
            name: name,
            parsedData: data
        };
        this.acceptTimeout = this.services.timeoutRegistry.add({
            message: {
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.ACCEPT,
                name: this.name,
                correlationId: this.correlationId
            },
            event: message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT,
            duration: this.options.rpcAcceptTimeout,
            callback: this.onTimeout.bind(this)
        });
        this.responseTimeout = this.services.timeoutRegistry.add({
            message: {
                topic: message_constants_1.TOPIC.RPC,
                action: message_constants_1.RPC_ACTIONS.REQUEST,
                name: this.name,
                correlationId: this.correlationId
            },
            event: message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT,
            duration: this.options.rpcResponseTimeout,
            callback: this.onTimeout.bind(this)
        });
        this.services.connection.sendMessage(message);
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
/* 68 */
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(6);
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(10);
var record_core_1 = __webpack_require__(70);
var record_1 = __webpack_require__(72);
var anonymous_record_1 = __webpack_require__(73);
var list_1 = __webpack_require__(74);
var listener_1 = __webpack_require__(28);
var single_notifier_1 = __webpack_require__(75);
var write_ack_service_1 = __webpack_require__(76);
var dirty_service_1 = __webpack_require__(77);
var merge_strategy_service_1 = __webpack_require__(78);

var RecordHandler = function () {
    function RecordHandler(services, options, recordServices, listener) {
        _classCallCheck(this, RecordHandler);

        this.services = services;
        this.options = options;
        this.listener = listener || new listener_1.Listener(message_constants_1.TOPIC.RECORD, this.services);
        this.recordCores = new Map();
        this.recordServices = recordServices || {
            writeAckService: new write_ack_service_1.WriteAcknowledgementService(services),
            readRegistry: new single_notifier_1.SingleNotifier(services, message_constants_1.RECORD_ACTIONS.READ, options.recordReadTimeout),
            headRegistry: new single_notifier_1.SingleNotifier(services, message_constants_1.RECORD_ACTIONS.HEAD, options.recordReadTimeout),
            dirtyService: new dirty_service_1.DirtyService(services.storage, options.dirtyStorageName),
            mergeStrategy: new merge_strategy_service_1.MergeStrategyService(services, options.mergeStrategy)
        };
        this.dirtyService = this.recordServices.dirtyService;
        this.sendUpdatedData = this.sendUpdatedData.bind(this);
        this.onRecordUpdated = this.onRecordUpdated.bind(this);
        this.onMergeCompleted = this.onMergeCompleted.bind(this);
        this.getRecordCore = this.getRecordCore.bind(this);
        this.services.connection.registerHandler(message_constants_1.TOPIC.RECORD, this.handle.bind(this));
        this.services.connection.onReestablished(this.syncDirtyRecords.bind(this));
        if (this.services.connection.isConnected) {
            this.syncDirtyRecords();
        }
    }

    _createClass(RecordHandler, [{
        key: "setMergeStrategy",
        value: function setMergeStrategy(recordName, mergeStrategy) {
            if (typeof mergeStrategy === 'function') {
                this.recordServices.mergeStrategy.setMergeStrategyByName(recordName, mergeStrategy);
            } else {
                throw new Error('Invalid merge strategy: Must be a Function');
            }
        }
    }, {
        key: "setMergeStrategyRegExp",
        value: function setMergeStrategyRegExp(regexp, mergeStrategy) {
            if (typeof mergeStrategy === 'function') {
                this.recordServices.mergeStrategy.setMergeStrategyByPattern(regexp, mergeStrategy);
            } else {
                throw new Error('Invalid merge strategy: Must be a Function');
            }
        }
        /**
        * Returns an existing record or creates a new one.
        *
        * @param   {String} name              the unique name of the record
        */

    }, {
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
            if (recordCore) {
                if (callback) {
                    recordCore.whenReady(null, function () {
                        callback(null, recordCore.get());
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        recordCore.whenReady(null, function () {
                            resolve(recordCore.get());
                        });
                    });
                }
                return;
            }
            if (callback) {
                this.recordServices.readRegistry.request(name, callback);
            } else {
                return new Promise(function (resolve, reject) {
                    _this.recordServices.readRegistry.request(name, function (error, data) {
                        return error ? reject(error) : resolve(data);
                    });
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
            var cb = void 0;
            if (!callback) {
                return new Promise(function (resolve, reject) {
                    cb = function cb(error, version) {
                        return error ? reject(error) : resolve(version !== -1);
                    };
                    _this2.head(name, cb);
                });
            }
            cb = function cb(error, version) {
                return error ? callback(error, null) : callback(null, version !== -1);
            };
            this.head(name, cb);
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
            if (recordCore) {
                if (callback) {
                    recordCore.whenReady(null, function () {
                        callback(null, recordCore.version);
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        recordCore.whenReady(null, function () {
                            resolve(recordCore.version);
                        });
                    });
                }
                return;
            }
            if (callback) {
                this.recordServices.headRegistry.request(name, callback);
            } else {
                return new Promise(function (resolve, reject) {
                    _this3.recordServices.headRegistry.request(name, function (error, data) {
                        return error ? reject(error) : resolve(data);
                    });
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
            if (!args.callback) {
                return new Promise(function (resolve, reject) {
                    args.callback = function (error) {
                        return error === null ? resolve() : reject(error);
                    };
                    _this4.sendSetData(recordName, -1, args);
                });
            }
            this.sendSetData(recordName, -1, args);
        }
    }, {
        key: "setData",
        value: function setData(recordName) {
            var args = utils.normalizeSetArguments(arguments, 1);
            this.sendSetData(recordName, -1, args);
        }
    }, {
        key: "sendSetData",
        value: function sendSetData(recordName, version, args) {
            var path = args.path,
                data = args.data,
                callback = args.callback;

            if (!recordName || typeof recordName !== 'string' || recordName.length === 0) {
                throw new Error('invalid argument: recordName must be an non empty string');
            }
            if (!path && (data === null || (typeof data === "undefined" ? "undefined" : _typeof(data)) !== 'object')) {
                throw new Error('invalid argument: data must be an object when no path is provided');
            }
            var recordCores = this.recordCores.get(recordName);
            if (recordCores) {
                recordCores.set({ path: path, data: data, callback: callback });
                return;
            }
            var action = void 0;
            if (path) {
                if (data === undefined) {
                    action = message_constants_1.RECORD_ACTIONS.ERASE;
                } else {
                    action = message_constants_1.RECORD_ACTIONS.CREATEANDPATCH;
                }
            } else {
                action = message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE;
            }
            var message = {
                topic: message_constants_1.TOPIC.RECORD,
                action: action,
                name: recordName,
                path: path,
                version: version,
                parsedData: data
            };
            if (callback) {
                this.recordServices.writeAckService.send(message, callback);
            } else {
                this.services.connection.sendMessage(message);
            }
        }
        /**
         * Will be called by the client for incoming messages on the RECORD topic
         *
         * @param   {Object} message parsed and validated deepstream message
         */

    }, {
        key: "handle",
        value: function handle(message) {
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED || message.action === message_constants_1.RECORD_ACTIONS.LISTEN || message.action === message_constants_1.RECORD_ACTIONS.UNLISTEN) {
                this.listener.handle(message);
                return;
            }
            if (utils_1.isWriteAck(message.action) || utils_1.isWriteAck(message.originalAction)) {
                this.recordServices.writeAckService.recieve(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.READ_RESPONSE || message.originalAction === message_constants_1.RECORD_ACTIONS.READ) {
                if (message.isError) {
                    this.recordServices.readRegistry.recieve(message, message_constants_1.RECORD_ACTIONS[message.action]);
                } else {
                    this.recordServices.readRegistry.recieve(message, null, message.parsedData);
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE || message.originalAction === message_constants_1.RECORD_ACTIONS.HEAD) {
                if (message.isError) {
                    this.recordServices.headRegistry.recieve(message, message_constants_1.RECORD_ACTIONS[message.action]);
                } else {
                    this.recordServices.headRegistry.recieve(message, null, message.version);
                }
            }
            var recordCore = this.recordCores.get(message.name);
            if (recordCore) {
                recordCore.handle(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.VERSION_EXISTS) {
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER) {
                // record can receive a HAS_PROVIDER after discarding the record
                return;
            }
            if (message.isError) {
                this.services.logger.error(message);
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
                recordCore = new record_core_1.RecordCore(recordName, this.services, this.options, this.recordServices, this.removeRecord.bind(this));
                this.recordCores.set(recordName, recordCore);
            } else {
                recordCore.usages++;
            }
            return recordCore;
        }
    }, {
        key: "syncDirtyRecords",
        value: function syncDirtyRecords() {
            var _this5 = this;

            this.dirtyService.whenLoaded(function () {
                var dirtyRecords = _this5.dirtyService.getAll();
                for (var recordName in dirtyRecords) {
                    var recordCore = _this5.recordCores.get(recordName);
                    if (recordCore && recordCore.usages > 0) {
                        // if it isn't zero.. problem.
                        continue;
                    }
                    _this5.services.storage.get(recordName, _this5.sendUpdatedData);
                }
            });
        }
    }, {
        key: "sendUpdatedData",
        value: function sendUpdatedData(recordName, version, data) {
            this.sendSetData(recordName, version, { data: data, callback: this.onRecordUpdated });
        }
    }, {
        key: "onRecordUpdated",
        value: function onRecordUpdated(error, recordName) {
            if (!error) {
                this.dirtyService.setDirty(recordName, false);
            }
        }
        /**
        * Callback once the record merge has completed. If successful it will set the
        * record state, else emit and error and the record will remain in an
        * inconsistent state until the next update.
        */
        // private onMergeConflict (message: RecordWriteMessage): void {
        //   this.services.storage.get(message.name, (recordName: string, version: number, data: any) => {
        //     this.recordServices.mergeStrategy.merge(
        //       message.name,
        //       version,
        //       data,
        //       message.version,
        //       message.parsedData,
        //       this.onMergeCompleted
        //     )
        //   })
        // }

    }, {
        key: "onMergeCompleted",
        value: function onMergeCompleted(error, recordName, mergeData, remoteVersion, remoteData) {
            this.sendSetData(recordName, remoteVersion + 1, { data: mergeData });
        }
    }]);

    return RecordHandler;
}();

exports.RecordHandler = RecordHandler;

/***/ }),
/* 70 */
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
var json_path_1 = __webpack_require__(71);
var Emitter = __webpack_require__(3);
var utils = __webpack_require__(6);
var state_machine_1 = __webpack_require__(27);

var RecordCore = function (_Emitter) {
    _inherits(RecordCore, _Emitter);

    function RecordCore(name, services, options, recordServices, whenComplete) {
        _classCallCheck(this, RecordCore);

        var _this = _possibleConstructorReturn(this, (RecordCore.__proto__ || Object.getPrototypeOf(RecordCore)).call(this));

        _this.services = services;
        _this.options = options;
        _this.recordServices = recordServices;
        _this.emitter = new Emitter();
        _this.data = Object.create(null);
        _this.name = name;
        _this.whenComplete = whenComplete;
        _this.references = 1;
        _this.hasProvider = false;
        _this.pendingWrites = [];
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        _this.stateMachine = new state_machine_1.StateMachine(_this.services.logger, {
            init: 0 /* INITIAL */
            , onStateChanged: function onStateChanged(newState, oldState) {
                _this.emitter.emit(constants_1.EVENT.RECORD_STATE_CHANGED, newState);
            },
            transitions: [{ name: message_constants_1.RECORD_ACTIONS.SUBSCRIBE, from: 0 /* INITIAL */, to: 1 /* SUBSCRIBING */, handler: _this.onSubscribing.bind(_this) }, { name: 0 /* LOAD */, from: 0 /* INITIAL */, to: 3 /* LOADING_OFFLINE */, handler: _this.onOfflineLoading.bind(_this) }, { name: 1 /* LOADED */, from: 3 /* LOADING_OFFLINE */, to: 4 /* READY */, handler: _this.onReady.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.READ_RESPONSE, from: 1 /* SUBSCRIBING */, to: 4 /* READY */, handler: _this.onReady.bind(_this) }, { name: 2 /* SUBSCRIBED */, from: 2 /* RESUBSCRIBING */, to: 4 /* READY */ }, { name: 3 /* RESUBSCRIBE */, from: 0 /* INITIAL */, to: 2 /* RESUBSCRIBING */, handler: _this.onResubscribing.bind(_this) }, { name: 3 /* RESUBSCRIBE */, from: 4 /* READY */, to: 2 /* RESUBSCRIBING */, handler: _this.onResubscribing.bind(_this) }, { name: 3 /* RESUBSCRIBE */, from: 6 /* UNSUBSCRIBING */, to: 2 /* RESUBSCRIBING */, handler: _this.onResubscribing.bind(_this) }, { name: 4 /* RESUBSCRIBED */, from: 2 /* RESUBSCRIBING */, to: 4 /* READY */ }, { name: 5 /* INVALID_VERSION */, from: 2 /* RESUBSCRIBING */, to: 5 /* MERGING */ }, { name: message_constants_1.RECORD_ACTIONS.DELETE, from: 4 /* READY */, to: 8 /* DELETING */ }, { name: message_constants_1.RECORD_ACTIONS.DELETED, from: 4 /* READY */, to: 9 /* DELETED */, handler: _this.onDeleted.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS, from: 8 /* DELETING */, to: 9 /* DELETED */, handler: _this.onDeleted.bind(_this) }, { name: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE, from: 4 /* READY */, to: 6 /* UNSUBSCRIBING */ }, { name: message_constants_1.RECORD_ACTIONS.SUBSCRIBE, from: 6 /* UNSUBSCRIBING */, to: 4 /* READY */ }, { name: message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE_ACK, from: 6 /* UNSUBSCRIBING */, to: 7 /* UNSUBSCRIBED */, handler: _this.onUnsubscribed.bind(_this) }, { name: 5 /* INVALID_VERSION */, from: 4 /* READY */, to: 5 /* MERGING */ }]
        });
        _this.handleReadResponse = _this.handleReadResponse.bind(_this);
        _this.onRecordRecovered = _this.onRecordRecovered.bind(_this);
        _this.onConnectionReestablished = _this.onConnectionReestablished.bind(_this);
        _this.onConnectionLost = _this.onConnectionLost.bind(_this);
        _this.recordServices.dirtyService.whenLoaded(function () {
            if (_this.services.connection.isConnected) {
                if (!_this.recordServices.dirtyService.isDirty(_this.name)) {
                    _this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.SUBSCRIBE);
                } else {
                    _this.services.storage.get(_this.name, function (recordName, version, data) {
                        _this.version = version;
                        _this.data = data;
                        _this.stateMachine.transition(3 /* RESUBSCRIBE */);
                    });
                }
            } else {
                _this.stateMachine.transition(0 /* LOAD */);
            }
            _this.services.connection.onReestablished(_this.onConnectionReestablished);
            _this.services.connection.onLost(_this.onConnectionLost);
        });
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
            var _this3 = this;

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
                this.pendingWrites.push({ path: path, data: data, callback: callback });
                return;
            }
            var oldValue = this.data;
            var newValue = json_path_1.setValue(oldValue, path || null, data);
            if (oldValue === newValue) {
                if (callback) {
                    this.services.timerRegistry.requestIdleCallback(function () {
                        return callback(null, _this3.name);
                    });
                }
                return;
            }
            this.applyChange(newValue);
            if (this.services.connection.isConnected) {
                this.sendUpdate(path, data, callback);
            } else {
                if (callback) {
                    callback(constants_1.EVENT.CLIENT_OFFLINE, this.name);
                }
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
            var _this4 = this;

            if (args.callback) {
                this.set(args);
                return;
            }
            return new Promise(function (resolve, reject) {
                args.callback = function (error) {
                    return error === null ? resolve() : reject(error);
                };
                _this4.set(args);
            });
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
            var _this5 = this;

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
                    _this5.emitter.on(args.path || '', args.callback);
                    args.callback(_this5.get(args.path));
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
            var _this6 = this;

            if (this.checkDestroyed('discard')) {
                return;
            }
            this.whenReady(null, function () {
                _this6.references--;
                if (_this6.references <= 0) {
                    _this6.discardTimeout = _this6.services.timerRegistry.add({
                        duration: _this6.options.discardTimeout,
                        callback: _this6.stateMachine.transition,
                        context: _this6.stateMachine,
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
            var _this7 = this;

            if (!this.services.connection.isConnected) {
                // this.services.logger.warn({ topic: TOPIC.RECORD }, RA.DELETE, 'Deleting while offline is not supported')
                if (callback) {
                    this.services.timerRegistry.requestIdleCallback(function () {
                        callback('Deleting while offline is not supported');
                    });
                    return;
                }
                return Promise.reject('Deleting while offline is not supported');
            }
            if (this.checkDestroyed('delete')) {
                return;
            }
            this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.DELETE);
            if (callback && typeof callback === 'function') {
                this.deleteResponse = { callback: callback };
                this.sendDelete();
            } else {
                return new Promise(function (resolve, reject) {
                    _this7.deleteResponse = { resolve: resolve, reject: reject };
                    _this7.sendDelete();
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
            this.recordServices.mergeStrategy.setMergeStrategyByName(this.name, mergeStrategy);
        }
    }, {
        key: "saveRecordToOffline",
        value: function saveRecordToOffline() {
            this.services.storage.set(this.name, this.version, this.data, function () {});
        }
        /**
         * Transition States
         */

    }, {
        key: "onSubscribing",
        value: function onSubscribing() {
            this.recordServices.readRegistry.register(this.name, this.handleReadResponse.bind(this));
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
            this.services.timerRegistry.remove(this.discardTimeout);
            this.recordServices.headRegistry.register(this.name, this.handleHeadResponse.bind(this));
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
            var _this8 = this;

            this.services.storage.get(this.name, function (recordName, version, data) {
                if (version === -1) {
                    _this8.data = {};
                    _this8.version = 1;
                    _this8.recordServices.dirtyService.setDirty(_this8.name, true);
                    _this8.services.storage.set(_this8.name, _this8.version, _this8.data, function (error) {
                        _this8.stateMachine.transition(1 /* LOADED */);
                    });
                } else {
                    _this8.data = data;
                    _this8.version = version;
                    _this8.stateMachine.transition(1 /* LOADED */);
                }
            });
        }
    }, {
        key: "onReady",
        value: function onReady() {
            this.services.timeoutRegistry.clear(this.responseTimeout);
            this.applyPendingWrites();
            this.isReady = true;
            this.emit(constants_1.EVENT.RECORD_READY);
        }
    }, {
        key: "applyPendingWrites",
        value: function applyPendingWrites() {
            var _this9 = this;

            var writeCallbacks = [];
            var oldData = this.data;
            var newData = oldData;
            for (var i = 0; i < this.pendingWrites.length; i++) {
                var _pendingWrites$i = this.pendingWrites[i],
                    callback = _pendingWrites$i.callback,
                    path = _pendingWrites$i.path,
                    data = _pendingWrites$i.data;

                if (callback) {
                    writeCallbacks.push(callback);
                }
                newData = json_path_1.setValue(newData, path || null, data);
            }
            this.pendingWrites = [];
            this.applyChange(newData);
            var runFns = function runFns(err) {
                for (var _i = 0; _i < writeCallbacks.length; _i++) {
                    writeCallbacks[_i](err, _this9.name);
                }
            };
            if (utils.deepEquals(oldData, newData)) {
                runFns(null);
                return;
            }
            if (this.services.connection.isConnected) {
                this.sendUpdate(null, newData, runFns);
            } else {
                runFns(constants_1.EVENT.CLIENT_OFFLINE);
                this.saveUpdate();
            }
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
                this.discardTimeout = this.services.timeoutRegistry.add({ message: message });
                this.services.connection.sendMessage(message);
            }
            this.emit(constants_1.EVENT.RECORD_DISCARDED);
            this.destroy();
        }
    }, {
        key: "onDeleted",
        value: function onDeleted() {
            this.emit(constants_1.EVENT.RECORD_DELETED);
            this.destroy();
        }
    }, {
        key: "handle",
        value: function handle(message) {
            if (message.isAck) {
                this.services.timeoutRegistry.remove(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.PATCH || message.action === message_constants_1.RECORD_ACTIONS.UPDATE || message.action === message_constants_1.RECORD_ACTIONS.ERASE) {
                this.applyUpdate(message);
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS) {
                this.services.timeoutRegistry.clear(this.deletedTimeout);
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
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.VERSION_EXISTS) {
                // what kind of message is version exists?
                // this.recoverRecord(message)
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED || message.action === message_constants_1.RECORD_ACTIONS.MESSAGE_PERMISSION_ERROR) {
                if (message.originalAction === message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD || message.originalAction === message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDHEAD || message.originalAction === message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDREAD) {
                    var subscribeMsg = Object.assign({}, message, { originalAction: message_constants_1.RECORD_ACTIONS.SUBSCRIBE });
                    var actionMsg = Object.assign({}, message, { originalAction: message.originalAction === message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD ? message_constants_1.RECORD_ACTIONS.READ_RESPONSE : message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE });
                    this.services.timeoutRegistry.remove(subscribeMsg);
                    this.services.timeoutRegistry.remove(actionMsg);
                }
                this.emit(constants_1.EVENT.RECORD_ERROR, message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED], message_constants_1.RECORD_ACTIONS[message.originalAction]);
                if (message.originalAction === message_constants_1.RECORD_ACTIONS.DELETE) {
                    if (this.deleteResponse.callback) {
                        this.deleteResponse.callback(message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED]);
                    } else if (this.deleteResponse.reject) {
                        this.deleteResponse.reject(message_constants_1.RECORD_ACTIONS[message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED]);
                    }
                }
                return;
            }
            if (message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER || message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER) {
                this.hasProvider = message.action === message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER;
                this.emit(constants_1.EVENT.RECORD_HAS_PROVIDER_CHANGED, this.hasProvider);
                return;
            }
        }
    }, {
        key: "handleReadResponse",
        value: function handleReadResponse(message) {
            if (this.stateMachine.state === 5 /* MERGING */) {
                    this.recoverRecord(message.version, message.parsedData, message);
                    this.recordServices.dirtyService.setDirty(this.name, false);
                    return;
                }
            this.version = message.version;
            this.applyChange(json_path_1.setValue(this.data, null, message.parsedData));
            this.stateMachine.transition(message_constants_1.RECORD_ACTIONS.READ_RESPONSE);
        }
    }, {
        key: "handleHeadResponse",
        value: function handleHeadResponse(message) {
            var remoteVersion = message.version;
            if (this.recordServices.dirtyService.isDirty(this.name)) {
                if (remoteVersion === -1 && this.version === 1) {
                    /**
                     * Record created while offline
                     */
                    this.stateMachine.transition(2 /* SUBSCRIBED */);
                    this.sendCreateUpdate(this.data);
                } else if (this.version === remoteVersion + 1) {
                    /**
                     * record updated while offline
                    */
                    this.sendUpdate(null, this.data);
                    this.stateMachine.transition(4 /* RESUBSCRIBED */);
                } else {
                    this.stateMachine.transition(5 /* INVALID_VERSION */);
                    this.sendRead();
                    this.recordServices.readRegistry.register(this.name, this.handleReadResponse.bind(this));
                }
            } else {
                if (remoteVersion < this.version) {
                    /**
                     *  deleted and created again remotely
                    */
                } else if (this.version === remoteVersion) {
                    this.stateMachine.transition(4 /* RESUBSCRIBED */);
                } else {
                    this.stateMachine.transition(5 /* INVALID_VERSION */);
                    this.sendRead();
                    this.recordServices.readRegistry.register(this.name, this.handleReadResponse.bind(this));
                }
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
        key: "saveUpdate",
        value: function saveUpdate() {
            if (!this.recordServices.dirtyService.isDirty(this.name)) {
                this.version++;
                this.recordServices.dirtyService.setDirty(this.name, true);
            }
            this.saveRecordToOffline();
        }
    }, {
        key: "sendUpdate",
        value: function sendUpdate() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var data = arguments[1];
            var callback = arguments[2];

            if (this.recordServices.dirtyService.isDirty(this.name)) {
                this.recordServices.dirtyService.setDirty(this.name, false);
            } else {
                this.version++;
            }
            var message = {
                topic: message_constants_1.TOPIC.RECORD,
                version: this.version,
                name: this.name
            };
            if (path) {
                if (data === undefined) {
                    Object.assign(message, { action: message_constants_1.RECORD_ACTIONS.ERASE, path: path });
                } else {
                    Object.assign(message, { action: message_constants_1.RECORD_ACTIONS.PATCH, path: path, parsedData: data });
                }
            } else {
                Object.assign(message, { action: message_constants_1.RECORD_ACTIONS.UPDATE, parsedData: data });
            }
            if (callback) {
                this.recordServices.writeAckService.send(message, callback);
            } else {
                this.services.connection.sendMessage(message);
            }
        }
    }, {
        key: "sendCreateUpdate",
        value: function sendCreateUpdate(data) {
            this.services.connection.sendMessage({
                name: this.name,
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE,
                version: 1,
                parsedData: data
            });
            this.recordServices.dirtyService.setDirty(this.name, false);
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
                this.stateMachine.transition(5 /* INVALID_VERSION */);
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
            var newData = void 0;
            if (message.action === message_constants_1.RECORD_ACTIONS.PATCH) {
                newData = json_path_1.setValue(this.data, message.path, data);
            } else if (message.action === message_constants_1.RECORD_ACTIONS.ERASE) {
                newData = json_path_1.setValue(this.data, message.path, undefined);
            } else {
                newData = json_path_1.setValue(this.data, null, data);
            }
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
            var _this10 = this;

            this.whenReady(null, function () {
                if (_this10.services.connection.isConnected) {
                    var message = {
                        topic: message_constants_1.TOPIC.RECORD,
                        action: message_constants_1.RECORD_ACTIONS.DELETE,
                        name: _this10.name
                    };
                    _this10.deletedTimeout = _this10.services.timeoutRegistry.add({
                        message: message,
                        event: constants_1.EVENT.RECORD_DELETE_TIMEOUT,
                        duration: _this10.options.recordDeleteTimeout
                    });
                    _this10.services.connection.sendMessage(message);
                } else {
                    _this10.services.storage.delete(_this10.name, function () {
                        _this10.services.timerRegistry.requestIdleCallback(function () {
                            _this10.stateMachine.transition(message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS);
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
            this.recordServices.mergeStrategy.merge(this.name, this.version, this.get(), remoteVersion, remoteData, this.onRecordRecovered);
        }
        /**
        * Callback once the record merge has completed. If successful it will set the
        * record state, else emit and error and the record will remain in an
        * inconsistent state until the next update.
        */

    }, {
        key: "onRecordRecovered",
        value: function onRecordRecovered(error, mergedData, remoteVersion, remoteData) {
            if (error) {
                this.services.logger.error({ topic: message_constants_1.TOPIC.RECORD }, constants_1.EVENT.RECORD_VERSION_EXISTS);
            }
            this.version = remoteVersion;
            var oldValue = this.data;
            if (utils.deepEquals(oldValue, remoteData)) {
                return;
            }
            var newValue = json_path_1.setValue(oldValue, null, mergedData);
            if (utils.deepEquals(mergedData, remoteData)) {
                this.applyChange(mergedData);
                // const callback = this.writeCallbacks.get(remoteVersion)
                // if (callback !== undefined) {
                //   callback(null)
                //   this.writeCallbacks.delete(remoteVersion)
                // }
                // return
            }
            // this.sendUpdate(null, data, message.isWriteAck)
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
            this.services.connection.removeOnReestablished(this.onConnectionReestablished);
            this.services.connection.removeOnLost(this.onConnectionLost);
            this.emitter.off();
            this.isReady = false;
            this.whenComplete(this.name);
        }
    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
            this.stateMachine.transition(3 /* RESUBSCRIBE */);
        }
    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            this.saveRecordToOffline();
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(6);
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
    var rootCopy = utils.deepCopy(root);
    var valueCopy = utils.deepCopy(value);
    var node = rootCopy;
    var i = void 0;
    for (i = 0; i < tokens.length - 1; i++) {
        var token = tokens[i];
        if (node[token] !== undefined && node[token] !== null && _typeof(node[token]) === 'object') {
            node = node[token];
        } else if (typeof tokens[i + 1] === 'number') {
            var array = new Array(tokens[i + 1]);
            array.fill(null);
            node = node[token] = array;
        } else {
            node = node[token] = {};
        }
    }
    if (value === undefined) {
        delete node[tokens[i]];
    } else {
        node[tokens[i]] = valueCopy;
    }
    return rootCopy;
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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(6);
var constants_1 = __webpack_require__(1);
var Emitter = __webpack_require__(3);

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
        /**
         * Deletes a path from the record. Equivalent to doing `record.set(path, undefined)`
         *
         * @param {String} path The path to be deleted
         */

    }, {
        key: "erase",
        value: function erase(path) {
            if (!path) {
                throw new Error('unable to erase record data without path, consider using `delete`');
            }
            this.set(path, undefined);
        }
    }, {
        key: "eraseWithAck",
        value: function eraseWithAck(path, callback) {
            if (!path) {
                throw new Error('unable to erase record data without path, consider using `delete`');
            }
            if (callback) {
                this.setWithAck(path, undefined, callback);
            } else {
                return this.setWithAck(path, undefined);
            }
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
    }, {
        key: "hasProvider",
        get: function get() {
            return this.record.hasProvider;
        }
    }]);

    return Record;
}(Emitter);

exports.Record = Record;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(6);
var Emitter = __webpack_require__(3);

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
        key: "erase",
        value: function erase(path) {
            if (this.record) {
                return this.record.set(utils.normalizeSetArguments(arguments));
            }
        }
    }, {
        key: "eraseWithAck",
        value: function eraseWithAck(path, callback) {
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(6);
var constants_1 = __webpack_require__(1);
var Emitter = __webpack_require__(3);

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
            var listCallback = function (scope, cb) {
                cb(scope.getEntries());
            }.bind(this, this, parameters.callback);
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
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
    function SingleNotifier(services, action, timeoutDuration) {
        _classCallCheck(this, SingleNotifier);

        this.services = services;
        this.action = action;
        this.requests = new Map();
        this.internalRequests = new Map();
        this.limboQueue = [];
        this.services.connection.onLost(this.onConnectionLost.bind(this));
        this.services.connection.onExitLimbo(this.onExitLimbo.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
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
        value: function request(name, callback) {
            var message = {
                topic: message_constants_1.TOPIC.RECORD,
                action: this.action,
                name: name
            };
            var req = this.requests.get(name);
            if (req) {
                req.push(callback);
                return;
            }
            this.requests.set(name, [callback]);
            if (this.services.connection.isConnected) {
                this.services.connection.sendMessage(message);
                this.services.timeoutRegistry.add({ message: message });
            } else if (this.services.connection.isInLimbo) {
                this.limboQueue.push(message);
            } else {
                callback(constants_1.EVENT.CLIENT_OFFLINE);
            }
        }
        /**
         * Adds a callback to a (possibly) inflight request that will be called
         * on the response.
         *
         * @param name
         * @param response
         */

    }, {
        key: "register",
        value: function register(name, callback) {
            var request = this.internalRequests.get(name);
            if (!request) {
                this.internalRequests.set(name, [callback]);
            } else {
                request.push(callback);
            }
        }
    }, {
        key: "recieve",
        value: function recieve(message, error, data) {
            this.services.timeoutRegistry.remove(message);
            var name = message.name;
            var responses = this.requests.get(name) || [];
            var internalResponses = this.internalRequests.get(name) || [];
            if (!responses && !internalResponses) {
                return;
            }
            for (var i = 0; i < internalResponses.length; i++) {
                internalResponses[i](message);
            }
            this.internalRequests.delete(name);
            // todo we can clean this up and do cb = (error, data) => error ? reject(error) : resolve()
            for (var _i = 0; _i < responses.length; _i++) {
                responses[_i](error, data);
            }
            this.requests.delete(name);
            return;
        }
    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            this.requests.forEach(function (responses) {
                responses.forEach(function (response) {
                    return response(constants_1.EVENT.CLIENT_OFFLINE);
                });
            });
            this.requests.clear();
        }
    }, {
        key: "onExitLimbo",
        value: function onExitLimbo() {
            for (var i = 0; i < this.limboQueue.length; i++) {
                var message = this.limboQueue[i];
                var requests = this.requests.get(message.name);
                if (requests) {
                    requests.forEach(function (cb) {
                        return cb(constants_1.EVENT.CLIENT_OFFLINE);
                    });
                }
            }
            this.requests.clear();
            this.limboQueue = [];
        }
    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
            for (var i = 0; i < this.limboQueue.length; i++) {
                var message = this.limboQueue[i];
                this.services.connection.sendMessage(message);
                this.services.timeoutRegistry.add({ message: message });
            }
        }
    }]);

    return SingleNotifier;
}();

exports.SingleNotifier = SingleNotifier;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var message_constants_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(10);
var constants_1 = __webpack_require__(1);

var WriteAcknowledgementService = function () {
    function WriteAcknowledgementService(services) {
        _classCallCheck(this, WriteAcknowledgementService);

        this.services = services;
        this.responses = new Map();
        this.count = 1;
        this.services.connection.onLost(this.onConnectionLost.bind(this));
    }
    /**
     * Send message with write ack callback.
     */


    _createClass(WriteAcknowledgementService, [{
        key: "send",
        value: function send(message, callback) {
            if (this.services.connection.isConnected === false) {
                this.services.timerRegistry.requestIdleCallback(callback.bind(this, constants_1.EVENT.CLIENT_OFFLINE));
                return;
            }
            var correlationId = this.count.toString();
            this.responses.set(correlationId, callback);
            this.services.connection.sendMessage(Object.assign({}, message, { correlationId: correlationId, action: utils_1.ACTION_TO_WRITE_ACK[message.action] }));
            this.count++;
        }
    }, {
        key: "recieve",
        value: function recieve(message) {
            var id = message.correlationId;
            var response = this.responses.get(id);
            if (!response || message.action !== message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT && !message.isError) {
                return;
            }
            message.isError ? response(message_constants_1.RECORD_ACTIONS[message.action]) : response(null);
            this.responses.delete(id);
        }
    }, {
        key: "onConnectionLost",
        value: function onConnectionLost() {
            this.responses.forEach(function (response) {
                return response(constants_1.EVENT.CLIENT_OFFLINE);
            });
            this.responses.clear();
        }
    }]);

    return WriteAcknowledgementService;
}();

exports.WriteAcknowledgementService = WriteAcknowledgementService;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter = __webpack_require__(3);
var DIRTY_SERVICE_LOADED = 'dirty-service-loaded';

var DirtyService = function () {
    function DirtyService(storage, dirtyStorageName) {
        _classCallCheck(this, DirtyService);

        this.storage = storage;
        this.name = dirtyStorageName;
        this.loaded = false;
        this.emitter = new Emitter();
        this.dirtyRecords = {};
        this.load();
    }

    _createClass(DirtyService, [{
        key: "isDirty",
        value: function isDirty(recordName) {
            return !!this.dirtyRecords[recordName];
        }
    }, {
        key: "setDirty",
        value: function setDirty(recordName, isDirty) {
            this.updateDirtyRecords(recordName, isDirty);
        }
    }, {
        key: "whenLoaded",
        value: function whenLoaded(callback) {
            if (this.loaded) {
                callback();
                return;
            }
            this.emitter.once(DIRTY_SERVICE_LOADED, function () {
                callback();
            });
        }
    }, {
        key: "getAll",
        value: function getAll() {
            return this.dirtyRecords;
        }
    }, {
        key: "load",
        value: function load() {
            var _this = this;

            if (this.loaded) {
                return;
            }
            this.storage.get(this.name, function (recordName, version, data) {
                _this.dirtyRecords = version !== -1 ? data : {};
                _this.loaded = true;
                _this.emitter.emit(DIRTY_SERVICE_LOADED);
            });
        }
    }, {
        key: "updateDirtyRecords",
        value: function updateDirtyRecords(recordName, isDirty) {
            if (isDirty) {
                this.dirtyRecords[recordName] = true;
            } else {
                delete this.dirtyRecords[recordName];
            }
            this.storage.set(this.name, 1, this.dirtyRecords, function () {});
        }
    }]);

    return DirtyService;
}();

exports.DirtyService = DirtyService;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);

var MergeStrategyService = function () {
    function MergeStrategyService(services, defaultStrategy) {
        _classCallCheck(this, MergeStrategyService);

        this.services = services;
        this.defaultStrategy = defaultStrategy;
        this.strategiesByRecord = new Map();
        this.strategiesByPattern = new Map();
    }

    _createClass(MergeStrategyService, [{
        key: "setMergeStrategyByName",
        value: function setMergeStrategyByName(recordName, strategy) {
            this.strategiesByRecord.set(recordName, strategy);
        }
    }, {
        key: "setMergeStrategyByPattern",
        value: function setMergeStrategyByPattern(pattern, strategy) {
            this.strategiesByPattern.set(pattern, strategy);
        }
    }, {
        key: "merge",
        value: function merge(recordName, localVersion, localData, remoteVersion, remoteData, callback) {
            var exactMergeStrategy = this.strategiesByRecord.get(recordName);
            if (exactMergeStrategy) {
                exactMergeStrategy(localData, localVersion, remoteData, remoteVersion, function (error, data) {
                    callback(error, recordName, data, remoteVersion, remoteData, localVersion, localData);
                });
                return;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.strategiesByPattern[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var pattern = _ref2[0];
                    var patternMergeStrategy = _ref2[1];

                    if (pattern.test(recordName)) {
                        patternMergeStrategy(localData, localVersion, remoteData, remoteVersion, function (error, data) {
                            callback(error, recordName, data, remoteVersion, remoteData, localVersion, localData);
                        });
                        return;
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

            if (this.defaultStrategy) {
                this.defaultStrategy(localData, localVersion, remoteData, remoteVersion, function (error, data) {
                    callback(error, recordName, data, remoteVersion, remoteData, localVersion, localData);
                });
            }
            this.services.logger.error({ topic: message_constants_1.TOPIC.RECORD }, constants_1.EVENT.RECORD_VERSION_EXISTS, { remoteVersion: remoteVersion, recordName: recordName });
        }
    }]);

    return MergeStrategyService;
}();

exports.MergeStrategyService = MergeStrategyService;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Storage = function () {
    function Storage(options) {
        _classCallCheck(this, Storage);

        if (typeof localStorage === 'undefined' || localStorage === null) {
            var LocalStorage = __webpack_require__(80).LocalStorage;
            this.storage = new LocalStorage(options.nodeStoragePath, options.nodeStorageSize * 1024 * 1024);
        } else {
            this.storage = window.localStorage;
        }
    }

    _createClass(Storage, [{
        key: "get",
        value: function get(recordName, callback) {
            var item = this.storage.getItem(recordName);
            if (item) {
                var doc = JSON.parse(item);
                setTimeout(callback.bind(this, recordName, doc.version, doc.data), 0);
                return;
            }
            setTimeout(callback.bind(this, recordName, -1, null), 0);
        }
    }, {
        key: "set",
        value: function set(recordName, version, data, callback) {
            this.storage.setItem(recordName, JSON.stringify({ recordName: recordName, version: version, data: data }));
            setTimeout(callback, 0);
        }
    }, {
        key: "delete",
        value: function _delete(recordName, callback) {
            this.storage.removeItem(recordName);
            setTimeout(callback, 0);
        }
    }]);

    return Storage;
}();

exports.Storage = Storage;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.10.0
(function() {
  var JSONStorage, KEY_FOR_EMPTY_STRING, LocalStorage, MetaKey, QUOTA_EXCEEDED_ERR, StorageEvent, _emptyDirectory, _escapeKey, _rm, createMap, events, fs, path, writeSync,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = __webpack_require__(23);

  fs = __webpack_require__(12);

  events = __webpack_require__(13);

  writeSync = __webpack_require__(81).sync;

  KEY_FOR_EMPTY_STRING = '---.EMPTY_STRING.---';

  _emptyDirectory = function(target) {
    var i, len, p, ref, results;
    ref = fs.readdirSync(target);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      p = ref[i];
      results.push(_rm(path.join(target, p)));
    }
    return results;
  };

  _rm = function(target) {
    if (fs.statSync(target).isDirectory()) {
      _emptyDirectory(target);
      return fs.rmdirSync(target);
    } else {
      return fs.unlinkSync(target);
    }
  };

  _escapeKey = function(key) {
    var newKey;
    if (key === '') {
      newKey = KEY_FOR_EMPTY_STRING;
    } else {
      newKey = key.toString();
    }
    return newKey;
  };

  QUOTA_EXCEEDED_ERR = (function(superClass) {
    extend(QUOTA_EXCEEDED_ERR, superClass);

    function QUOTA_EXCEEDED_ERR(message) {
      this.message = message != null ? message : 'Unknown error.';
      if (Error.captureStackTrace != null) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = this.constructor.name;
    }

    QUOTA_EXCEEDED_ERR.prototype.toString = function() {
      return this.name + ": " + this.message;
    };

    return QUOTA_EXCEEDED_ERR;

  })(Error);

  StorageEvent = (function() {
    function StorageEvent(key1, oldValue1, newValue1, url, storageArea) {
      this.key = key1;
      this.oldValue = oldValue1;
      this.newValue = newValue1;
      this.url = url;
      this.storageArea = storageArea != null ? storageArea : 'localStorage';
    }

    return StorageEvent;

  })();

  MetaKey = (function() {
    function MetaKey(key1, index1) {
      this.key = key1;
      this.index = index1;
      if (!(this instanceof MetaKey)) {
        return new MetaKey(this.key, this.index);
      }
    }

    return MetaKey;

  })();

  createMap = function() {
    var Map;
    Map = function() {};
    Map.prototype = Object.create(null);
    return new Map();
  };

  LocalStorage = (function(superClass) {
    var instanceMap;

    extend(LocalStorage, superClass);

    instanceMap = {};

    function LocalStorage(_location, quota) {
      this._location = _location;
      this.quota = quota != null ? quota : 5 * 1024 * 1024;
      if (!(this instanceof LocalStorage)) {
        return new LocalStorage(this._location, this.quota);
      }
      this._location = path.resolve(this._location);
      if (instanceMap[this._location] != null) {
        return instanceMap[this._location];
      }
      this.length = 0;
      this._bytesInUse = 0;
      this._keys = [];
      this._metaKeyMap = createMap();
      this._eventUrl = "pid:" + process.pid;
      this._init();
      this._QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;
      instanceMap[this._location] = this;
      return instanceMap[this._location];
    }

    LocalStorage.prototype._init = function() {
      var _MetaKey, _decodedKey, _keys, error, i, index, k, len, stat;
      try {
        stat = fs.statSync(this._location);
        if ((stat != null) && !stat.isDirectory()) {
          throw new Error("A file exists at the location '" + this._location + "' when trying to create/open localStorage");
        }
        this._bytesInUse = 0;
        this.length = 0;
        _keys = fs.readdirSync(this._location);
        for (index = i = 0, len = _keys.length; i < len; index = ++i) {
          k = _keys[index];
          _decodedKey = decodeURIComponent(k);
          this._keys.push(_decodedKey);
          _MetaKey = new MetaKey(k, index);
          this._metaKeyMap[_decodedKey] = _MetaKey;
          stat = this._getStat(k);
          if ((stat != null ? stat.size : void 0) != null) {
            _MetaKey.size = stat.size;
            this._bytesInUse += stat.size;
          }
        }
        this.length = _keys.length;
      } catch (error) {
        fs.mkdirSync(this._location);
      }
    };

    LocalStorage.prototype.setItem = function(key, value) {
      var encodedKey, evnt, existsBeforeSet, filename, hasListeners, metaKey, oldLength, oldValue, valueString, valueStringLength;
      hasListeners = events.EventEmitter.listenerCount(this, 'storage');
      oldValue = null;
      if (hasListeners) {
        oldValue = this.getItem(key);
      }
      key = _escapeKey(key);
      encodedKey = encodeURIComponent(key);
      filename = path.join(this._location, encodedKey);
      valueString = value.toString();
      valueStringLength = valueString.length;
      metaKey = this._metaKeyMap[key];
      existsBeforeSet = !!metaKey;
      if (existsBeforeSet) {
        oldLength = metaKey.size;
      } else {
        oldLength = 0;
      }
      if (this._bytesInUse - oldLength + valueStringLength > this.quota) {
        throw new QUOTA_EXCEEDED_ERR();
      }
      writeSync(filename, valueString, 'utf8');
      if (!existsBeforeSet) {
        metaKey = new MetaKey(encodedKey, (this._keys.push(key)) - 1);
        metaKey.size = valueStringLength;
        this._metaKeyMap[key] = metaKey;
        this.length += 1;
        this._bytesInUse += valueStringLength;
      }
      if (hasListeners) {
        evnt = new StorageEvent(key, oldValue, value, this._eventUrl);
        return this.emit('storage', evnt);
      }
    };

    LocalStorage.prototype.getItem = function(key) {
      var filename, metaKey;
      key = _escapeKey(key);
      metaKey = this._metaKeyMap[key];
      if (!!metaKey) {
        filename = path.join(this._location, metaKey.key);
        return fs.readFileSync(filename, 'utf8');
      } else {
        return null;
      }
    };

    LocalStorage.prototype._getStat = function(key) {
      var error, filename;
      key = _escapeKey(key);
      filename = path.join(this._location, encodeURIComponent(key));
      try {
        return fs.statSync(filename);
      } catch (error) {
        return null;
      }
    };

    LocalStorage.prototype.removeItem = function(key) {
      var evnt, filename, hasListeners, k, meta, metaKey, oldValue, ref, v;
      key = _escapeKey(key);
      metaKey = this._metaKeyMap[key];
      if (!!metaKey) {
        hasListeners = events.EventEmitter.listenerCount(this, 'storage');
        oldValue = null;
        if (hasListeners) {
          oldValue = this.getItem(key);
        }
        delete this._metaKeyMap[key];
        this.length -= 1;
        this._bytesInUse -= metaKey.size;
        filename = path.join(this._location, metaKey.key);
        this._keys.splice(metaKey.index, 1);
        ref = this._metaKeyMap;
        for (k in ref) {
          v = ref[k];
          meta = this._metaKeyMap[k];
          if (meta.index > metaKey.index) {
            meta.index -= 1;
          }
        }
        _rm(filename);
        if (hasListeners) {
          evnt = new StorageEvent(key, oldValue, null, this._eventUrl);
          return this.emit('storage', evnt);
        }
      }
    };

    LocalStorage.prototype.key = function(n) {
      return this._keys[n];
    };

    LocalStorage.prototype.clear = function() {
      var evnt;
      _emptyDirectory(this._location);
      this._metaKeyMap = createMap();
      this._keys = [];
      this.length = 0;
      this._bytesInUse = 0;
      if (events.EventEmitter.listenerCount(this, 'storage')) {
        evnt = new StorageEvent(null, null, null, this._eventUrl);
        return this.emit('storage', evnt);
      }
    };

    LocalStorage.prototype._getBytesInUse = function() {
      return this._bytesInUse;
    };

    LocalStorage.prototype._deleteLocation = function() {
      delete instanceMap[this._location];
      _rm(this._location);
      this._metaKeyMap = {};
      this._keys = [];
      this.length = 0;
      return this._bytesInUse = 0;
    };

    return LocalStorage;

  })(events.EventEmitter);

  JSONStorage = (function(superClass) {
    extend(JSONStorage, superClass);

    function JSONStorage() {
      return JSONStorage.__super__.constructor.apply(this, arguments);
    }

    JSONStorage.prototype.setItem = function(key, value) {
      var newValue;
      newValue = JSON.stringify(value);
      return JSONStorage.__super__.setItem.call(this, key, newValue);
    };

    JSONStorage.prototype.getItem = function(key) {
      return JSON.parse(JSONStorage.__super__.getItem.call(this, key));
    };

    return JSONStorage;

  })(LocalStorage);

  exports.LocalStorage = LocalStorage;

  exports.JSONStorage = JSONStorage;

  exports.QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__filename, process, Buffer) {
module.exports = writeFile
module.exports.sync = writeFileSync
module.exports._getTmpname = getTmpname // for testing

var fs = __webpack_require__(82)
var chain = __webpack_require__(100).chain
var MurmurHash3 = __webpack_require__(103)
var extend = Object.assign || __webpack_require__(18)._extend

var invocations = 0
function getTmpname (filename) {
  return filename + '.' +
    MurmurHash3(__filename)
      .hash(String(process.pid))
      .hash(String(++invocations))
      .result()
}

function writeFile (filename, data, options, callback) {
  if (options instanceof Function) {
    callback = options
    options = null
  }
  if (!options) options = {}
  fs.realpath(filename, function (_, realname) {
    _writeFile(realname || filename, data, options, callback)
  })
}
function _writeFile (filename, data, options, callback) {
  var tmpfile = getTmpname(filename)

  if (options.mode && options.chown) {
    return thenWriteFile()
  } else {
    // Either mode or chown is not explicitly set
    // Default behavior is to copy it from original file
    return fs.stat(filename, function (err, stats) {
      if (err || !stats) return thenWriteFile()

      options = extend({}, options)
      if (!options.mode) {
        options.mode = stats.mode
      }
      if (!options.chown && process.getuid) {
        options.chown = { uid: stats.uid, gid: stats.gid }
      }
      return thenWriteFile()
    })
  }

  function thenWriteFile () {
    chain([
      [writeFileAsync, tmpfile, data, options.mode, options.encoding || 'utf8'],
      options.chown && [fs, fs.chown, tmpfile, options.chown.uid, options.chown.gid],
      options.mode && [fs, fs.chmod, tmpfile, options.mode],
      [fs, fs.rename, tmpfile, filename]
    ], function (err) {
      err ? fs.unlink(tmpfile, function () { callback(err) })
        : callback()
    })
  }

  // doing this instead of `fs.writeFile` in order to get the ability to
  // call `fsync`.
  function writeFileAsync (file, data, mode, encoding, cb) {
    fs.open(file, 'w', options.mode, function (err, fd) {
      if (err) return cb(err)
      if (Buffer.isBuffer(data)) {
        return fs.write(fd, data, 0, data.length, 0, syncAndClose)
      } else if (data != null) {
        return fs.write(fd, String(data), 0, String(encoding), syncAndClose)
      } else {
        return syncAndClose()
      }
      function syncAndClose (err) {
        if (err) return cb(err)
        fs.fsync(fd, function (err) {
          if (err) return cb(err)
          fs.close(fd, cb)
        })
      }
    })
  }
}

function writeFileSync (filename, data, options) {
  if (!options) options = {}
  try {
    filename = fs.realpathSync(filename)
  } catch (ex) {
    // it's ok, it'll happen on a not yet existing file
  }
  var tmpfile = getTmpname(filename)

  try {
    if (!options.mode || !options.chown) {
      // Either mode or chown is not explicitly set
      // Default behavior is to copy it from original file
      try {
        var stats = fs.statSync(filename)
        options = extend({}, options)
        if (!options.mode) {
          options.mode = stats.mode
        }
        if (!options.chown && process.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid }
        }
      } catch (ex) {
        // ignore stat errors
      }
    }

    var fd = fs.openSync(tmpfile, 'w', options.mode)
    if (Buffer.isBuffer(data)) {
      fs.writeSync(fd, data, 0, data.length, 0)
    } else if (data != null) {
      fs.writeSync(fd, String(data), 0, String(options.encoding || 'utf8'))
    }
    fs.fsyncSync(fd)
    fs.closeSync(fd)
    if (options.chown) fs.chownSync(tmpfile, options.chown.uid, options.chown.gid)
    if (options.mode) fs.chmodSync(tmpfile, options.mode)
    fs.renameSync(tmpfile, filename)
  } catch (err) {
    try { fs.unlinkSync(tmpfile) } catch (e) {}
    throw err
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, "/index.js", __webpack_require__(2), __webpack_require__(5).Buffer))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(12)
var polyfills = __webpack_require__(83)
var legacy = __webpack_require__(85)
var queue = []

var util = __webpack_require__(18)

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    __webpack_require__(99).equal(queue.length, 0)
  })
}

module.exports = patch(__webpack_require__(29))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  module.exports = patch(fs)
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close =
fs.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync =
fs.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
  ReadStream.prototype.open = ReadStream$open

  var fs$WriteStream = fs.WriteStream
  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
  WriteStream.prototype.open = WriteStream$open

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(29)
var constants = __webpack_require__(84)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)
}

function patchLchmod (fs) {
  fs.lchmod = function (path, mode, callback) {
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        if (callback) callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          if (callback) callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var threw = true
    var ret
    try {
      ret = fs.fchmodSync(fd, mode)
      threw = false
    } finally {
      if (threw) {
        try {
          fs.closeSync(fd)
        } catch (er) {}
      } else {
        fs.closeSync(fd)
      }
    }
    return ret
  }
}

function patchLutimes (fs) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        if (er) {
          if (cb) cb(er)
          return
        }
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            if (cb) cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
      var ret
      var threw = true
      try {
        ret = fs.futimesSync(fd, at, mt)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}

function chmodFix (orig) {
  if (!orig) return orig
  return function (target, mode, cb) {
    return orig.call(fs, target, mode, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chmodFixSync (orig) {
  if (!orig) return orig
  return function (target, mode) {
    try {
      return orig.call(fs, target, mode)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function statFix (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target, cb) {
    return orig.call(fs, target, function (er, stats) {
      if (!stats) return cb.apply(this, arguments)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      if (cb) cb.apply(this, arguments)
    })
  }
}

function statFixSync (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target) {
    var stats = orig.call(fs, target)
    if (stats.uid < 0) stats.uid += 0x100000000
    if (stats.gid < 0) stats.gid += 0x100000000
    return stats;
  }
}

// ENOSYS means that the fs doesn't support the op. Just ignore
// that, because it doesn't matter.
//
// if there's no getuid, or if getuid() is something other
// than 0, and the error is EINVAL or EPERM, then just ignore
// it.
//
// This specific case is a silent failure in cp, install, tar,
// and most other unix tools that manage permissions.
//
// When running as root, or if other types of errors are
// encountered, then it's strict.
function chownErOk (er) {
  if (!er)
    return true

  if (er.code === "ENOSYS")
    return true

  var nonroot = !process.getuid || process.getuid() !== 0
  if (nonroot) {
    if (er.code === "EINVAL" || er.code === "EPERM")
      return true
  }

  return false
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = {"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Stream = __webpack_require__(86).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

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

module.exports = Stream;

var EE = __webpack_require__(13).EventEmitter;
var inherits = __webpack_require__(8);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(15);
Stream.Writable = __webpack_require__(93);
Stream.Duplex = __webpack_require__(94);
Stream.Transform = __webpack_require__(95);
Stream.PassThrough = __webpack_require__(96);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(16).Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(90);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(2)))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 92 */
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

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(34);

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15).Transform


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15).PassThrough


/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 98 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(18);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

exports.asyncMap = __webpack_require__(101)
exports.bindActor = __webpack_require__(35)
exports.chain = __webpack_require__(102)


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {
/*
usage:

// do something to a list of things
asyncMap(myListOfStuff, function (thing, cb) { doSomething(thing.foo, cb) }, cb)
// do more than one thing to each item
asyncMap(list, fooFn, barFn, cb)

*/

module.exports = asyncMap

function asyncMap () {
  var steps = Array.prototype.slice.call(arguments)
    , list = steps.shift() || []
    , cb_ = steps.pop()
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMap")
  if (!list) return cb_(null, [])
  if (!Array.isArray(list)) list = [list]
  var n = steps.length
    , data = [] // 2d array
    , errState = null
    , l = list.length
    , a = l * n
  if (!a) return cb_(null, [])
  function cb (er) {
    if (er && !errState) errState = er

    var argLen = arguments.length
    for (var i = 1; i < argLen; i ++) if (arguments[i] !== undefined) {
      data[i - 1] = (data[i - 1] || []).concat(arguments[i])
    }
    // see if any new things have been added.
    if (list.length > l) {
      var newList = list.slice(l)
      a += (list.length - l) * n
      l = list.length
      process.nextTick(function () {
        newList.forEach(function (ar) {
          steps.forEach(function (fn) { fn(ar, cb) })
        })
      })
    }

    if (--a === 0) cb_.apply(null, [errState].concat(data))
  }
  // expect the supplied cb function to be called
  // "n" times for each thing in the array.
  list.forEach(function (ar) {
    steps.forEach(function (fn) { fn(ar, cb) })
  })
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = chain
var bindActor = __webpack_require__(35)
chain.first = {} ; chain.last = {}
function chain (things, cb) {
  var res = []
  ;(function LOOP (i, len) {
    if (i >= len) return cb(null,res)
    if (Array.isArray(things[i]))
      things[i] = bindActor.apply(null,
        things[i].map(function(i){
          return (i===chain.first) ? res[0]
           : (i===chain.last)
             ? res[res.length - 1] : i }))
    if (!things[i]) return LOOP(i + 1, len)
    things[i](function (er, data) {
      if (er) return cb(er, res)
      if (data !== undefined) res = res.concat(data)
      LOOP(i + 1, len)
    })
  })(0, things.length) }


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @preserve
 * JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
 *
 * @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
 * @see http://github.com/homebrewing/brauhaus-diff
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */
(function(){
    var cache;

    // Call this function without `new` to use the cached object (good for
    // single-threaded environments), or with `new` to create a new object.
    //
    // @param {string} key A UTF-16 or ASCII string
    // @param {number} seed An optional positive integer
    // @return {object} A MurmurHash3 object for incremental hashing
    function MurmurHash3(key, seed) {
        var m = this instanceof MurmurHash3 ? this : cache;
        m.reset(seed)
        if (typeof key === 'string' && key.length > 0) {
            m.hash(key);
        }

        if (m !== this) {
            return m;
        }
    };

    // Incrementally add a string to this hash
    //
    // @param {string} key A UTF-16 or ASCII string
    // @return {object} this
    MurmurHash3.prototype.hash = function(key) {
        var h1, k1, i, top, len;

        len = key.length;
        this.len += len;

        k1 = this.k1;
        i = 0;
        switch (this.rem) {
            case 0: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) : 0;
            case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
            case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
            case 3:
                k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
        }

        this.rem = (len + this.rem) & 3; // & 3 is same as % 4
        len -= this.rem;
        if (len > 0) {
            h1 = this.h1;
            while (1) {
                k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;

                if (i >= len) {
                    break;
                }

                k1 = ((key.charCodeAt(i++) & 0xffff)) ^
                     ((key.charCodeAt(i++) & 0xffff) << 8) ^
                     ((key.charCodeAt(i++) & 0xffff) << 16);
                top = key.charCodeAt(i++);
                k1 ^= ((top & 0xff) << 24) ^
                      ((top & 0xff00) >> 8);
            }

            k1 = 0;
            switch (this.rem) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xffff);
            }

            this.h1 = h1;
        }

        this.k1 = k1;
        return this;
    };

    // Get the result of this hash
    //
    // @return {number} The 32-bit hash
    MurmurHash3.prototype.result = function() {
        var k1, h1;
        
        k1 = this.k1;
        h1 = this.h1;

        if (k1 > 0) {
            k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;
            h1 ^= k1;
        }

        h1 ^= this.len;

        h1 ^= h1 >>> 16;
        h1 = (h1 * 0xca6b + (h1 & 0xffff) * 0x85eb0000) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (h1 * 0xae35 + (h1 & 0xffff) * 0xc2b20000) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    };

    // Reset the hash object for reuse
    //
    // @param {number} seed An optional positive integer
    MurmurHash3.prototype.reset = function(seed) {
        this.h1 = typeof seed === 'number' ? seed : 0;
        this.rem = this.k1 = this.len = 0;
        return this;
    };

    // A cached object to use. This can be safely used if you're in a single-
    // threaded environment, otherwise you need to create new hashes to use.
    cache = new MurmurHash3();

    if (true) {
        module.exports = MurmurHash3;
    } else {
        this.MurmurHash3 = MurmurHash3;
    }
}());


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(1);
var message_constants_1 = __webpack_require__(0);
var Emitter = __webpack_require__(3);
var ONLY_EVENT = 'OE';
function validateQueryArguments(rest) {
    var users = null;
    var callback = null;
    if (rest.length === 1) {
        if (Array.isArray(rest[0])) {
            users = rest[0];
        } else {
            if (typeof rest[0] !== 'function') {
                throw new Error('invalid argument: "callback"');
            }
            callback = rest[0];
        }
    } else if (rest.length === 2) {
        users = rest[0];
        callback = rest[1];
        if (!Array.isArray(users) || typeof callback !== 'function') {
            throw new Error('invalid argument: "users" or "callback"');
        }
    }
    return { users: users, callback: callback };
}

var PresenceHandler = function () {
    function PresenceHandler(services, options) {
        _classCallCheck(this, PresenceHandler);

        this.services = services;
        this.subscriptionEmitter = new Emitter();
        this.globalSubscriptionEmitter = new Emitter();
        this.queryEmitter = new Emitter();
        this.queryAllEmitter = new Emitter();
        this.services.connection.registerHandler(message_constants_1.TOPIC.PRESENCE, this.handle.bind(this));
        this.services.connection.onExitLimbo(this.onExitLimbo.bind(this));
        this.services.connection.onLost(this.onExitLimbo.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
        this.counter = 0;
        this.pendingSubscribes = new Set();
        this.pendingUnsubscribes = new Set();
        this.limboQueue = [];
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
                if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
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
                if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
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
            if (this.services.connection.isConnected) {
                this.sendQuery(message);
            } else if (this.services.connection.isInLimbo) {
                this.limboQueue.push(message);
            } else {
                this.services.timerRegistry.requestIdleCallback(function () {
                    emitter.emit(emitterAction, constants_1.EVENT.CLIENT_OFFLINE);
                });
            }
            if (callback) {
                emitter.once(emitterAction, callback);
                return;
            }
            return new Promise(function (resolve, reject) {
                emitter.once(emitterAction, function (error, results) {
                    return error ? reject(error) : resolve(results);
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
                this.services.timeoutRegistry.remove(message);
                return;
            }
            if (message.action === message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE) {
                this.queryEmitter.emit(message.correlationId, null, message.parsedData);
                this.services.timeoutRegistry.remove(message);
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
            this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
        }
    }, {
        key: "sendQuery",
        value: function sendQuery(message) {
            this.services.connection.sendMessage(message);
            this.services.timeoutRegistry.add({ message: message });
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
    }, {
        key: "onConnectionReestablished",
        value: function onConnectionReestablished() {
            var keys = this.subscriptionEmitter.eventNames();
            if (keys.length > 0) {
                this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, keys);
            }
            var hasGlobalSubscription = this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT);
            if (hasGlobalSubscription) {
                this.subscribeToAllChanges();
            }
            for (var i = 0; i < this.limboQueue.length; i++) {
                this.sendQuery(this.limboQueue[i]);
            }
            this.limboQueue = [];
        }
    }, {
        key: "onExitLimbo",
        value: function onExitLimbo() {
            var _this = this;

            this.queryEmitter.eventNames().forEach(function (correlationId) {
                _this.queryEmitter.emit(correlationId, constants_1.EVENT.CLIENT_OFFLINE);
            });
            this.queryAllEmitter.emit(ONLY_EVENT, constants_1.EVENT.CLIENT_OFFLINE);
            this.limboQueue = [];
            this.queryAllEmitter.off();
            this.queryEmitter.off();
        }
    }]);

    return PresenceHandler;
}();

exports.PresenceHandler = PresenceHandler;

/***/ })
/******/ ]);
});