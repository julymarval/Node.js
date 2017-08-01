/************************************
 * SetPassword password Router.     *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */


var express    = require('express');        // call express
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../model/Utils');
var constants  = require('../model/Constants');
var json       = require('../manager/JsonManager');

var SetPassword = express();              // get an instance of the express SetPassword

/* configure app to use bodyParser()
 this will let us get the data from a POST */

SetPassword.use(bodyParser.urlencoded({ extended: true }));
SetPassword.use(bodyParser.json());


/* 
* Post Method for SetPassword service
* @param : pwd - string - not null
* @param : npwd - string - not null
* @param : cpwd - string - not null
* @send  : response - json
*/

SetPassword.post('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');
    
    var pwd = req.body.pwd, npwd = req.body.npwd, cpwd = req.body.cpwd;
    var validP;
    
    if(!req.headers.sessiontoken){
        json.doInvalidSessionResponse(function(json){
            res.send(json);
        });
    } 
    
    else{

        if(!pwd || !npwd || !cpwd){
            
            json.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,
            function(resp){
                res.send(resp);
            });
        }
        else{
            validate.isValidPassword(npwd,cpwd,function(resp){
                validP = resp; 
            }); 
            
            if ( validP == false || npwd.length < 8 ){
                    
                json.doGeneralResponse(constants.invalid_input_parameter_code,constants.invalid_input_parameter_msg,
                    function(resp){ 
                        res.send(resp);
                });
            }

            else{
                manager.doVerifySessionToken(req,function(err,resp){
                    if(!err){
                         manager.doSetPassword(resp.user,npwd,function(json){
                                res.send(json);
                        });
                    }
                    else{
                        res.send(resp);
                    }           
                });
            }
        }
    }
});

module.exports = SetPassword;