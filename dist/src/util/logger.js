"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    warn(message, event, log) {
        // tslint:disable-next-line:no-console
        console.warn(message, event, log);
    }
    error(message, event, log) {
        // tslint:disable-next-line:no-console
        console.error(message, event, log);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map