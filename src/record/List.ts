import { RecordHandler } from "./RecordHandler";
import Emitter = require("component-emitter");
import { Record } from "./Record";
import { Actions } from "../constants/Constants";
import { ParsedMessage } from "../message/MessageParser";

const ENTRY_ADDED_EVENT = 'entry-added';
const ENTRY_REMOVED_EVENT = 'entry-removed';
const ENTRY_MOVED_EVENT = 'entry-moved';

/**
 * A List is a specialised Record that contains
 * an Array of recordNames and provides a number
 * of convinience methods for interacting with them.
 *
 * @param {RecordHanlder} recordHandler
 * @param {String} name    The name of the list
 *
 * @constructor
 */
export class List extends Emitter {
    private _recordHandler: RecordHandler;
    private _record: Record;
    public isDestroyed: boolean;
    public isReady: boolean;
    public name: string;
    private _queuedMethods: any[];
    private _beforeStructure?: List.RecordStructure;
    private _hasAddListener: boolean;
    private _hasRemoveListener: boolean;
    private _hasMoveListener: boolean;
    public delete: () => void;
    public discard: () => void;
    public whenReady: (callback: () => void) => void;

    public constructor(recordHandler: RecordHandler, name: string, options: any) { // TODO: Options type
        super();

        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }

        this._recordHandler = recordHandler;
        this._record = this._recordHandler.getRecord(name, options);
        this._record._applyUpdate = this._applyUpdate.bind(this);

        this._record.on('delete', this.emit.bind(this, 'delete'));
        this._record.on('discard', this._onDiscard.bind(this));
        this._record.on('ready', this._onReady.bind(this));

        this.isDestroyed = this._record.isDestroyed;
        this.isReady = this._record.isReady;
        this.name = name;
        this._queuedMethods = [];
        this._beforeStructure = undefined as any;
        this._hasAddListener = undefined as any;
        this._hasRemoveListener = undefined as any;
        this._hasMoveListener = undefined as any;

