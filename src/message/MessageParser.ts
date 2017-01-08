import { Actions, MessagePartSeparator } from "../constants/Constants";
import { Client } from "../Client";

export interface ParsedMessage {
    raw: string,
    topic: string,
    action: string,
    data: string[],
    processedError?: boolean
}


/**
 * Parses ASCII control character seperated
 * message strings into digestable maps
 *
 * @constructor
 */
export class MessageParser {
    private _actions: {[key: string]: string};

    public constructor() {
        this._actions = this._getActions();
    }

    /**
     * Main interface method. Receives a raw message
     * string, containing one or more messages
     * and returns an array of parsed message objects
     * or null for invalid messages
     *
     * @param   {String} message raw message
     *
     * @public
     *
     * @returns {Array} array of parsed message objects
     *                  following the format
     *                  {
	 *                  	raw: <original message string>
	 *                  	topic: <string>
	 *                  	action: <string - shortcode>
	 *                  	data: <array of strings>
	 *                  }
     */
    public parse(message: string, client: Client): ParsedMessage[] {
        let parsedMessages: ParsedMessage[] = [],
            rawMessages = message.split(C.MESSAGE_SEPERATOR),
            i: number;

        for (i = 0; i < rawMessages.length; i++) {
            if (rawMessages[i].length > 2) {
                parsedMessages.push(this._parseMessage(rawMessages[i], client));
            }
        }

        return parsedMessages;
    }

    /**
     * Deserializes values created by MessageBuilder.typed to
     * their original format
     *
     * @param {String} value
     *
     * @public
     * @returns {Mixed} original value
     */
    public convertedType(value: string, client: Client): any {
        let type = value.charAt(0);

        if (type === C.TYPES.STRING) {
            return value.substr(1);
        }

        if (type === C.TYPES.OBJECT) {
            try {
                return JSON.parse(value.substr(1));
            } catch (e) {
                client._$onError(C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, e.toString() + '(' + value + ')');
                return;
            }
        }

        if (type === C.TYPES.NUMBER) {
            return parseFloat(value.substr(1));
        }

        if (type === C.TYPES.NULL) {
            return null;
        }

        if (type === C.TYPES.TRUE) {
            return true;
        }

        if (type === C.TYPES.FALSE) {
            return false;
        }

        if (type === C.TYPES.UNDEFINED) {
            return undefined;
        }

        client._$onError(C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'UNKNOWN_TYPE (' + value + ')');
    }

    /**
     * Turns the ACTION:SHORTCODE constants map
     * around to facilitate shortcode lookup
     *
     * @private
     *
     * @returns {Object} actions
     */
    private _getActions(): {[key: string]: string} {
        let actions: {[key: string]: string} = {},
            key: string;

        for (key in Actions) {
            actions[(Actions as any)[key]] = key;
        }

        return actions;
    }

    /**
     * Parses an individual message (as oposed to a
     * block of multiple messages as is processed by .parse())
     *
     * @param   {String} message
     *
     * @private
     *
     * @returns {Object} parsedMessage
     */
    private _parseMessage(message: string, client: Client): ParsedMessage | undefined {
        let parts = message.split(MessagePartSeparator);

        if (parts.length < 2) {
            // message.processedError = true; // I'm not sure this is correct since it's being set on a primitive
            client._$onError(C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'Insufficiant message parts');
            return undefined;
        }

        if (this._actions[parts[1]] === undefined) {
            // message.processedError = true;
            client._$onError(C.TOPIC.ERROR, C.EVENT.MESSAGE_PARSE_ERROR, 'Unknown action ' + parts[1]);
            return undefined;
        }
        return {
            raw: message,
            topic: parts[0],
            action: parts[1],
            data: parts.splice(2)
        };
    }
}
