/************************************
 * Manager for services application.*
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

/* Global Variables */

var log4js     = require('log4js'); // for logging
var jwt        = require('jwt-simple');  
var moment     = require('moment');
var random     = require('randomstring');
var response   = require('../manager/JsonManager');
var db         = require('../manager/DbManager');
var constants  = require('../utils/Constants');
var config     = require('../config/config');

log4js.configure({
    appenders: {
    app:{ type: 'file', filename: '/var/log/file.log' }
    },
    categories: {
    default: { appenders: [ 'app' ], level: 'info' }
    }
});
var logger = log4js.getLogger('dev');


/*
 * Method that creates a session token.
 * @param: email
 * @return: reponse - json
 */

function doCreateSessionToken(email,callback){
    
    var payload = {
        sub: email,
        iat: moment().unix(),
        exp: moment().add(config.sessionTime, "hours").unix(),
    };

    logger.info("Session Token created");    
    callback(null,jwt.encode(payload, config.encryptionToken));


}

/*
 * Method that verifys session token.
 * @param: req
 * @return: response - json
 */

function doVerifySessionToken(req,callback){

    try{

        var payload = jwt.decode(req.headers.authorization.split(" ")[1], config.encryptionToken);

        if(payload.exp <= moment().unix()) {
            logger.error("Invalid session");
            response.doInvalidSessionResponse(function(json){
                callback("error",json);
            });
        }
        else{
            callback(null,payload.sub)   
        }
    }
    catch(err){
        logger.error(err.message);
        response.doInvalidSessionResponse(function(json){
            callback("error",json);
        });
    }
}

module.exports.doVerifySessionToken = doVerifySessionToken;


/********************************** Services Manager  **********************************/


/* 
* function to login service
* @param : uid - string - not null
* @param : pwd - string - not null
* @return : response - json
*/

function doLogin(uid,pwd,callback){

    var value;

    db.findById(uid,function(err,resp){
        if(!err && (resp != undefined|| resp != null || resp.length > 0)){    
            value = new Buffer(resp[0].password, 'base64').toString('utf-8');
            if(pwd == value){
                doCreateSessionToken(resp[0].email,function(err,token){
                    if(!err){
                        delete resp[0].password
                        response.doLoginResponse(constants.ok_code,constants.ok_msg,token,resp,function(json){
                            callback(json);
                        });
                    }
                    else{
                        logger.error(err.message);
                        response.doInternalErrorResponse(function(json){
                            callback(json);
                        });
                    }
                });
            }
            else{
                response.doGeneralResponse(constants.invalid_password_code,constants.invalid_password_msg,function(json){
                    callback(json);
                });
            }
        }
        else{
            response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                callback(json);
            });
        }
    });
}


module.exports.doLogin = doLogin;



/* 
* function to create an user
* @param : data - json 
* @return : response - json
*/

function doCreateAccount(data,callback){
    
    db.findById(data.email,function(err,resp){
        if(resp == null || resp.length == 0){
            db.insertDB(data,function(err,resp){
                if(err){  
                    logger.error(err.message);
                    response.doInternalErrorResponse(function(json){
                        callback(json);
                    });
                }
                response.doOkResponse(function(json){
                    callback(json)
                });
            });
        }
        else if(resp.length > 0){
            response.doGeneralResponse(constants.user_already_exists_code,constants.user_already_exists_msg,function(json){
                callback(json);
            });
        }
    });
    
}

module.exports.doCreateAccount = doCreateAccount;


/*
* function to get an user
* @param  : user - not null - user 
* @return : response - json
*/

function doGetUser(user,callback){

    db.findById(user,function(err,resp){
        if(resp == null || resp.length == 0){ 
            response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                callback(json);
            });
        }
        else{
            delete resp[0].password
            response.doGeneralDataResponse(constants.ok_code,constants.ok_msg,resp,function(json){
                callback(json);
            });
        }
    });
}

module.exports.doGetUser = doGetUser;



/*
* function to update an user
* @param  : data - not null - user data to be update
* @return : response - json
*/

function doUpdateUser(field,value,user,callback){
    
    db.findById(user,function(err,resp){
            if(resp == null || resp.length == 0){ 
                response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                    callback(json);
                });
            }
            else{
                db.updateDB(user,field,value,function(err,json){
                    if(!err){
                        callback(null,"ok");
                    }
                    else{
                        logger.error(err.message);
                        callback("error",null);
                    }
                });
            }
    });
    
}

module.exports.doUpdateUser = doUpdateUser;


/*
* function to delete an user
* @param  : data - not null - user data to be update
* @return : response - json
*/

function doDeleteUser(user,callback){
    
    db.findById(user,function(err,resp){
            if(resp == null || resp.length == 0){ 
                response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                    callback(json);
                });
            }
            else{
                db.deleteDB(user,function(err,json){
                    if(!err){
                        response.doGeneralResponse(constants.ok_code,constants.ok_msg,function(json){
                            callback(json);
                        });
                    }
                    else{
                        response.doGeneralResponse(constants.internal_error_code,constants.internal_error_msg,function(json){
                            logger.error(err.message);
                            callback(json);
                        });
                    }
                });
            }
    });
    
}

module.exports.doDeleteUser = doDeleteUser;


/*
* function to set password service
* @param : npwd - string - not null
* @param : user - string - not null
* @return : response - json
*/

function doSetPassword(user,npwd,callback){

    db.findById(user,function(err,resp){
        if(!err && (resp != undefined || resp.length > 0)){
	        var value = new Buffer(npwd).toString('base64');
            db.updateDB(user,"password",value,function(err,json){
                if(!err){
                      response.doOkResponse(function(json){
                          callback(json);
                      });
                }
                else{
                    logger.error(err.message);
                    response.doInternalErrorResponse(function(json){
                        callback(json);
                    });
                }
            });
        }
    });
}

module.exports.doSetPassword = doSetPassword;