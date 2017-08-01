/********************************************************** 
* Route that uploads a video to a server using formidable *
**********************************************************/

/* Global Variables */

var express        = require('express');        
var bodyParser     = require('body-parser');
var gm             = require('gm');
var busboy         = require('connect-busboy');
var methodOverride = require('method-override');
var fs             = require('fs');
var path           = require('path');  
var formidable     = require('formidable');
var util           = require('util');
var extra          = require('fs-extra');


var Youtube = express.Router();              // get an instance of the express Youtube

var log4js = require('log4js'); // for logging

log4js.configure({appenders: [{type: 'file', filename: '/var/log/file.log', category: 'dev'}]});
var logger = log4js.getLogger('dev');
logger.setLevel('INFO');


/* configure app to use bodyParser()
 this will let us get the activity from a POST */

Youtube.use(bodyParser.json({limit:'1024mb'}));
Youtube.use(bodyParser.urlencoded({limit: '1024mb', extended: true,}));
Youtube.use(busboy());

/* 
* Post Method for Youtube service
* @param: file - video
* @send: response - json
*/

Youtube.post('/',function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    var scene, ext; 
 
	var form = new formidable.IncomingForm();
	
	// This gets the extra fields that are sent throught the form (text,etc).
	form.parse(req, function(err, fields, files) {
		scene = fields.scene;
	}); 
	
	form.on('end', function(fields, files) {
		var temp_path = this.openedFiles[0].path; // getting the path where the video was loaded in the server.
		var file_name = this.openedFiles[0].name; // getting the file's name.
		ext = path.extname(file_name); // getting the video's extention.
		// validating the video's format
		if(ext == '.mov' || ext == '.mpeg4' || ext == '.avi' || ext == '.wmv' || 
		ext == '.mpegps' || ext == '.flv' || ext == '.mp4' || ext == '.3gp'){                            
			var saveTo = path.join(__dirname,YourDirName); // the dirname is the path in your server where the video is going to be saved
			extra.copy(temp_path, saveTo + file_name, function(err) {  
				if (err) {
					logger.error(err);
				}
				else {
					console.log("success!")
					res.send("Ok");
				}
			});
		}
		else{
			res.send("Error");
		}
	});

});

module.exports = Youtube;
