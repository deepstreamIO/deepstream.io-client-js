import URL = require('url');
import Timer = NodeJS.Timer;

/**
 * A regular expression that matches whitespace on either side, but
 * not in the center of a string
 *
 * @type {RegExp}
 */
export const TRIM_REGULAR_EXPRESSION = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Used in typeof comparisons
 *
 * @type {String}
 */
export const OBJECT = 'object';

/**
 * True if environment is node, false if it's a browser
 * This seems somewhat inelegant, if anyone knows a better solution,
 * let's change this (must identify browserify's pseudo node implementation though)
 *
 * @public
 * @type {Boolean}
 */
export const isNode = typeof process !== 'undefined' && process.toString() === '[object process]';

/**
 * Provides as soon as possible async execution in a cross
 * platform way
 *
 * @param   {Function} fn the function to be executed in an asynchronous fashion
 *
 * @public
 * @returns {void}
 */
export function nextTick(fn: () => void) {
    if (isNode) {
        process.nextTick(fn);
    } else {
        timeout(fn, 0);
    }
}

/**
 * Removes whitespace from the beginning and end of a string
 *
 * @param   {String} inputString
 *
 * @public
 * @returns {String} trimmedString
 */
export function trim(inputString: string): string {
    if (inputString.trim) {
        return inputString.trim();
    } else {
        return inputString.replace(TRIM_REGULAR_EXPRESSION, '');
    }
}

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
 *
 * @param   {Mixed} objA
 * @param   {Mixed} objB
 *
 * @public
 * @returns {Boolean} isEqual
 */
export function deepEquals(objA: any, objB: any): boolean {
    if (objA === objB) {
        return true
    }
    else if (typeof objA !== OBJECT || typeof objB !== OBJECT) {
        return false;
    }
    else {
        return JSON.stringify(objA) === JSON.stringify(objB);
    }
}

/**
 * Similar to deepEquals above, tests have shown that JSON stringify outperforms any attempt of
 * a code based implementation by 50% - 100% whilst also handling edge-cases and keeping implementation
 * complexity low.
 *
 * If ES6/7 ever decides to implement deep copying natively (what happened to Object.clone? that was briefly
 * a thing...), let's switch it for the native implementation. For now though, even Object.assign({}, obj) only
 * provides a shallow copy.
 *
 * Please find performance test results backing these statements here:
 *
 * http://jsperf.com/object-deep-copy-assign
 *
 * @param   {Mixed} obj the object that should be cloned
 *
 * @public
 * @returns {Mixed} clone
 */
export function deepCopy<T>(obj: T): T {
    if (typeof obj === OBJECT) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
}

/**
 * Copy the top level of items, but do not copy its items recourisvely. This
 * is much quicker than deepCopy does not guarantee the object items are new/unique.
 * Mainly used to change the reference to the actual object itself, but not its children.
 *
 * @param   {Mixed} obj the object that should cloned
 *
 * @public
 * @returns {Mixed} clone
 */
export function shallowCopy<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.slice(0) as any as T;
    }
    else if (typeof obj === OBJECT) {
        let copy = Object.create(null);
        let props = Object.keys(obj);
        for (let i = 0; i < props.length; i++) {
            copy[props[i]] = (obj as any)[props[i]];
        }
        return copy;
    }
    return obj;
}

/// A type that is returned by `timeout` and `interval` that can be used to cancel them.
export type ScheduledEventHandler = number | Timer;

/**
 * Set timeout utility that adds support for disabling a timeout
 * by passing null
 *
 * @param {Function} callback        the function that will be called after the given time
 * @param {Number}   timeoutDuration the duration of the timeout in milliseconds
 *
 * @public
 * @returns {ScheduledEventHandler} timeoutId
 */
export function timeout(callback: () => void, timeoutDuration: number): ScheduledEventHandler {
    if (timeoutDuration !== null) {
        return setTimeout(callback, timeoutDuration);
    } else {
        return -1;
    }
}

/**
 * Cancels a timeout
 *
 * @param {ScheduledEventHandler} handler        the handler of the timeout to cancel
 *
 * @public
 * @returns {void}
 */
export function cancelTimeout(handler: ScheduledEventHandler): void {
    clearTimeout(handler as any);
}

/**
 * Set Interval utility that adds support for disabling an interval
 * by passing null
 *
 * @param {Function} callback        the function that will be called after the given time
 * @param {Number}   intervalDuration the duration of the interval in milliseconds
 *
 * @public
 * @returns {ScheduledEventHandler} intervalId        NodeJS returns a `Timer` object and the browser returns a number
 */
export function interval(callback: () => void, intervalDuration: number): ScheduledEventHandler {
    if (intervalDuration !== undefined) {
        return setInterval(callback, intervalDuration);
    } else {
        return -1;
    }
}

/**
 * Cancels an interval
 *
 * @param {ScheduledEventHandler} handler        the handler of the interval to cancel
 *
 * @public
 * @returns {void}
 */
export function cancelInterval(handler: ScheduledEventHandler): void {
    clearInterval(handler as any);
}

/**
 * Used to see if a protocol is specified within the url
 * @type {RegExp}
 */
export const hasUrlProtocol = /^wss:|^ws:|^\/\//;

/**
 * Used to see if the protocol contains any unsupported protocols
 * @type {RegExp}
 */
export const unsupportedProtocol = /^http:|^https:/;

/**
 * Take the url passed when creating the client and ensure the correct
 * protocol is provided
 * @param  {String} url Url passed in by client
 * @return {String} Url with supported protocol
 */
export function parseUrl(url: string, defaultPath: string): string {
    if (unsupportedProtocol.test(url)) {
        throw new Error('Only ws and wss are supported');
    }
    if (!hasUrlProtocol.test(url)) {
        url = 'ws://' + url;
    } else if (url.indexOf('//') === 0) {
        url = 'ws:' + url;
    }
    let serverUrl = URL.parse(url);
    if (!serverUrl.host) {
        throw new Error('invalid url, missing host');
    }
    serverUrl.protocol = serverUrl.protocol ? serverUrl.protocol : 'ws:';
    serverUrl.pathname = serverUrl.pathname ? serverUrl.pathname : defaultPath;
    return URL.format(serverUrl);
}