        this.delete = this._record.delete.bind(this._record);
        this.discard = this._record.discard.bind(this._record);
        this.whenReady = this._record.whenReady.bind(this);
    }

    /**
     * Returns the array of list entries or an
     * empty array if the list hasn't been populated yet.
     *
     * @public
     * @returns {Array} entries
     */
    public getEntries(): string[] {
        let entries = this._record.get();

        if (!( entries instanceof Array )) {
            return [];
        }

        return entries;
    }

    /**
     * Returns true if the list is empty
     *
     * @public
     * @returns {Boolean} isEmpty
     */
    public isEmpty(): boolean {
        return this.getEntries().length === 0;
    }

    /**
     * Updates the list with a new set of entries
     *
     * @public
     * @param {Array} entries
     */
    public setEntries(entries: string[]): void {
        let errorMsg = 'entries must be an array of record names',
            i: number;

        if (!( entries instanceof Array )) {
            throw new Error(errorMsg);
        }

        for (i = 0; i < entries.length; i++) {
            if (typeof entries[i] !== 'string') {
                throw new Error(errorMsg);
            }
        }

        if (this._record.isReady === false) {
            this._queuedMethods.push(this.setEntries.bind(this, entries));
        } else {
            this._beforeChange();
            this._record.set(entries);
            this._afterChange();
        }
    }

    /**
     * Removes an entry from the list
     *
     * @param   {String} entry
     * @param {Number} [index]
     *
     * @public
     * @returns {void}
     */
    public removeEntry(entry: string, index?: number): void {
        if (this._record.isReady === false) {
            this._queuedMethods.push(this.removeEntry.bind(this, entry));
            return;
        }

        var currentEntries = this._record.get(),
            hasIndex = this._hasIndex(index),
            entries = [],
            i;

        for (i = 0; i < currentEntries.length; i++) {
            if (currentEntries[i] !== entry || ( hasIndex && index !== i )) {
                entries.push(currentEntries[i]);
            }
        }
        this._beforeChange();
        this._record.set(entries);
        this._afterChange();
    }

    /**
     * Adds an entry to the list
     *
     * @param {String} entry
     * @param {Number} [index]
     *
     * @public
     * @returns {void}
     */
    public addEntry(entry: string, index?: number): void {
        if (typeof entry !== 'string') {
            throw new Error('Entry must be a recordName');
        }

        if (this._record.isReady === false) {
            this._queuedMethods.push(this.addEntry.bind(this, entry));
            return;
        }

        let hasIndex = this._hasIndex(index);
        let entries = this.getEntries();
        if (hasIndex) {
            entries.splice(index as number, 0, entry);
        } else {
            entries.push(entry);
        }
        this._beforeChange();
        this._record.set(entries);
        this._afterChange();
    }

    /**
     * Proxies the underlying Record's subscribe method. Makes sure
     * that no path is provided
     *
     * @public
     * @returns {void}
     */
    public subscribe(path: string, callback: Record.SubscribeCallback): void;
    public subscribe(callback: Record.SubscribeCallback): void;
    public subscribe(...args: any[]): void {
        let parameters = Record.prototype._normalizeArguments(args);

        if (parameters.path) {
            throw new Error('path is not supported for List.subscribe');
        }

        if (!parameters.callback) {
            throw new Error("No callback");
        }

        // Make sure the callback is invoked with an empty array for new records
        let listCallback = ((callback: Record.SubscribeCallback) => {
            callback(this.getEntries());
        }).bind(this, parameters.callback);

        /**
         * Adding a property onto a function directly is terrible practice,
         * and we will change this as soon as we have a more seperate approach
         * of creating lists that doesn't have records default state.
         *
         * The reason we are holding a referencing to wrapped array is so that
         * on unsubscribe it can provide a reference to the actual method the
         * record is subscribed too.
         **/
        (parameters.callback as any).wrappedCallback = listCallback;
        parameters.callback = listCallback;

        if (parameters.callback) {
            if (parameters.path) {
                this._record.subscribe(parameters.path, parameters.callback);
            } else {
                this._record.subscribe(parameters.callback);
            }
        }
    }

    /**
     * Proxies the underlying Record's unsubscribe method. Makes sure
     * that no path is provided
     *
     * @public
     * @returns {void}
     */
    public unsubscribe(path: string, callback: Record.SubscribeCallback): void;
    public unsubscribe(callback: Record.SubscribeCallback): void;
    public unsubscribe(...args: any[]): void {
        let parameters = Record.prototype._normalizeArguments(args);

        if (parameters.path) {
            throw new Error('path is not supported for List.unsubscribe');
        }

        parameters.callback = (parameters.callback as any).wrappedCallback;
        if (parameters.callback) {
            if (parameters.path) {
                this._record.unsubscribe(parameters.path, parameters.callback);
            } else {
                this._record.unsubscribe(parameters.callback);
            }
        }
    }

    /**
     * Listens for changes in the Record's ready state
     * and applies them to this list
     *
     * @private
     * @returns {void}
     */
    private _onReady(): void {
        this.isReady = true;

        for (var i = 0; i < this._queuedMethods.length; i++) {
            this._queuedMethods[i]();
        }

        this.emit('ready');
    }

    /**
     * Listens for the record discard event and applies
     * changes to list
     *
     * @private
     * @returns {void}
     */
    private _onDiscard(): void {
        this.isDestroyed = true;
        this.emit('discard');
    }

    /**
     * Proxies the underlying Record's _update method. Set's
     * data to an empty array if no data is provided.
     *
     * @param   {null}   path must (should :-)) be null
     * @param   {Array}  data
     *
     * @private
     * @returns {void}
     */
    private _applyUpdate(message: ParsedMessage): void {
        if (message.action === Actions.PATCH) {
            throw new Error('PATCH is not supported for Lists');
        }

        if (message.data[2].charAt(0) !== '[') {
            message.data[2] = '[]';
        }

        this._beforeChange();
        Record.prototype._applyUpdate.call(this._record, message);
        this._afterChange();
    }

    /**
     * Validates that the index provided is within the current set of entries.
     *
     * @param {Number} index
     *
     * @private
     * @returns {Number}
     */
    private _hasIndex(index?: number): boolean {
        let hasIndex = false;
        let entries = this.getEntries();
        if (index !== undefined) {
            if (isNaN(index)) {
                throw new Error('Index must be a number');
            }
            if (index !== entries.length && ( index >= entries.length || index < 0 )) {
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
     *
     * @private
     * @returns {void}
     */
    private _beforeChange(): void {
        this._hasAddListener = this.listeners(ENTRY_ADDED_EVENT).length > 0;
        this._hasRemoveListener = this.listeners(ENTRY_REMOVED_EVENT).length > 0;
        this._hasMoveListener = this.listeners(ENTRY_MOVED_EVENT).length > 0;

        if (this._hasAddListener || this._hasRemoveListener || this._hasMoveListener) {
            this._beforeStructure = this._getStructure();
        } else {
            this._beforeStructure = undefined;
        }
    }

    /**
     * Compares the structure of the list after a change to its previous structure and notifies
     * any add / move / remove listener. Won't do anything if no listeners are attached.
     *
     * @private
     * @returns {void}
     */
    private _afterChange(): void {
        if (this._beforeStructure === null) {
            return;
        }

        let after = this._getStructure();
        let before = this._beforeStructure;

        if (!before) throw new Error("No before structure");

        if (this._hasRemoveListener) {
            for (let entry in before) {
                for (let i = 0; i < before[entry].length; i++) {
                    if (after[entry] === undefined || after[entry][i] === undefined) {
                        this.emit(ENTRY_REMOVED_EVENT, entry, before[entry][i]);
                    }
                }
            }
        }

        if (this._hasAddListener || this._hasMoveListener) {
            for (let entry in after) {
                if (before[entry] === undefined) {
                    for (let i = 0; i < after[entry].length; i++) {
                        this.emit(ENTRY_ADDED_EVENT, entry, after[entry][i]);
                    }
                } else {
                    for (let i = 0; i < after[entry].length; i++) {
                        if (before[entry][i] !== after[entry][i]) {
                            if (before[entry][i] === undefined) {
                                this.emit(ENTRY_ADDED_EVENT, entry, after[entry][i]);
                            } else {
                                this.emit(ENTRY_MOVED_EVENT, entry, after[entry][i]);
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
	 * 	'recordA': [ 0, 3 ],
	 * 	'recordB': [ 1 ],
	 * 	'recordC': [ 2 ]
	 * }
     *
     * @private
     * @returns {Array} structure
     */
    private _getStructure(): List.RecordStructure {
        let structure: List.RecordStructure = {};
        let i: number;
        let entries = this._record.get();

        for (i = 0; i < entries.length; i++) {
            if (structure[entries[i]] === undefined) {
                structure[entries[i]] = [i];
            } else {
                structure[entries[i]].push(i);
            }
        }

        return structure;
    }
}

export namespace List {
    export type RecordStructure = {[record: string]: number[]};
}
