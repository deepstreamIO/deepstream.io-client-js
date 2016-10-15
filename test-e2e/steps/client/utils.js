'use strict'

const defaultDelay = process.env.DEFAULT_DELAY || 10;

function parseData( data ) {
  if( data === undefined || data === 'undefined' ) {
    return undefined;
  } else if( data === 'null' ) {
    return null;
  } else {
    try {
      return JSON.parse( data );
    } catch(e) {
      console.log( `'${ data }' parsed as a string` )
      return data;
    }
  }
}

module.exports = {
  defaultDelay,
  parseData
}
