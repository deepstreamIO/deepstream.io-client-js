/**
 * Takes a key-value map and returns
 * a map with { value: key } of the old map
 */
export declare function reverseMap(map: any): any;
/**
 * Like reverseMap but the values will be cast using Number(k)
 */
export declare function reverseMapNumeric(map: {
    [k: number]: number;
}): object;
/**
 * convertMap({ a: { x: 1 }, b: { x: 2 }, c: { x : 3 } }, 'x', 'y')
 *  ===
 * { a: { y: 1 }, b: { y: 2 }, c: { y : 3 } }
 */
export declare function convertMap(map: any, from: any, to: any): any;
