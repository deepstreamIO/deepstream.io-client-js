import Emitter = require("component-emitter")
import { Record } from "./Record";
import { RecordHandler } from "./RecordHandler";

/**
 * An AnonymousRecord is a record without a predefined name. It
 * acts like a wrapper around an actual record that can
 * be swapped out for another one whilst keeping all bindings intact.
 *
 * Imagine a customer relationship management system with a list of users
 * on the left and a user detail panel on the right. The user detail
 * panel could use the anonymous record to set up its bindings, yet whenever
 * a user is chosen from the list of existing users the anonymous record's
 * setName method is called and the detail panel will update to
 * show the selected user's details
 *
 * @param {RecordHandler} recordHandler
 *
 * @constructor
 */
export class AnonymousRecord extends Record {
	private _recordHandler: RecordHandler;
	private _record: Record;
	private _subscriptions: any[]; // TODO: Type

	public constructor(recordHandler: RecordHandler) {
		super();

		this.name = undefined as any;
		this._recordHandler = recordHandler;
		this._record = undefined as any;
		this._subscriptions = [];
		this._proxyMethod( 'delete' );
		this._proxyMethod( 'set' );
		this._proxyMethod( 'discard' );
	}

	/**
	 * Proxies the actual record's get method. It is valid
	 * to call get prior to setName - if no record exists,
	 * the method returns undefined
	 *
	 * @param   {[String]} path A json path. If non is provided,
	 *                          the entire record is returned.
	 *
	 * @public
	 * @returns {mixed}    the value of path or the entire object
	 */
	public get(path: string): any {
		if( this._record === null ) {
			return undefined;
		}

		return this._record.get( path );
	}

	/**
	 * Proxies the actual record's subscribe method. The same parameters
	 * can be used. Can be called prior to setName(). Please note, triggerIfReady
	 * will always be set to true to reflect changes in the underlying record.
	 *
	 * @param   {[String]} path 	A json path. If non is provided,
	 *	                          	it subscribes to changes for the entire record.
	 *
	 * @param 	{Function} callback A callback function that will be invoked whenever
	 *                              the subscribed path or record updates
	 *
	 * @public
	 * @returns {void}
	 */
	public subscribe(...args: any[]): void {
		var parameters = Record.prototype._normalizeArguments( args );
		parameters.triggerNow = true;
		this._subscriptions.push( parameters );

		if( this._record !== null ) {
			this._record.subscribe( parameters );
		}
	}

	/**
	 * Proxies the actual record's unsubscribe method. The same parameters
	 * can be used. Can be called prior to setName()
	 *
	 * @param   {[String]} path 	A json path. If non is provided,
	 *	                          	it subscribes to changes for the entire record.
	 *
	 * @param 	{Function} callback A callback function that will be invoked whenever
	 *                              the subscribed path or record updates
	 *
	 * @public
	 * @returns {void}
	 */
	public unsubscribe(...args: any[]): void {
		let parameters = Record.prototype._normalizeArguments( args ),
			subscriptions = [],
			i;

		for( i = 0; i < this._subscriptions.length; i++ ) {
			if(
				this._subscriptions[ i ].path !== parameters.path ||
				this._subscriptions[ i ].callback !== parameters.callback
			) {
				subscriptions.push( this._subscriptions[ i ] );
			}
		}

		this._subscriptions = subscriptions;

		if( this._record !== null ) {
			this._record.unsubscribe( parameters );
		}
	}

	/**
	 * Sets the underlying record the anonymous record is bound
	 * to. Can be called multiple times.
	 *
	 * @param {String} recordName
	 *
	 * @public
	 * @returns {void}
	 */
	public setName(recordName: string): void {
		this.name = recordName;

		let i: number;

		if( this._record !== null && !this._record.isDestroyed) {
			for( i = 0; i < this._subscriptions.length; i++ ) {
				this._record.unsubscribe( this._subscriptions[ i ] );
			}
			this._record.discard();
		}

		this._record = this._recordHandler.getRecord( recordName );

		for( i = 0; i < this._subscriptions.length; i++ ) {
			this._record.subscribe( this._subscriptions[ i ] );
		}

		this._record.whenReady( this.emit.bind( this, 'ready' ) );
		this.emit( 'nameChanged', recordName );
	}

	/**
	 * Adds the specified method to this method and forwards it
	 * to _callMethodOnRecord
	 *
	 * @param   {String} methodName
	 *
	 * @private
	 * @returns {void}
	 */
	private _proxyMethod(methodName: string): void {
		this[ methodName ] = this._callMethodOnRecord.bind( this, methodName );
	}

	/**
	 * Invokes the specified method with the provided parameters on
	 * the underlying record. Throws erros if the method is not
	 * specified yet or doesn't expose the method in question
	 *
	 * @param   {String} methodName
	 *
	 * @private
	 * @returns {Mixed} the return value of the actual method
	 */
	private _callMethodOnRecord(methodName: string): any {
		if( this._record === null ) {
			throw new Error( 'Can`t invoke ' + methodName + '. AnonymousRecord not initialised. Call setName first' );
		}

		if( typeof this._record[ methodName ] !== 'function' ) {
			throw new Error( methodName + ' is not a method on the record' );
		}

		var args = Array.prototype.slice.call( arguments, 1 );

		return this._record[ methodName ].apply( this._record, args );
	}
}
