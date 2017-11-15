/**
* Returns the value of the path or
* undefined if the path can't be resolved
*/
export declare function get(data: any, path: string | null, deepCopy: boolean): any;
/**
 * This class allows to set or get specific
 * values within a json data structure using
 * string-based paths
 */
export declare function setValue(root: any, path: string | null, value: any): any;
