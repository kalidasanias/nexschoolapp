/**
 * Created by senthil on 14/02/17.
 */
'use strict';

module.exports = function BaseError(settings) {
    Error.captureStackTrace(this, this.constructor);
    settings = ( settings || {} );

    this.name = ( settings.name || this.constructor.name);
    this.type = ( settings.type || "Application" );
    this.message = ( settings.message || "An error occurred." );
    this.detail = ( settings.detail || "" );
    this.errorCode = ( settings.errorCode || 200 );
};

require('util').inherits(module.exports, Error);