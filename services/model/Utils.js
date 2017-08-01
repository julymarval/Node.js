/************************************
 * Validation Manager for inputs.   *
 * @author: Julyamnis Marval        *
 * @version: 1.0                    *
 ***********************************/


/* Global Variables */

var log4js = require('log4js');

log4js.configure({
    appenders: {
    out:{ type: 'console' },
    app:{ type: 'file', filename: '/var/log/file.log' }
    },
    categories: {
    default: { appenders: [ 'out', 'app' ], level: 'info' }
    }
});
var logger = log4js.getLogger('dev');



/* 
* Method that validates if an email is valid.
* @param : email
* @return : boolean
*/

function isValidEmail(email,callback){

    regExp = /^([a-zA-Z0-9_+\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    callback(regExp.test(email));
    
}


module.exports.isValidEmail = isValidEmail;

/* 
* Method that validates if a password is valid.
* @param : pwd
* @return : boolean
*/

function isValidPassword(pwd,cpwd,callback){

    if(pwd.length < 8 ){
        logger.error("PWD not long enought");
        callback(false);
    }
    if(pwd != cpwd){
        logger.error("Password mismatch");
        callback(false)
    }

}


module.exports.isValidPassword = isValidPassword;


/*
 * Method that validates name and lastName.
 * @param: name - string
 * @param: lastName - string
 * @return: map{}
 */

function isValidName(name,lastName,callback){

    var regex = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;

    if(name.length < 2 || lastName.length < 2 || name.length > 256 || name.length > 256){
        callback(false);
    }
    else if(!regex.test(name) && !regex.test(lastName) && typeof name == 'string' && typeof lastName == 'string'){
        
        callback(true);
    }
    else{
        logger.error("invalid name or lastname");
        callback(false);
    }


}

module.exports.isValidName = isValidName;


/*
 * Method that validates a date.
 * @param: date
 * @return: map{}
 */

function isValidDate(date,callback){

    var reg = /^(\d{2})[/](\d{2})[/](\d{4})$/;
    
    callback(reg.test(date));
}

module.exports.isValidDate = isValidDate;


