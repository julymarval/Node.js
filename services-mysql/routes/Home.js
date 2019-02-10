/************************************
 * Home Router.                     *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express    = require('express');        // call express
var bodyParser = require('body-parser');
var manager    = require('../manager/ServicesManager');
var validate   = require('../utils/Utils');
var constants  = require('../utils/Constants');
var json       = require('../manager/JsonManager');

var Home = express.Router();              // get an instance of the express Home

/* configure app to use bodyParser()
 this will let us get the data from a POST */

Home.use(bodyParser.urlencoded({ extended: true }));
Home.use(bodyParser.json());


/* 
* Get Method for Home service
* @send: response - json
*/

Home.get('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    if(!req.headers.authorization){
        json.doInvalidSessionResponse(function(json){
            res.send(json);
        });
    }
    else{
        manager.doVerifySessionToken(req,function(err,resp){
            if(!err){
                manager.doGetUser(resp,function(json){
                    res.send(json);
                });
            }
            else{
                res.send(resp);
            }
        });
    }
    
});

module.exports = Home;