"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Takes a key-value map and returns
 * a map with { value: key } of the old map
 */
function reverseMap(map) {
    const reversedMap = {};
    for (const key in map) {
        reversedMap[map[key]] = key;
    }
    return reversedMap;
}
exports.reverseMap = reverseMap;
/**
 * Like reverseMap but the values will be cast using Number(k)
 */
function reverseMapNumeric(map) {
    const reversedMap = {};
    for (const key in map) {
        reversedMap[map[key]] = Number(key);
    }
    return reversedMap;
}
exports.reverseMapNumeric = reverseMapNumeric;
/**
 * convertMap({ a: { x: 1 }, b: { x: 2 }, c: { x : 3 } }, 'x', 'y')
 *  ===
 * { a: { y: 1 }, b: { y: 2 }, c: { y : 3 } }
 */
function convertMap(map, from, to) {
    const result = {};
    for (const key in map) {
        result[map[key][from]] = map[key][to];
    }
    return result;
}
exports.convertMap = convertMap;
//# sourceMappingURL=utils.js.map