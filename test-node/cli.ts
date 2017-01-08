import readline = require("readline");
import { CommandGroup } from "./command-group";
import { ReadLine } from "readline";

export interface CLILine {
    group: string;
    command: string;
    args: string[];
}


export class CLI {
    private _cmdLine: ReadLine;
    private _groups: {[key: string]: CommandGroup};
    private _writeLine: boolean;

    public constructor() {
        this._cmdLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: this._complete.bind(this)
        });

        this._cmdLine.on('line', this._executeCommand.bind(this));

        this._groups = {};
        this._writeLine = false;
    }

    public group(name: string): CommandGroup {
        if (this._groups[name]) {
            throw new Error('group ' + name + ' already registered');
        }

        this._groups[name] = new CommandGroup();
        return this._groups[name];
    }

    public write(output: string): void {
        this._writeLine = true;
        this._cmdLine.write(output + '\n');
        this._cmdLine.prompt();
    }

    private _executeCommand(line: string): void {
        if (this._writeLine === true) {
            this._writeLine = false;
            return;
        }

        let parsedLine = this._parseLine(line),
            group = this._groups[parsedLine.group];

        if (!group) {
            this.write('Uknown command group ' + parsedLine.group);
            return;
        }

        if (!group.command(parsedLine.command)) {
            this.write('Uknown command ' + parsedLine.command);
            return;
        }

        group.command(parsedLine.command).apply(this, parsedLine.args);
    }

    private _complete(line: string): [string[], string] {
        let parsedLine = this._parseLine(line),
            needle = '',
            haystack = [],
            matches;

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

        matches = haystack.filter(entry => entry.substr(0, needle.length) === needle);

        return [matches, needle];
    }

    public _parseLine(line: string): CLILine {
        let result = {
                group: undefined,
                command: undefined,
                args: undefined
            },
            parts = line.split(' ').filter(function (part) {
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
    }
}
