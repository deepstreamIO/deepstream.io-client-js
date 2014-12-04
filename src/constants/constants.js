exports.CONNECTION_STATE = {};

exports.CONNECTION_STATE.CLOSED = 'CLOSED';
exports.CONNECTION_STATE.AUTHENTICATING = 'AUTHENTICATING';
exports.CONNECTION_STATE.OPEN = 'OPEN';

exports.MESSAGE_SEPERATOR = String.fromCharCode( 30 ); // ASCII Record Seperator 1E
exports.MESSAGE_PART_SEPERATOR = String.fromCharCode( 31 ); // ASCII Unit Separator 1F

exports.TOPIC = {};
exports.TOPIC.AUTH = 'AUTH';
exports.TOPIC.ERROR = 'ERROR';
exports.TOPIC.EVENT = 'EVENT';
exports.TOPIC.RECORD = 'RECORD';
exports.TOPIC.RPC = 'RPC';
exports.TOPIC.PRIVATE = 'PRIVATE/';

exports.ACTIONS = {};
exports.ACTIONS.ACK = 'A';
exports.ACTIONS.READ = 'R';
exports.ACTIONS.CREATE = 'C';
exports.ACTIONS.UPDATE = 'U';
exports.ACTIONS.DELETE = 'D';
exports.ACTIONS.SUBSCRIBE = 'S';
exports.ACTIONS.UNSUBSCRIBE = 'US';
exports.ACTIONS.INVOKE = 'I';
exports.ACTIONS.LISTEN = 'L';
exports.ACTIONS.PROVIDER_UPDATE = 'PU';
exports.ACTIONS.QUERY = 'Q';
exports.ACTIONS.CREATEORREAD = 'CR';
exports.ACTIONS.RPC = 'RPC';
exports.ACTIONS.EVENT = 'EVT';
exports.ACTIONS.ERROR = 'E';
exports.ACTIONS.REQUEST = 'REQ';
exports.ACTIONS.RESPONSE = 'RES';