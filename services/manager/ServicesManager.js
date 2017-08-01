/************************************
 * Manager for services application.*
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var log4js     = require('log4js'); // for logging
var jwt        = require('jwt-simple');  
var moment     = require('moment');
var random     = require('randomstring');
var fs         = require('fs');
var response   = require('../manager/JsonManager');
var db         = require('../manager/DBManager');
var constants  = require('../model/Constants');
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
        var token = req.headers.sessiontoken;
        var payload = jwt.decode(token, config.encryptionToken);

        if(payload.exp <= moment().unix()) {
            logger.error("Invalid session");
            response.doInvalidSessionResponse(function(json){
                callback("error",json);
            });
        }
        else{
            db.findDB(config.colP,'email',payload.sub,function(err,resp){
                if(!err){
                    req.user = resp.email;
                    callback(null,req)
                }
                else{
                    logger.error(err.message);
                    response.doInvalidSessionResponse(function(json){
                        callback("error",json);
                    });
                }
            });
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

    db.findDB(config.colP,"email",uid,function(err,resp){
        if(!err && (resp != undefined|| resp != null)){ 
            logger.info(resp)    
            value = new Buffer(resp.pwd, 'base64').toString('utf-8');
            if(pwd == value){
                doCreateSessionToken(resp.email,function(err,token){
                    if(!err){
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
* function to create account service
* @param : data - json 
* @return : response - json
*/

function doCreateAccount(data,callback){
    
    db.findDB(config.colP,"email",data.email,function(err,resp){
        if(resp == null){
            db.insertDB(config.colP,data,function(err,resp){
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
        else if(resp != null){
            response.doGeneralResponse(constants.user_already_exists_code,constants.user_already_exists_msg,
            function(json){
                callback(json);
            });
        }
    });
    
}

module.exports.doCreateAccount = doCreateAccount;

/*
* function to get a user
* @param  : user - not null - user 
* @return : response - json
*/

function doGetUser(user,callback){

    db.findDB(config.colP,'email',user,function(err,resp){
        if(resp == null){ 
            response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                callback(json);
            });
        }
        else{
            response.doGeneralDataResponse(constants.ok_code,constants.ok_msg,resp,function(json){
                callback(json);
            });
        }
    });
}

module.exports.doGetUser = doGetUser;


/*
* function to set password service
* @param : npwd - string - not null
* @param : user - string - not null
* @return : response - json
*/

function doSetPassword(user,npwd,callback){

    db.findDB(config.colP,'email',user,function(err,resp){
        if(!err && (resp != undefined || resp != null)){
	    var value = new Buffer(npwd).toString('base64');
            db.updateDB(config.colP,"pwd",user,"email",value,function(err,json){
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

/*
* function to update account
* @param  : data - not null - user data to be update
* @return : response - json
*/

function doUpdateAccount(field,value,user,callback){
    
    db.findDB(config.colP,'email',user,function(err,resp){
            if(resp == null){ 
                response.doGeneralResponse(constants.non_existing_user_code,constants.non_existing_user_msg,function(json){
                    callback(json);
                });
            }
            else{
                db.updateDB(config.colP,field,user,"email",
                value,function(err,json){
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

module.exports.doUpdateAccount = doUpdateAccount;

