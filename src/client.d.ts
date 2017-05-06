// 

declare namespace deepstream {

	interface ClientOptions {
		heartbeatInterval?: number
		maxMessagesPerPacket?: number
		maxReconnectAttempts?: number
		maxReconnectInterval?: number
		nodeSocketOptions?: any
		path?: string
		reconnectIntervalIncrement?: number
		recordDeepCopy?: boolean
		recordDeleteTimeout?: number
		recordReadAckTimeout?: number
		recordReadTimeout?: number
		rpcAckTimeout?: number
		rpcResponseTimeout?: number
		subscriptionTimeout?: number
		timeBetweenSendingQueuedPackages?: number
		mergeStrategy?: MergeStrategies
	}

	type Static = {
		(url: string, options?: ClientOptions): Client
	} & Enums

	type Enums = {
		CONSTANTS: Constants
		MERGE_STRATEGIES: MergeStrategies
	}

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

	type Params = { [key: string]: any }
	type EventCallbackFn<T> = (...args: Array<T>) => void
	type DsRegExp = string | RegExp

	class Client extends Emitter {
		CONSTANTS: Constants
		MERGE_STRATEGIES: MergeStrategies
		event: EventHandler
		rpc: RpcHandler
		record: RecordHandler
		presence: PresenceHandler
		_connection: Connection
		close(): void
		getConnectionState(): string
		getUid(): string
		login<P, D>(authParams: P, callback?: (success: boolean, data: D) => void): this
		on(event: 'error', callback: (error: string, event: string, topic: string) => void): this
		on(event: 'connectionStateChanged', callback: (state: string) => void): this
	}

	class EventHandler {
		emit(event: string | symbol, ...args: any[]): boolean
		emit<T>(name: string, data: T): void
		listen<T>(pattern: DsRegExp, callback: EventCallbackFn<T>): void
		subscribe<T>(name: string, callback: EventCallbackFn<T>): void
		unlisten(pattern: DsRegExp): void
		unsubscribe<T>(name: string, callback?: EventCallbackFn<T>): void
	}

	class PresenceHandler {
		getAll(callback: (clients: Array<string>) => void): void
		subscribe(callback: (username: string, isLoggedIn: boolean) => void): void
		unsubscribe(callback: (username: string, isLoggedIn: boolean) => void): void
	}

	class List extends Record {
		addEntry(entry: string, index: number): void
		getEntries(): Array<string>
		isEmpty(): boolean
		removeEntry(entry: string, index?: number): void
		setEntries(entries: Array<string>): void
	}

	class RecordHandler {
		getAnonymousRecord<T>(): AnonymousRecord<T>
		getList(name: string, options?: any): List
		getRecord<T>(name: string): Record<T>
		has<T>(name: string, callback: EventCallbackFn<T>): void
		listen<T>(pattern: DsRegExp, callback: EventCallbackFn<T>): void
		snapshot<T>(name: string, callback: EventCallbackFn<T>): void
		unlisten(pattern: DsRegExp): void
	}

	class Emitter {
		addEventListener<T>(event: string, fn: EventCallbackFn<T>): this
		emit<T>(event: string, fn?: EventCallbackFn<T>): this
		eventNames(): Array<string>
		hasListeners(event?: string): boolean
		listeners(event?: string): Array<Listener>
		off<T>(event?: string, fn?: EventCallbackFn<T>): this
		on<T>(event: string, fn: EventCallbackFn<T>): this
		once<T>(event: string, fn: EventCallbackFn<T>): this
		removeAllListeners<T>(event?: string, fn?: EventCallbackFn<T>): this
		removeEventListener<T>(event?: string, fn?: EventCallbackFn<T>): this
		removeListener<T>(event?: string, fn?: EventCallbackFn<T>): this
	}

	class Record<T> extends Emitter {
		name: string
		usages: number
		isReady: boolean
		hasProvider: boolean
		isDestroyed: boolean

		delete(): void
		discard(): void
		setMergeStrategy(mergeStrategy: MergeStrategies): void
		whenReady(callback: (record: Record<T>) => void): void

		get(path?: string): T

		set(data: T): void
		set(data: T, callback?: (error: string) => void): void
		set(path: string, value: any): void
		set(path: string, value: any, callback?: (error: string) => void): void

		subscribe(callback: (data: T) => void, triggerNow?: boolean): void
		subscribe(path: string, callback: (data: T) => void, triggerNow?: boolean): void

		unsubscribe(path?: string): void
		unsubscribe(callback: Function): void
		unsubscribe(path: string, callback: Function): void
	}

	class AnonymousRecord<T> extends Record<T> {
		setName(recordName: string): void
	}

	class RpcHandler {
		make<B, R>(name: string, body: B, callback: (error: string, response: R) => void): void
		provide<B, R>(name: string, callback: (body: B, response: RpcResponse<R>) => void): void
		unprovide(name: string): void
	}

	class RpcResponse<R> {
		ack(): void
		error(errorMsg: string | Error): void
		reject(): void
		send(response?: R): void
	}

	class Rpc {
		ack(): void
		error(timeout: string): void
		respond<D>(data: D): void
	}

	class Connection {
		authenticate<P, T>(authParams: P, callback: EventCallbackFn<T>): void
		close(): void
		getState(): string
		send(message: string): void
		sendMsg<T>(topic: Topic, action: Actions, data: T): void
	}

	class MessageParser {
		convertTyped<T>(value: string, client: Client): T
		parse(message: string, client: Client): Array<any>
	}

	class AckTimeoutRegistry {
		add(timeout: string): number
		clear<D>(message: D): void
		remove(timeout: string): void
	}

	class Listener {
		accept(name: string): void
		destroy(): void
		reject(name: string): void
		sendDestroy(): void
	}

	class SingleNotifier {
		hasRequest(name: string): void
		recieve<D>(name: string, error: string, data: D): void
		request<T>(name: string, callback: EventCallbackFn<T>): void
	}
	
	interface PermissionMessage {
		raw: string
		topic: string
		action: string
		data: Array<string>
	}

}

declare module 'deepstream.io-client-js' {
	var deepstream: deepstream.Static
	export = deepstream
}

