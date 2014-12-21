var readline = require( 'readline' ),
	CommandGroup = require( './command-group' );

var Cli = function() {
	this._cmdLine = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		completer: this._complete.bind( this )
	});

	this._cmdLine.on( 'line', this._executeCommand.bind( this ) );

	this._groups = {};
	this._writeLine = false;
};

Cli.prototype.group = function( name ) {
	if( this._groups[ name ] ) {
		throw new Error( 'group ' + name + ' already registered' );
	}

	this._groups[ name ] = new CommandGroup();
	return this._groups[ name ];
};

Cli.prototype.write = function( output ) {
	this._writeLine = true;
	this._cmdLine.write( output + '\n' );
	this._cmdLine.prompt();
};

Cli.prototype._executeCommand = function( line ) {
	if( this._writeLine === true ) {
		this._writeLine = false;
		return;
	}
	
	var parsedLine = this._parseLine( line ),
		group = this._groups[ parsedLine.group ];

	if( !group ) {
		this.write( 'Uknown command group ' + line.group );
		return;
	}

	if( !group.command( parsedLine.command ) ) {
		this.write( 'Uknown command ' + line.command );
		return;
	}

	group.command( parsedLine.command ).apply( this, parsedLine.args );
};

Cli.prototype._complete = function( line ) {
	var parsedLine = this._parseLine( line ),
		needle = '',
		haystack = [],
		matches;

	if( parsedLine.command === null ) {
		needle = parsedLine.group;
		haystack = Object.keys( this._groups );
	}

	if( parsedLine.command !== null && this._groups[ parsedLine.group ] ) {
		needle = parsedLine.command;
		haystack = this._groups[ parsedLine.group ].getCommands();
	}

	if( !needle ) {
		return [ [], '' ];
	}

	matches = haystack.filter(function( entry ){ 
		return entry.substr( 0, needle.length ) === needle; 
	});

	return [ matches, needle ];
};

Cli.prototype._parseLine = function( line ) {
	var result = {
			group: null,
			command: null
		},
		parts = line.split( ' ' ).filter(function( part ){
			return part.trim().length > 0;
		});

	if( parts[ 0 ] ) {
		result.group = parts[ 0 ];
	}

	if( parts[ 0 ] && line.charAt( line.length - 1 ) === ' ' ) {
		result.command = '';
	}

	if( parts[ 1 ] ) {
		result.command = parts[ 1 ];
	}

	if( parts.length > 2 ) {
		result.args = parts.splice( 2 );
	}

	return result;
};

module.exports = Cli;