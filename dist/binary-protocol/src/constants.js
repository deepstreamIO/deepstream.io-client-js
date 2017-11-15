"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_constants_1 = require("./message-constants");
exports.HEADER_LENGTH = 8;
exports.META_PAYLOAD_OVERFLOW_LENGTH = Math.pow(2, 24) - 1;
function isWriteAck(action) {
    return action === message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK
        || action === message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK
        || action === message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK
        || action === message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK
        || action === message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK;
}
exports.isWriteAck = isWriteAck;
exports.actionToWriteAck = {
    [message_constants_1.RECORD_ACTIONS.CREATEANDPATCH]: message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK,
    [message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE]: message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK,
    [message_constants_1.RECORD_ACTIONS.PATCH]: message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK,
    [message_constants_1.RECORD_ACTIONS.UPDATE]: message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK,
    [message_constants_1.RECORD_ACTIONS.ERASE]: message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK,
};
//# sourceMappingURL=constants.js.map