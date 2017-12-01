/**
 * Removes whitespace from the beginning and end of a string
 */
export declare const trim: (inputString: string) => string;
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
export declare const deepEquals: (objA: any, objB: any) => boolean;
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
export declare const deepCopy: (obj: any) => any;
/**
 * Copy the top level of items, but do not copy its items recourisvely. This
 * is much quicker than deepCopy does not guarantee the object items are new/unique.
 * Mainly used to change the reference to the actual object itself, but not its children.
 */
export declare const shallowCopy: (obj: any) => any;
/**
 * Take the url passed when creating the client and ensure the correct
 * protocol is provided
 * @param  {String} url Url passed in by client
 * @return {String} Url with supported protocol
 */
export declare const parseUrl: (initialURl: string, defaultPath: string) => string;
/**
* Returns a random string. The first block of characters
* is a timestamp, in order to allow databases to optimize for semi-
* sequentuel numberings
*/
export declare const getUid: () => string;
export interface RecordSetArguments {
    callback?: (error: string | null, recordName: string) => void;
    path?: string;
    data?: any;
}
export interface RecordSubscribeArguments {
    callback: (data: any) => void;
    path?: string;
    triggerNow?: boolean;
}
/**
 * Creates a map based on the types of the provided arguments
 */
export declare const normalizeSetArguments: (args: IArguments, startIndex?: number) => RecordSetArguments;
/**
 * Creates a map based on the types of the provided arguments
 */
export declare const normalizeArguments: (args: IArguments) => RecordSubscribeArguments;
