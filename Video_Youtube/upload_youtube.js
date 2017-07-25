/************************************************************
* Function to upload a video to youtube using youtube's api *
************************************************************/


/* Global Variables */

var log4js      = require('log4js'); // for logging
var fs          = require('fs');    // manage files in server
var Youtube     = require('youtube-api');

log4js.configure({appenders: [{type: 'file', filename: '/var/log/file.log', category: 'dev'}]});
var logger = log4js.getLogger('dev');
logger.setLevel('INFO');


/*
* Function to load a video to youtube
* @param : user - user 
* @return: json
*/

function doPublishVideo(){

		var oauth = Youtube.authenticate({
			type: "oauth",
			refresh_token: "Refresh Token", // replace with your refresh token from youtube api
			client_id: "Public Id", // replace with your public id from youtube api
			client_secret: "Public Secret Key", // replace with your public secret key from youtube api
			redirect_url: "Redirect URL" // replace with your api redirect url.
		});
		
		var req = Youtube.videos.insert({
			resource: {
				snippet: {
					title: "tittle" // replace with the tittle of your video 
				, description: "description" // replace with the a description of your video 
			},
			status: {
					privacyStatus: "public"
				}
			},
			part: "snippet,status",

			media: {
				body: fs.createReadStream("dir") // dir is the path in the server of the video.
			}
		},function (err, data){
			if(!err && data.status['uploadStatus'] == "uploaded"){			
				var exit = JSON.parse(JSON.stringify(data));
				
					fs.unlink(resp.video,function(error){ // deleting the video from the server
						if(error){
							logger.error(error);
						}
					});
				}
			}
			else{
				logger.error(err);
			}
		}); 
	}

}

module.exports.doPublishVideo = doPublishVideo;