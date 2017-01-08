let PartsRegularExpression = /([^\.\[\]\s]+)/g;
let cache = Object.create(null);

export let JSONPath = {
    /**
     * Returns the value of the path or
     * undefined if the path can't be resolved
     *
     * @public
     * @returns {Mixed}
     */
    get(data: any, path: string, deepCopy: boolean): any {
        let tokens = this.tokenize(path);

        for (let i = 0; i < tokens.length; i++) {
            if (data === undefined) {
                return undefined;
            }
            if (typeof data !== 'object') {
                throw new Error('invalid data or path');
            }
            data = data[tokens[i]];
        }

        return deepCopy !== false ? utils.deepCopy(data) : data;
    },

    /**
     * Sets the value of the path. If the path (or parts
     * of it) doesn't exist yet, it will be created
     *
     * @param {Mixed} value
     *
     * @public
     * @returns {Mixed} updated value
     */
    set(data: any, path: string, value: any, deepCopy: boolean): any {
        let tokens = this.tokenize(path);

        if (tokens.length === 0) {
            return this.patch(data, value, deepCopy);
        }

        let oldValue = this.module.exports.get(data, path, false);
        let newValue = this.patch(oldValue, value, deepCopy);

        if (newValue === oldValue) {
            return data;
        }

        let result = utils.shallowCopy(data);

        let node = result;
        for (let i = 0; i < tokens.length; i++) {
            if (i === tokens.length - 1) {
                node[tokens[i]] = newValue;
            }
            else if (node[tokens[i]] !== undefined) {
                node = node[tokens[i]] = utils.shallowCopy(node[tokens[i]]);
            }
            else if (tokens[i + 1] && !isNaN(tokens[i + 1])) {
                node = node[tokens[i]] = [];
            }
            else {
                node = node[tokens[i]] = Object.create(null);
            }
        }

        return result;
    },

    /**
     * Merge the new value into the old value
     * @param  {Mixed} oldValue
     * @param  {Mixed} newValue
     * @param  {boolean} deepCopy
     * @return {Mixed}
     */
    patch(oldValue: any, newValue: any, deepCopy: boolean): any {
        let i: number;

        if (utils.deepEquals(oldValue, newValue)) {
            return oldValue;
        }
        else if (oldValue === null || newValue === null) {
            return newValue;
        }
        else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
            let arr: any[] = [];
            for (i = 0; i < newValue.length; i++) {
                arr[i] = this.patch(oldValue[i], newValue[i], deepCopy);
            }
            return arr;
        }
        else if (!Array.isArray(newValue) && typeof oldValue === 'object' && typeof newValue === 'object') {
            let props = Object.keys(newValue);
            let obj = Object.create(null);
            for (i = 0; i < props.length; i++) {
                obj[props[i]] = this.patch(oldValue[props[i]], newValue[props[i]], deepCopy);
            }
            return obj;
        }
        else {
            return deepCopy !== false ? utils.deepCopy(newValue) : newValue;
        }
    },

    /**
     * Parses the path. Splits it into
     * keys for objects and indices for arrays.
     *
     * @returns Array of tokens
     */
    tokenize(path: string) {
        if (cache[path]) {
            return cache[path];
        }

        let parts = String(path) !== 'undefined' ? String(path).match(PartsRegularExpression) : [];

        if (!parts) {
            throw new Error('invalid path ' + path)
        }

        return cache[path] = parts.map(part => !isNaN(parseInt(part)) ? parseInt(part, 10) : part );
    }
};
