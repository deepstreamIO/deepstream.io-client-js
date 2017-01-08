import { MessageSeparator, Types } from "../constants/Constants";

export const MessageBuilder = {
	/**
	 * Creates a deepstream message string, based on the
	 * provided parameters
	 *
	 * @param   {String} topic  One of CONSTANTS.TOPIC
	 * @param   {String} action One of CONSTANTS.ACTIONS
	 * @param   {Array} data An array of strings or JSON-serializable objects
	 *
	 * @returns {String} deepstream message string
	 */
	getMsg(topic: string, action: string, data: any[]): string {
		if( data && !(data instanceof Array) ) {
			throw new Error( 'data must be an array' );
		}
		let sendData = [ topic, action ],
			i: number;

		if( data ) {
			for( i = 0; i < data.length; i++ ) {
				if( typeof data[ i ] === 'object' ) {
					sendData.push( JSON.stringify( data[ i ] ) );
				} else {
					sendData.push( data[ i ] );
				}
			}
		}

		return sendData.join(MessageSeparator) + MessageSeparator;
	},

	/**
	 * Converts a serializable value into its string-representation and adds
	 * a flag that provides instructions on how to deserialize it.
	 *
	 * Please see messageParser.convertTyped for the counterpart of this method
	 *
	 * @param {Mixed} value
	 *
	 * @public
	 * @returns {String} string representation of the value
	 */
	typed(value: any): string {
		let type = typeof value;

		if( type === 'string' ) {
			return Types.STRING + value;
		}

		if( value === null ) {
			return Types.NULL;
		}

		if( type === 'object' ) {
			return Types.OBJECT + JSON.stringify( value );
		}

		if( type === 'number' ) {
			return Types.NUMBER + value.toString();
		}

		if( value === true ) {
			return Types.TRUE;
		}

		if( value === false ) {
			return Types.FALSE;
		}

		if( value === undefined ) {
			return Types.UNDEFINED;
		}

		throw new Error( 'Can\'t serialize type ' + value );
	}
};
