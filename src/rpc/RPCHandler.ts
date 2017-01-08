import { Client } from "../Client";
import { RPC } from "./RPC";
import { AckTimeoutRegistry } from "../utils/AckTimeoutRegistry";
import { ResubscribeNotifier } from "../utils/ResubscribeNotifier";
import { Topics, Actions, Events } from "../constants/Constants";
import { Connection } from "../message/Connection";
import { DeepstreamOptions } from "../DefaultOptions";
import { RPCResponse } from "./RPCResponse";
import { ParsedMessage, MessageParser } from "../message/MessageParser";
import { MessageBuilder } from "../message/MessageBuilder";

/**
 * The main class for remote procedure calls
 *
 * Provides the rpc interface and handles incoming messages
 * on the rpc topic
 *
 * @param {Object} options deepstream configuration options
 * @param {Connection} connection
 * @param {Client} client
 *
 * @constructor
 * @public
 */
export class RPCHandler {
    private _client: Client;
    private _connection: Connection;
    private _rpcs: {[key: string]: RPC};
    private _providers: {[key: string]: any}; // TODO: Type
    private _provideAckTimeouts: {[key: string]: any}; // TODO: Type
    private _ackTimeoutRegistry: AckTimeoutRegistry;
    private _resubscribeNotifier: ResubscribeNotifier;

    private get _options(): DeepstreamOptions {
        return this._client.options;
    }

    public constructor(client: Client, connection: Connection) {
        this._client = client;
        this._connection = connection;
        this._rpcs = {};
        this._providers = {};
        this._provideAckTimeouts = {};
        this._ackTimeoutRegistry = new AckTimeoutRegistry(client, Topics.RPC, this._options.subscriptionTimeout);
        this._resubscribeNotifier = new ResubscribeNotifier(this._client, this._reprovide.bind(this));
    }

    /**
     * Registers a callback function as a RPC provider. If another connected client calls
     * client.rpc.make() the request will be routed to this method
     *
     * The callback will be invoked with two arguments:
     *        {Mixed} data The data passed to the client.rpc.make function
     *    {RpcResponse} rpcResponse An object with methods to respons, acknowledge or reject the request
     *
     * Only one callback can be registered for a RPC at a time
     *
     * Please note: Deepstream tries to deliver data in its original format. Data passed to client.rpc.make as a String will arrive as a String,
     * numbers or implicitly JSON serialized objects will arrive in their respective format as well
     *
     * @public
     * @returns void
     */
    public provide(name: string, callback: RPCHandler.Callback): void {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        if (this._providers[name]) {
            throw new Error('RPC ' + name + ' already registered');
        }
        if (typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        this._ackTimeoutRegistry.add(name, Actions.SUBSCRIBE);
        this._providers[name] = callback;
        this._connection.sendMessage(Topics.RPC, Actions.SUBSCRIBE, [name]);
    }

    /**
     * Unregisters this client as a provider for a remote procedure call
     *
     * @param   {String} name the name of the rpc
     *
     * @public
     * @returns {void}
     */
    public unprovide(name: string): void {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }

        if (this._providers[name]) {
            delete this._providers[name];
            this._ackTimeoutRegistry.add(name, Actions.UNSUBSCRIBE);
            this._connection.sendMessage(Topics.RPC, Actions.UNSUBSCRIBE, [name]);
        }
    }

