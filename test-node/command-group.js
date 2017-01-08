"use strict";
var CommandGroup = (function () {
    function CommandGroup() {
        this._commands = {};
    }
    CommandGroup.prototype.command = function (name, fn) {
        if (fn) {
            if (this._commands[name]) {
                throw new Error('Command ' + name + ' is already registered');
            }
            this._commands[name] = fn;
            return this;
        }
        else {
            return this._commands[name];
        }
    };
    Object.defineProperty(CommandGroup.prototype, "commands", {
        get: function () {
            return Object.keys(this._commands);
        },
        enumerable: true,
        configurable: true
    });
    return CommandGroup;
}());
exports.CommandGroup = CommandGroup;
