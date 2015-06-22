'use strict';


//---------//
// Imports //
//---------//

var bPromise = require('bluebird')
    , Utils = require('node-utils');


//--------//
// PGConf //
//--------//

function PGConf(argsObj) {
    argsObj = argsObj || {};
    var confObj = {};

    if (argsObj.user) {
        confObj.user = argsObj.user;
    }
    if (argsObj.database) {
        confObj.database = argsObj.database;
    }
    if (argsObj.password) {
        confObj.password = argsObj.password;
    }
    if (argsObj.port) {
        confObj.port = argsObj.port;
    }
    if (argsObj.host) {
        confObj.host = argsObj.host;
    }
    if (argsObj.ssl) {
        confObj.ssl = argsObj.ssl;
    }

    this.confObj = confObj;
    this.connString = argsObj.connString;

    PGConf.validatePgConf(this);
}


//-----------------------//
// Prototyped Extensions //
//-----------------------//

PGConf.prototype.GetConnection = function GetConnection() {
    return this.connString || this.confObj;
}

PGConf.prototype.GeneratePGWrapper = function GeneratePGWrapper() {
    return (new PGWrapper(this));
};


//--------//
// Static //
//--------//

// doesn't return anything - just throws an error if invalid
PGConf.validatePgConf = function validatePgConf(pgConfInst) {
    if (!Utils.xor(Object.keys(pgConfInst.confObj).length, pgConfInst.connString)) {
        throw new Error("Invalid Argument: PGConf requires _either_ connString _or_ separate configuration arguments to be passed");
    }

    // parsing the string is unreasonable for now.  Just assume it's correct
    if (pgConfInst.connString) {
        return;
    }

    if (!(Utils.instance_of(pgConfInst, PGConf))) {
        throw new Error("validatePgConf requires a PGConf argument");
    }
    var err = "";
    var errFields = [];
    if (!pgConfInst.confObj.user) {
        errFields.push({
            field: 'user', reason: 'falsy'
        });
    }
    if (!pgConfInst.confObj.database) {
        errFields.push({
            field: 'database', reason: 'falsy'
        });
    }
    if (!pgConfInst.confObj.password) {
        errFields.push({
            field: 'password', reason: 'falsy'
        });
    }
    if (!pgConfInst.confObj.port) {
        errFields.push({
            field: 'port', reason: 'falsy'
        });
    }
    if (!pgConfInst.confObj.host) {
        errFields.push({
            field: 'host', reason: 'falsy'
        });
    }
    if (isNullOrUndefined(pgConfInst.confObj.ssl)) {
        errFields.push({
            field: 'ssl', reason: 'null or undefined'
        });
    }
    if (errFields.length) {
        var fieldReasons = "";
        errFields.forEach(function(e) {
            fieldReasons += "\n  field: " + e.field + "\n  reason: " + e.reason;
        });
        throw new Error("Invalid Arguments: The following fields were invalid" + fieldReasons);
    }
};


//------------------//
// Helper Functions //
//------------------//

function isNullOrUndefined(prop_) {
    return (typeof prop_ === 'undefined' || prop_ === null);
}


//---------//
// Exports //
//---------//

module.exports = PGConf;
