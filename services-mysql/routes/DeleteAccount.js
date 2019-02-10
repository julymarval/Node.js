/************************************
 * Delete Account Router.           *
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

var DropAccount = express();              // get an instance of the express Update

/* configure app to use bodyParser()
 this will let us get the data from a POST */

DropAccount.use(bodyParser.urlencoded({ extended: true }));
DropAccount.use(bodyParser.json());


/* 
* Post Method for Update Account service
* @param : name String – nullable – users name
* @param : lastName String - nullable - user's lastname
* @send  : response - json
*/

DropAccount.post('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    if(!req.headers.authorization){
        response.doInvalidSessionResponse(function(json){
            res.send(json);
        });
    }
    else{
        manager.doVerifySessionToken(req,function(err,resp){
            if(!err){
                manager.doDeleteUser(resp,function(json){
                    res.send(json);
                });
            }
            else{
                res.send(resp);
            }

        });

    }

});

module.exports = DropAccount;