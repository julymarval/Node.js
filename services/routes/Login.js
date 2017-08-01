/************************************
 * Login Router.                    *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express    = require('express');        // call express
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../model/Utils');
var constants  = require('../model/Constants');
var response   = require('../manager/JsonManager');

var Login = express.Router();              // get an instance of the express Login

/* configure app to use bodyParser()
 this will let us get the data from a POST */

Login.use(bodyParser.urlencoded({ extended: true }));
Login.use(bodyParser.json());


/* 
* Post Method for login service
* @param : username - string - not null
* @param : pwd - string - not null
* @send  : response - json
*/

Login.post('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    var uid = req.body.uid, pwd = req.body.pwd;
    var validE, validP;

    if(!uid && !pwd){
        response.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,
            function(resp){
                res.send(resp);
        });
    }
    else if((!uid && pwd) || (uid && !pwd)){
        response.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,
            function(resp){
                res.send(resp);
        });
    }

    validate.isValidEmail(uid,function(resp){
        validE = resp;
    }); 

    if (validE == false){
        
        response.doGeneralResponse(constants.invalid_input_parameter_code,constants.invalid_input_parameter_msg,
            function(resp){
                res.send(resp);
        });
    }
    else{  
        manager.doLogin(uid.toLowerCase(),pwd,function(resp){
            res.send(resp)
        });
    }

});

module.exports = Login;
