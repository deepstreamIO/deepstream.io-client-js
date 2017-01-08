import { Actions, MessagePartSeparator, MessageSeparator, Types, Topics, Events } from "../constants/Constants";
import { Client } from "../Client";

export interface ParsedMessage {
    raw: string,
    topic: string,
    action: string,
    data: string[],
    processedError?: boolean
}

// Get the actions from `Actions`
let actions: {[key: string]: string} = {};
for (let key in Actions) {
    actions[(Actions as any)[key]] = key;
}

/**
 * Parses ASCII control character seperated
 * message strings into digestable maps
 *
 * @constructor
 */
export let MessageParser = {

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
    parse(message: string, client: Client): ParsedMessage[] {
        let parsedMessages: ParsedMessage[] = [],
            rawMessages = message.split(MessageSeparator);

        for (let i = 0; i < rawMessages.length; i++) {
            if (rawMessages[i].length > 2) {
                parsedMessages.push(this._parseMessage(rawMessages[i], client));
            }
        }

        return parsedMessages;
    },

    /**
     * Deserializes values created by MessageBuilder.typed to
     * their original format
     *
     * @param {String} value
     *
     * @public
     * @returns {Mixed} original value
     */
    convertTyped(value: string, client: Client): any {
        let type = value.charAt(0);

        if (type === Types.STRING) {
            return value.substr(1);
        }

        if (type === Types.OBJECT) {
            try {
                return JSON.parse(value.substr(1));
            } catch (e) {
                client._$onError(Topics.ERROR, Events.MESSAGE_PARSE_ERROR, e.toString() + '(' + value + ')');
                console.log(type, value, e, new Error());
                return;
            }
        }

        if (type === Types.NUMBER) {
            return parseFloat(value.substr(1));
        }

        if (type === Types.NULL) {
            return null;
        }

        if (type === Types.TRUE) {
            return true;
        }

        if (type === Types.FALSE) {
            return false;
        }

        if (type === Types.UNDEFINED) {
            return undefined;
        }

        client._$onError(Topics.ERROR, Events.MESSAGE_PARSE_ERROR, 'UNKNOWN_TYPE (' + value + ')');
    },

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
    _parseMessage(message: string, client: Client): ParsedMessage | undefined {
        let parts = message.split(MessagePartSeparator);

        if (parts.length < 2) {
            client._$onError(Topics.ERROR, Events.MESSAGE_PARSE_ERROR, 'Insufficiant message parts');
            return undefined;
        }

        if (actions[parts[1]] === undefined) {
            client._$onError(Topics.ERROR, Events.MESSAGE_PARSE_ERROR, 'Unknown action ' + parts[1]);
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
