"use strict";
var readline = require("readline");
var command_group_1 = require("./command-group");
var CLI = (function () {
    function CLI() {
        this._cmdLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: this._complete.bind(this)
        });
        this._cmdLine.on('line', this._executeCommand.bind(this));
        this._groups = {};
        this._writeLine = false;
    }
    CLI.prototype.group = function (name) {
        if (this._groups[name]) {
            throw new Error('group ' + name + ' already registered');
        }
        this._groups[name] = new command_group_1.CommandGroup();
        return this._groups[name];
    };
    CLI.prototype.write = function (output) {
        this._writeLine = true;
        this._cmdLine.write(output + '\n');
        this._cmdLine.prompt();
    };
    CLI.prototype._executeCommand = function (line) {
        if (this._writeLine === true) {
            this._writeLine = false;
            return;
        }
        var parsedLine = this._parseLine(line), group = this._groups[parsedLine.group];
        if (!group) {
            this.write('Uknown command group ' + parsedLine.group);
            return;
        }
        if (!group.command(parsedLine.command)) {
            this.write('Uknown command ' + parsedLine.command);
            return;
        }
        group.command(parsedLine.command).apply(this, parsedLine.args);
    };
    CLI.prototype._complete = function (line) {
        var parsedLine = this._parseLine(line), needle = '', haystack = [], matches;
        if (parsedLine.command === null) {
            needle = parsedLine.group;
            haystack = Object.keys(this._groups);
        }
        if (parsedLine.command !== null && this._groups[parsedLine.group]) {
            needle = parsedLine.command;
            haystack = this._groups[parsedLine.group].commands;
        }
        if (!needle) {
            return [[], ''];
        }
        matches = haystack.filter(function (entry) { return entry.substr(0, needle.length) === needle; });
        return [matches, needle];
    };
    CLI.prototype._parseLine = function (line) {
        var result = {
            group: undefined,
            command: undefined,
            args: undefined
        }, parts = line.split(' ').filter(function (part) {
            return part.trim().length > 0;
        });
        if (parts[0]) {
            result.group = parts[0];
        }
        if (parts[0] && line.charAt(line.length - 1) === ' ') {
            result.command = '';
        }
        if (parts[1]) {
            result.command = parts[1];
        }
        if (parts.length > 2) {
            result.args = parts.splice(2);
        }
        return result;
    };
    return CLI;
}());
exports.CLI = CLI;
