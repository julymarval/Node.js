/************************************
 * Update Account Router.           *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express    = require('express');        
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../utils/Utils');
var constants  = require('../utils/Constants');
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

    var name = req.body.name, lastName = req.body.lastName, city = req.body.city, direction = req.body.direction;
    var specialReqs = req.body.specialReqs, hasVisa = req.body.hasVisa, phone = req.body.phone, postalCode = req.body.postalCode;
    var data = {}, count = 0, returnedData = [], validN, validLN;

    if(!req.headers.authorization){
        response.doInvalidSessionResponse(function(json){
            res.send(json);
        });
    }
    else{
        manager.doVerifySessionToken(req,function(err,resp){
            if(!err){
                if(name){
                    validate.isValidName(name,name,function(re){
                        if(re == true){
                            data.name = name;
                        }
                        else{
                           validN = false;
                        }
                    });
                    
                }
                if(lastName){
                    validate.isValidName(lastName,lastName,function(re){
                        if(re == true){
                            data.lastname = lastName;
                        }
                        else{
                            validLN = false;
                        }
                    });
                }
                if(city){
                    data.city = city;
                }
                if(direction){
                    data.direction = direction;
                }
                if(specialReqs){
                    data.specialreqs = specialReqs;
                }
                if(hasVisa){
                    data.hasvisa = hasVisa;
                }
                if(phone){
                    data.phone = phone;
                }
                if(postalCode){
                    data.postalcode = postalCode;
                }

                if (validN == false || validLN == false){ 
                    response.doGeneralResponse(constants.invalid_input_parameter_code,constants.invalid_input_parameter_msg,
                        function(resp){
                            res.send(resp);
                    });
                }

                if(Object.keys(data).length == 0){
                    response.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,
                    function(json){
                        res.send(json);
                    });
                }
                else{
                    for (var prop in data) {
                        manager.doUpdateUser(prop,data[prop],resp,function(err,resp){
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
            else{
                res.send(resp);
            }
        });
    }
});

module.exports = Update;