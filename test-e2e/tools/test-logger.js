'use strict'

const events = require( 'events' );
const util = require( 'util' );

var Logger = function() {
  this.logs = [];
  this.lastLog = null;
  this.isReady = true;
};

util.inherits( Logger, events.EventEmitter );

Logger.prototype.log = function( logLevel, event, logMessage ) {
  var log = {
    level: logLevel,
    event: event,
    message: logMessage
  };

  this.logs.push( log );
  this.lastLog = log;

  switch( logLevel ) {
    case 3:
      throw new Error( 'Critical error occured on deepstream ' +  event + ' ' + logMessage );
      break;
    case 2:
      console.log( 'Warning:', event, logMessage );
      break;
  }
};

Logger.prototype.setLogLevel = function(){};

module.exports = Logger;
