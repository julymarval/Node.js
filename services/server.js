/************************************
 * Application Server.              *
 * @author: DevHub                  *
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
var setPassword      = require('./routes/ResetPassword');
var updateAccount    = require('./routes/UpdateAccount');


var port = process.env.PORT || 80;        // set our port


var httpServer = http.createServer(app);


/* configure app to use bodyParser()
 this will let us get the data from a POST */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



/* REGISTER OUR ROUTES 
 all of our routes will be prefixed with /services */

app.use('/services/v1/login', login);
app.use('/services/v1/createaccount',create);
app.use('/services/v1/home',home);
app.use('/services/v1/resetpassword',setPassword);
app.use('/services/v1/updateaccount',updateAccount);


app.get('/', function(req, res){
  res.status(404).send('Sorry cant find that!');
});

app.set("view engine","jade");

/* START THE SERVER */

httpServer.listen(80);

