var CommandGroup = function() {
	this._commands = {};
};

CommandGroup.prototype.command = function( name, fn ) {
	if( arguments.length === 2 ) {
		if( this._commands[ name ] ) {
			throw new Error( 'Command ' + name + ' is already registered' );
		}

		this._commands[ name ] = fn;
		return this;
	} else {
		return this._commands[ name ];
	}
};

CommandGroup.prototype.getCommands = function() {
	return Object.keys( this._commands );
};

module.exports = CommandGroup;