

/* Global Variables */

var express    = require('express');        // call express
var bodyParser = require('body-parser');
var manager    = require('../manager/services_manager');
var validate   = require('../manager/validation_manager');
var constants  = require('../model/constants');
var response   = require('../manager/json_manager');
var MP         = require ("mercadopago");
var config     = require('../config/config');
var log4js     = require('log4js');

log4js.configure({appenders: [{type: 'file', filename: '/var/log/papita.log', category: 'dev'}]});
var logger = log4js.getLogger('dev');
logger.setLevel('INFO');

var ConnectML = express.Router();              // get an instance of the express ConnectML

/* configure app to use bodyParser()
 this will let us get the data from a POST */

ConnectML.use(bodyParser.urlencoded({ extended: true }));
ConnectML.use(bodyParser.json());


/* 
* Get Method for ConnectML service
* @send  : response - json
*/

ConnectML.get('/', function(req, res) {

    res.setHeader('Content-Type', 'application/json');
 
	var mp = new MP (Client_Id, Client_Secret); // Replace with your id and secret key of mercadopago
	var preference = {
		"items": [
			{
				"title": "tittle",
				"quantity": 1,
				"currency_id": "VEF",
				"unit_price": 100
			}
		],
		"auto_return" : "all",
		"back_urls":{"success":Succces URL,"pending":Pending URL, // URL = Your app redirect url
		"failure":Fail URL},
		"external_reference":id // Id of the client/user, for example
	};

	mp.createPreference(preference,function (err, data){
		if(!err){
			// You can replace this method with another that generates a json response
			response.doMercadoPagoResponse(constants.ok_code,constants.ok_msg,data.response['init_point'],
			data.response['sandbox_init_point'],function(json){
				res.send(json);
			});
		}
		else{
			logger.error("Error connecting to mercado pago");
			// You can replace this method with another that generates a json response
			response.doGeneralErrorResponse(constants.error_connecting_mp_code,constants.error_connecting_mp_msg,
				function(json){
					res.send(json);
			});
		}
	});                  
  
});

module.exports = ConnectML;
