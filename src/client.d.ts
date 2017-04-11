declare namespace deepstream {

	type Static = {
		(url: string, options?: ClientOptions): Client;
	} & Enums

	interface ConnectionState {
		CLOSED: 'CLOSED'
		AWAITING_CONNECTION: 'AWAITING_CONNECTION'
		CHALLENGING: 'CHALLENGING'
		AWAITING_AUTHENTICATION: 'AWAITING_AUTHENTICATION'
		AUTHENTICATING: 'AUTHENTICATING'
		OPEN: 'OPEN'
		ERROR: 'ERROR'
		RECONNECTING: 'RECONNECTING'
	}

	interface Types {
		STRING: 'S'
		OBJECT: 'O'
		NUMBER: 'N'
		NULL: 'L'
		TRUE: 'T'
		FALSE: 'F'
		UNDEFINED: 'U'
	}

	interface Topic {
		CONNECTION: 'C'
		AUTH: 'A'
		ERROR: 'X'
		EVENT: 'E'
		RECORD: 'R'
		RPC: 'P'
		PRESENCE: 'U'
		PRIVATE: 'PRIVATE/'
	}

	interface Events {
		CONNECTION_ERROR: 'connectionError'
		CONNECTION_STATE_CHANGED: 'connectionStateChanged'
		MAX_RECONNECTION_ATTEMPTS_REACHED: 'MAX_RECONNECTION_ATTEMPTS_REACHED'
		CONNECTION_AUTHENTICATION_TIMEOUT: 'CONNECTION_AUTHENTICATION_TIMEOUT'
		ACK_TIMEOUT: 'ACK_TIMEOUT'
		NO_RPC_PROVIDER: 'NO_RPC_PROVIDER'
		RESPONSE_TIMEOUT: 'RESPONSE_TIMEOUT'
		DELETE_TIMEOUT: 'DELETE_TIMEOUT'
		UNSOLICITED_MESSAGE: 'UNSOLICITED_MESSAGE'
		MESSAGE_DENIED: 'MESSAGE_DENIED'
		MESSAGE_PARSE_ERROR: 'MESSAGE_PARSE_ERROR'
		VERSION_EXISTS: 'VERSION_EXISTS'
		NOT_AUTHENTICATED: 'NOT_AUTHENTICATED'
		MESSAGE_PERMISSION_ERROR: 'MESSAGE_PERMISSION_ERROR'
		LISTENER_EXISTS: 'LISTENER_EXISTS'
		NOT_LISTENING: 'NOT_LISTENING'
		TOO_MANY_AUTH_ATTEMPTS: 'TOO_MANY_AUTH_ATTEMPTS'
		IS_CLOSED: 'IS_CLOSED'
		RECORD_NOT_FOUND: 'RECORD_NOT_FOUND'
		NOT_SUBSCRIBED: 'NOT_SUBSCRIBED'
	}

	interface Actions {
		PING: 'PI'
		PONG: 'PO'
		ACK: 'A'
		REDIRECT: 'RED'
		CHALLENGE: 'CH'
		CHALLENGE_RESPONSE: 'CHR'
		READ: 'R'
		CREATE: 'C'
		UPDATE: 'U'
		PATCH: 'P'
		DELETE: 'D'
		SUBSCRIBE: 'S'
		UNSUBSCRIBE: 'US'
		HAS: 'H'
		SNAPSHOT: 'SN'
		INVOKE: 'I'
		SUBSCRIPTION_FOR_PATTERN_FOUND: 'SP'
		SUBSCRIPTION_FOR_PATTERN_REMOVED: 'SR'
		SUBSCRIPTION_HAS_PROVIDER: 'SH'
		LISTEN: 'L'
		UNLISTEN: 'UL'
		LISTEN_ACCEPT: 'LA'
		LISTEN_REJECT: 'LR'
		PROVIDER_UPDATE: 'PU'
		QUERY: 'Q'
		CREATEORREAD: 'CR'
		EVENT: 'EVT'
		ERROR: 'E'
		REQUEST: 'REQ'
		RESPONSE: 'RES'
		REJECTION: 'REJ'
		PRESENCE_JOIN: 'PNJ'
		PRESENCE_LEAVE: 'PNL'
		WRITE_ACKNOWLEDGEMENT: 'WA'
	}

	interface CallState {
		INITIAL: 'INITIAL'
		CONNECTING: 'CONNECTING'
		ESTABLISHED: 'ESTABLISHED'
		ACCEPTED: 'ACCEPTED'
		DECLINED: 'DECLINED'
		ENDED: 'ENDED'
		ERROR: 'ERROR'
	}

	interface Constants {
		CONNECTION_STATE: ConnectionState
		MESSAGE_SEPERATOR: '\u001e'
		MESSAGE_PART_SEPERATOR: '\u001f'
		TYPES: Types
		TOPIC: Topic
		EVENT: Events
		ACTIONS: Actions
		CALL_STATE: CallState
	}

	interface MergeStrategies {
		REMOTE_WINS(record, remoteValue, remoteVersion, callback): void
		LOCAL_WINS(record, remoteValue, remoteVersion, callback): void
	}

	class Enums {
		CONSTANTS: Constants
		MERGE_STRATEGIES: MergeStrategies
	}

	type Params = { [key: string]: any }
	type Event = string | symbol
	type EventCallbackFn<T> = (...args: Array<T>) => void;
	type PresenceHandlerFn = (username: string, isLoggedIn: boolean) => void

	class Emitter extends Enums {
		addEventListener<T>(event: Event, fn: EventCallbackFn<T>): this;
		emit<T>(event: Event, fn?: EventCallbackFn<T>): this;
		eventNames(): Array<Event>;
		hasListeners(event: Event): boolean;
		listeners(event: Event): Array<Listener>;
		off<T>(event?: Event, fn?: EventCallbackFn<T>): this;
		on<T>(event: Event, fn: EventCallbackFn<T>): this;
		once<T>(event: Event, fn: EventCallbackFn<T>): this;
		removeAllListeners<T>(event?: Event, fn?: EventCallbackFn<T>): this;
		removeEventListener<T>(event?: Event, fn?: EventCallbackFn<T>): this;
		removeListener<T>(event?: Event, fn?: EventCallbackFn<T>): this;
	}

	interface ClientOptions {
		heartbeatInterval?: number;
		maxMessagesPerPacket?: number;
		maxReconnectAttempts?: number;
		maxReconnectInterval?: number;
		nodeSocketOptions?: any;
		path?: string;
		reconnectIntervalIncrement?: number;
		recordDeepCopy?: boolean;
		recordDeleteTimeout?: number;
		recordReadAckTimeout?: number;
		recordReadTimeout?: number;
		rpcAckTimeout?: number;
		rpcResponseTimeout?: number;
		subscriptionTimeout?: number;
		timeBetweenSendingQueuedPackages?: number;
		mergeStrategy?: MergeStrategies;
	}

	class Client extends Emitter {
		event: EventHandler
		rpc: RpcHandler
		record: RecordHandler
		presence: PresenceHandler
		close(): void;
		getConnectionState(): ConnectionState;
		getUid(): string;
		login<P, D>(authParams: P, callback?: (success: boolean, data: D) => void): this;
	}

	class EventHandler extends EventEmitter {
		emit<T>(name: Event, data: T): void;
		listen<T>(pattern: RegExp, callback: EventCallbackFn<T>): void;
		subscribe<T>(name: Event, callback: EventCallbackFn<T>): void;
		unlisten(pattern: RegExp): void;
		unsubscribe<T>(name: Event, callback?: EventCallbackFn<T>): void;
	}

	class Connection {
		authenticate<P, T>(authParams: P, callback: EventCallbackFn<T>): void;
		close(): void;
		getState(): ConnectionState;
		send(message: string): void;
		sendMsg<T>(topic: Topic, action: Actions, data: T): void;
	}

	class MessageParser {
		convertTyped<T>(value: string, client: Client): T;
		parse(message: string, client: Client): Array<any>;
	}

	class PresenceHandler {
		getAll(callback: (clients: Array<string>) => void): void;
		subscribe(callback: PresenceHandlerFn): void;
		unsubscribe(callback: PresenceHandlerFn): void;
	}

	class AnonymousRecord extends EventEmitter {
		get<T>(path: Array<string>): T;
		setName(recordName: string): void;
		subscribe<T>(args: EventCallbackFn<T>): void;
		unsubscribe<T>(args: EventCallbackFn<T>): void;
	}

	class List extends Record {
		addEntry(entry: string, index: number): void;
		getEntries(): Array<string>;
		isEmpty(): boolean;
		removeEntry(entry: string, index?: number): void;
		setEntries(entries: Array<string>): void;
	}

	class RecordHandler {
		getAnonymousRecord(): AnonymousRecord;
		getList<T>(name: string, options: Params & T): List;
		getRecord<T>(name: string, recordOptions: Params & T): Record;
		has<T>(name: string, callback: EventCallbackFn<T>): void;
		listen<T>(pattern: RegExp, callback: EventCallbackFn<T>): void;
		snapshot<T>(name: string, callback: EventCallbackFn<T>): void;
		unlisten(pattern: RegExp): void;
	}

	class Record {
		delete(): void;
		discard(): void;
		get<T>(path: string): T;
		set<P, D, T>(pathOrData: P, dataOrCallback: D, callback: EventCallbackFn<T>, args: T[]): void;
		setMergeStrategy(mergeStrategy: MergeStrategies): void;
		subscribe<T>(path: string, callback: EventCallbackFn<T>, triggerNow?: boolean, args: T[]): void;
		unsubscribe<P, T>(pathOrCallback: P, callback: EventCallbackFn<T>, args: T[]): void;
		whenReady<T>(callback: EventCallbackFn<T>): void;
	}

	class RpcHandler {
		make<D, T>(name: string, data: D, callback: EventCallbackFn<T>): void;
		provide<T>(name: string, callback: EventCallbackFn<T>): void;
		unprovide(name: string): void;
	}

	class RpcResponse {
		ack(): void;
		error(errorMsg: string): void;
		reject(): void;
		send<D>(data: D): void;
	}

	class Rpc {
		ack(): void;
		error(timeout: string): void;
		respond<D>(data: D): void;
	}

	class AckTimeoutRegistry {
		add(timeout: string): number;
		clear<D>(message: D): void;
		remove(timeout: string): void;
	}

	class Listener {
		accept(name: string): void;
		destroy(): void;
		reject(name: string): void;
		sendDestroy(): void;
	}

	class SingleNotifier {
		hasRequest(name: string): void;
		recieve<D>(name: string, error: string, data: D): void;
		request<T>(name: string, callback: EventCallbackFn<T>): void;
	}

}

declare module 'deepstream.io-client-js' {
	var deepstream: deepstream.Static;
	export = deepstream;
}

