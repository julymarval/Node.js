/************************************
 * Manager for json responses.      *
 * @author: DevHub                  *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var log4js = require('log4js');
var constants = require('../model/Constants');

log4js.configure({
    appenders: {
    app:{ type: 'file', filename: '/var/log/file.log' }
    },
    categories: {
    default: { appenders: [ 'app' ], level: 'info' }
    }
});
var logger = log4js.getLogger('dev');




var response;

/*
* function to login json response
* @param : code - int - not null
* @param : msg - string - not null
* @param : token - string - not null
* @return : response - json
*/

function doLoginResponse(code,msg,token,data,callback){

    var response = {};
    var session = {};
    var info = {};
    
    session.sessionToken = token;
    session.user = data;
    info.code = code;
    info.msg = msg;

    response.response = session;
    response.error = info;

    callback(response);

}

module.exports.doLoginResponse = doLoginResponse;


/*
* function to internal error json response
* @return : response - json
*/

function doInternalErrorResponse(callback){

    var response = {};
    var info = {};
    
    info.code = constants.internal_error_code;
    info.msg = constants.internal_error_msg

    response.response = "";
    response.error = info;
    
    callback(response);
}

module.exports.doInternalErrorResponse = doInternalErrorResponse;


/*
* function to ok json response
* @return : response - json
*/

function doOkResponse(callback){

    var response = {};
    var info = {};
    
    info.code = constants.ok_code;
    info.msg = constants.ok_msg;

    response.response = "";
    response.error = info;

    callback(response);
}

module.exports.doOkResponse = doOkResponse;


/*
* function to invalid session json response
* @return : response - json
*/

function doInvalidSessionResponse(callback){

    var response = {};
    var info = {};
    
    info.code = constants.invalid_session_code;
    info.msg = constants.invalid_session_msg;

    response.response = "";
    response.error = info;

    callback(response);
}

module.exports.doInvalidSessionResponse = doInvalidSessionResponse;


/*
* function to general response
* @param : code - int
* @param : msg - string
* @return: response - json
*/

function doGeneralResponse(code,msg,callback){
    
    var response = {};
    var info = {};

    info.code = code;
    info.msg = msg;

    response.response = "";
    response.error = info;

    callback(response);

}

module.exports.doGeneralResponse = doGeneralResponse;

/*
* function to general data response
* @param : code - int
* @param : msg - string
* @return: response - json
*/

function doGeneralDataResponse(code,msg,data,callback){
    
    var response = {};
    var info = {};

    info.code = code;
    info.msg = msg;

    response.response = data;
    response.error = info;

    callback(response);

}

module.exports.doGeneralDataResponse = doGeneralDataResponse;