    /**
     * Executes the actual remote procedure call
     *
     * @param   {String}   name     The name of the rpc
     * @param   {Mixed}    data     Serializable data that will be passed to the provider
     * @param   {Function} callback Will be invoked with the returned result or if the rpc failed
     *                              receives to arguments: error or null and the result
     *
     * @public
     * @returns {void}
     */
    public make(name: string, data: any, callback: RPCHandler.Callback): void {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        if (typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        let uid = this._client.createUid(),
            typedData = MessageBuilder.typed(data);

        this._rpcs[uid] = new RPC(this._client, callback);
        this._connection.sendMessage(Topics.RPC, Actions.REQUEST, [name, uid, typedData]);
    }

    /**
     * Retrieves a RPC instance for a correlationId or throws an error
     * if it can't be found (which should never happen)
     *
     * @param {String} correlationId
     * @param {String} rpcName
     *
     * @private
     * @returns {Rpc}
     */
    private _getRPC(correlationId: string, rpcName: string, rawMessage: string): RPC | undefined {
        let rpc = this._rpcs[correlationId];

        if (!rpc) {
            this._client._$onError(Topics.RPC, Events.UNSOLICITED_MESSAGE, rawMessage);
            return undefined;
        }

        return rpc;
    }

    /**
     * Handles incoming rpc REQUEST messages. Instantiates a new response object
     * and invokes the provider callback or rejects the request if no rpc provider
     * is present (which shouldn't really happen, but might be the result of a race condition
     * if this client sends a unprovide message whilst an incoming request is already in flight)
     *
     * @param   {Object} message The parsed deepstream RPC request message.
     *
     * @private
     * @returns {void}
     */
    private _respondToRPC(message: ParsedMessage): void {
        let name = message.data[0],
            correlationId = message.data[1],
            data = null,
            response;

        if (message.data[2]) {
            data = MessageParser.convertTyped(message.data[2], this._client);
        }

        if (this._providers[name]) {
            response = new RPCResponse(this._connection, name, correlationId);
            this._providers[name](data, response);
        } else {
            this._connection.sendMessage(Topics.RPC, Actions.REJECTION, [name, correlationId]);
        }
    }

    /**
     * Distributes incoming messages from the server
     * based on their action
     *
     * @param   {Object} message A parsed deepstream message
     *
     * @private
     * @returns {void}
     */
    public _$handle(message: ParsedMessage): void {
        let rpcName: string, correlationId: string, rpc: RPC | undefined;

        // RPC Requests
        if (message.action === Actions.REQUEST) {
            this._respondToRPC(message);
            return;
        }

        // RPC subscription Acks
        if (message.action === Actions.ACK &&
            ( message.data[0] === Actions.SUBSCRIBE || message.data[0] === Actions.UNSUBSCRIBE )) {
            this._ackTimeoutRegistry.clear(message);
            return;
        }

        // handle auth/denied subscription errors
        if (message.action === Actions.ERROR) {
            if (message.data[0] === Events.MESSAGE_PERMISSION_ERROR) {
                return;
            }
            if (message.data[0] === Events.MESSAGE_DENIED && message.data[2] === Actions.SUBSCRIBE) {
                this._ackTimeoutRegistry.remove(message.data[1], Actions.SUBSCRIBE);
                return;
            }
        }

        /*
         * Error messages always have the error as first parameter. So the
         * order is different to ack and response messages
         */
        if (message.action === Actions.ERROR || message.action === Actions.ACK) {
            if (message.data[0] === Events.MESSAGE_DENIED && message.data[2] === Actions.REQUEST) {
                correlationId = message.data[3];
            } else {
                correlationId = message.data[2];
            }
            rpcName = message.data[1];
        } else {
            rpcName = message.data[0];
            correlationId = message.data[1];
        }

        /*
         * Retrieve the rpc object
         */
        rpc = this._getRPC(correlationId, rpcName, message.raw);
        if (!rpc) return;

        // RPC Responses
        if (message.action === Actions.ACK) {
            rpc.ack();
        }
        else if (message.action === Actions.RESPONSE) {
            rpc.respond(message.data[2]);
            delete this._rpcs[correlationId];
        }
        else if (message.action === Actions.ERROR) {
            message.processedError = true;
            rpc.error(message.data[0]);
            delete this._rpcs[correlationId];
        }
    }

    /**
     * Reregister providers to events when connection is lost
     *
     * @package private
     * @returns {void}
     */
    private _reprovide(): void {
        for (let rpcName in this._providers) {
            this._connection.sendMessage(Topics.RPC, Actions.SUBSCRIBE, [rpcName]);
        }
    }
}

export namespace RPCHandler {
    export type Callback = (data: any, response: RPCResponse) => void;
}
