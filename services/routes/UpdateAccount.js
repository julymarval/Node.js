/************************************
 * Update Account Router.           *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express    = require('express');        
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../model/Utils');
var constants  = require('../model/Constants');
var response   = require('../manager/JsonManager');

var Update = express();              // get an instance of the express Update

/* configure app to use bodyParser()
 this will let us get the data from a POST */

Update.use(bodyParser.urlencoded({ extended: true }));
Update.use(bodyParser.json());


/* 
* Post Method for Update Account service
* @param : name String – nullable – users name
* @param : lastName String - nullable - user's lastname
* @send  : response - json
*/

Update.post('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    var name = req.body.name, lastName = req.body.lastName,dateOfBirth = req.body.dateOfBirth;
    var data = {}, count = 0, returnedData = [], validN, validL, validD;
    
    if(!req.headers.sessiontoken){
        response.doInvalidSessionResponse(function(json){
            res.send(json);
        });
    }
    else{
        manager.doVerifySessionToken(req,function(err,resp){
            if(!err){
                if (name){
                    validate.isValidName(name,"empty",function(resp){
                        if(resp == false){
                           validN = false;
                        }
                        else{
                            data.name = name
                        }
                    });
                }
                if(lastName){
                    validate.isValidName("empty",lastName,function(resp){
                        if(resp == false){
                            validL = false
                        }
                        else{
                            data.lastName = lastName;
                        }
                    });
                    
                }
                if(dateOfBirth){
                    validate.isValidDate(dateOfBirth,function(resp){
                        if(resp == false){
                           validD = false;
                        }
                        else{
                            data.dateOfBirth = dateOfBirth;
                        }
                    });
                    
                }
                if (validN == false || validD == false || validL == false){ 
                    response.doGeneralResponse(constants.invalid_input_parameter_code,constants.invalid_input_parameter_msg,
                        function(resp){
                            res.send(resp);
                    });
                }
                else{
                    if(Object.keys(data).length == 0){
                        response.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,
                        function(json){
                            res.send(json);
                        });
                    }
                    else{
                        for (var prop in data) {
                            if (data.hasOwnProperty(prop)) {
                                manager.doUpdateAccount(prop,data[prop],resp.user,function(err,resp){
                                    if(!err){
                                        returnedData.push(resp);
                                        count++;
                                        if(count == Object.keys(data).length){
                                            response.doOkResponse(function(json){
                                                res.send(json);
                                            });
                                        }
                                    }
                                    else{
                                        response.doInternalErrorResponse(function(json){
                                            res.send(json);
                                        });
                                        
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else{
                 res.send(resp);
            }
        });
    }
});

module.exports = Update;