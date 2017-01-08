import { Connection } from "../message/Connection";
import { nextTick } from "../utils/Utils";
import { Actions, Topics } from "../constants/Constants";
import { MessageBuilder } from "../message/MessageBuilder";

/**
 * This object provides a number of methods that allow a rpc provider
 * to respond to a request
 *
 * @param {Connection} connection - the clients connection object
 * @param {String} name the name of the rpc
 * @param {String} correlationId the correlationId for the RPC
 */
export class RPCResponse {
    private _connection: Connection;
    private _name: string;
    private _correlationId: string;
    private _isAcknowledged: boolean;
    private _isComplete: boolean;
    public autoAck: boolean;

    public constructor(connection: Connection, name: string, correlationId: string) {
        this._connection = connection;
        this._name = name;
        this._correlationId = correlationId;
        this._isAcknowledged = false;
        this._isComplete = false;
        this.autoAck = true;
        nextTick(this._performAutoAck.bind(this));
    }

    /**
     * Acknowledges the receipt of the request. This
     * will happen implicitly unless the request callback
     * explicitly sets autoAck to false
     *
     * @public
     * @returns    {void}
     */
    public ack(): void {
        if (this._isAcknowledged === false) {
            this._connection.sendMessage(
                Topics.RPC,
                Actions.ACK,
                [Actions.REQUEST, this._name, this._correlationId]
            );
            this._isAcknowledged = true;
        }
    }

    /**
     * Reject the request. This might be necessary if the client
     * is already processing a large number of requests. If deepstream
     * receives a rejection message it will try to route the request to
     * another provider - or return a NO_RPC_PROVIDER error if there are no
     * providers left
     *
     * @public
     * @returns    {void}
     */
    public reject(): void {
        this.autoAck = false;
        this._isComplete = true;
        this._isAcknowledged = true;
        this._connection.sendMessage(Topics.RPC, Actions.REJECTION, [this._name, this._correlationId]);
    }

    /**
     * Notifies the server that an error has occured while trying to process the request.
     * This will complete the rpc.
     *
     * @param {String} errorMsg the message used to describe the error that occured
     * @public
     * @returns    {void}
     */
    public error(errorMessage: string): void {
        this.autoAck = false;
        this._isComplete = true;
        this._isAcknowledged = true;
        this._connection.sendMessage(Topics.RPC, Actions.ERROR, [errorMessage, this._name, this._correlationId]);
    }

    /**
     * Completes the request by sending the response data
     * to the server. If data is an array or object it will
     * automatically be serialised.
     * If autoAck is disabled and the response is sent before
     * the ack message the request will still be completed and the
     * ack message ignored
     *
     * @param {String} data the data send by the provider. Might be JSON serialized
     *
     * @public
     * @returns {void}
     */
    public send(data: string): void {
        if (this._isComplete === true) {
            throw new Error('Rpc ' + this._name + ' already completed');
        }
        this.ack();

        var typedData = MessageBuilder.typed(data);
        this._connection.sendMessage(Topics.RPC, Actions.RESPONSE, [this._name, this._correlationId, typedData]);
        this._isComplete = true;
    }

    /**
     * Callback for the autoAck timeout. Executes ack
     * if autoAck is not disabled
     *
     * @private
     * @returns {void}
     */
    private _performAutoAck(): void {
        if (this.autoAck === true) {
            this.ack();
        }
    }
}
