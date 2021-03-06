/************************************
 * Application Server.              *
 * @author: JulyMarval              *
 * @version: 1.0                    *
 ***********************************/

/* Global Variables */

var express          = require('express');        // call express
var app              = express();                 //define our app using express
var bodyParser       = require('body-parser');
var cors             = require('cors');
var http             = require('http');

/*Routes */

var login            = require('./routes/Login');
var create           = require('./routes/CreateAccount');
var home             = require('./routes/Home');
var update           = require('./routes/UpdateAccount');
var drop             = require('./routes/DeleteAccount');
var reset            = require('./routes/ResetPassword');


var port = process.env.PORT || 80;        // set our port


var httpServer = http.createServer(app);


/* configure app to use bodyParser()
 this will let us get the data from a POST */
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



/* REGISTER OUR ROUTES 
 all of our routes will be prefixed with /services */

app.use('/services/v1/login', login);
app.use('/services/v1/createaccount',create);
app.use('/services/v1/home',home);
app.use('/services/v1/updateaccount',update);
app.use('/services/v1/deleteaccount',drop);
app.use('/services/v1/resetpassword',reset);

app.get('/', function(req, res){
  res.status(404).send('Sorry cant find that!');
});

//app.set("view engine","jade");

/* START THE SERVER */

httpServer.listen(80);