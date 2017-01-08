export class CommandGroup {
    private _commands: {[key: string]: Function};

    public constructor() {
        this._commands = {};
    }

    public command(name: string): Function;
    public command(name: string, fn: Function): CommandGroup;
    public command(name: string, fn?: Function): Function | CommandGroup {
        if (fn) {
            if (this._commands[name]) {
                throw new Error('Command ' + name + ' is already registered');
            }

            this._commands[name] = fn;
            return this;
        } else {
            return this._commands[name];
        }
    }

    public get commands(): string[] {
        return Object.keys(this._commands);
    }
}
