/************************************
 * Create Account Router.           *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express    = require('express');        
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../utils/Utils');
var constants  = require('../utils/Constants');
var json       = require('../manager/JsonManager');

var Create = express();              // get an instance of the express Create

/* configure app to use bodyParser()
 this will let us get the data from a POST */

Create.use(bodyParser.urlencoded({ extended: true }));
Create.use(bodyParser.json());


/* 
* Post Method for Create service
* @param : name String – not null – users name
* @param : dateOfBirth – nullable – format: dd/MM/yyyy, users birthday
* @param : lastName String – not null – users lastname
* @param : email String – not null – users email
* @param : pwd String – not null -users password
* @param : cpwd String – not null – confirm password
* @send  : response - json
*/

Create.post('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    var name = req.body.name, pwd = req.body.pwd, lastName = req.body.lastName;
    var phone = req.body.phone, email = req.body.email, cpwd = req.body.cpwd;
    var postalCode = req.body.postalCode, city = req.body.city, hasVisa = req.body.hasVisa;
    var documentId = req.body.documentId, specialReqs = req.body.specialReqs, direction = req.body.direction;

    var validDa,validE,validN,validP;

    if(!name || !lastName || !pwd || !cpwd || !email || !phone || !direction || !postalCode || !city | !hasVisa || !documentId){
        
        json.doGeneralResponse(constants.mising_input_parameter_code,constants.mising_input_parameter_msg,function(resp){
                res.send(resp);
        });

    }
    else{

        validate.isValidEmail(email,function(resp){
            validE = resp; 
        }); 
        validate.isValidPassword(pwd,cpwd, function(resp){
            validP = resp;
        });
        validate.isValidName(name,lastName,function(resp){
            validN = resp;
        });
        validate.isValidVisa(hasVisa,function(resp){
            validV = resp
        });
        
        
        if ( validE == false || validP == false || validN == false || validDa == false || validV == false){
                
            json.doGeneralResponse(constants.invalid_input_parameter_code,constants.invalid_input_parameter_msg,function(resp){
                res.send(resp);
            });
        }

        else{
            var data = {}

            data.name = name;
            data.lastName = lastName;
            data.email = email.toLowerCase();
            data.documentId = documentId;
            data.pwd = new Buffer(pwd).toString('base64');
            data.city  = city;
            data.specialReqs = specialReqs;
            data.direction = direction;
            data.hasVisa = hasVisa;
            data.postalCode = postalCode;
            data.phone = phone;

            
            manager.doCreateAccount(data,function(resp){
                    res.send(resp);
            });
        }
    }
});

module.exports = Create;