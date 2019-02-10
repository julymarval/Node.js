/*****************************************
 * DB Manager for operations with mysql. *
 * @author: JulyMarval                   *
 * @version: 1.0                         *
 ****************************************/

var mysql  = require('mysql');
var log4js = require('log4js'); // for logging
var config = require('../config/config');

log4js.configure({
    appenders: {
    app:{ type: 'file', filename: '/var/log/file.log' }
    },
    categories: {
    default: { appenders: [ 'app' ], level: 'info' }
    }
});
var logger = log4js.getLogger('dev');


/*
 * Method to connect to mysql database
 * @param: callback
 * @return: connection object
*/

function dbConnect(callback){

    var con = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.db
    });

    con.connect(function(err) {
        if (err) {
            logger.error(err);
            callback(err,null);
        }
        else{
            logger.info("connected to mysql...");
            callback(null,con);
        }
    });
}


/*
 * Method that inserts a new document in the DB.
 * @param: db - String - database
 * @param: data - map{} - data to be inserted
 * @param: callback - Function 
 * @return: message
 */

function insertDB(data,callback){

    var sql = "INSERT INTO " + config.tableU + " VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    
    dbConnect(function(err,db){

        if(!err){
            db.query(sql,[data.name,data.lastName,data.email,data.phone,data.postalCode,data.city,data.direction,
                data.hasVisa,data.documentId,data.specialreqs,data.pwd],function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else{
                    logger.info("Inserted in DB: " + JSON.stringify(result));
                    callback(null,"Ok");
                }
            });
        }
        else{
            logger.error(err);
            callback(err,null);
        }
    });
}

module.exports.insertDB = insertDB;


/*
 * Method that finds a document in the DB.
 * @param: db - String - database
 * @param: callback - Function 
 * @return: message
 */

function findDB(callback){

    var sql = "SELECT * FROM " + config.tableU;
    
    dbConnect(function(err,db){

        if(!err){
            db.query(sql,function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else{
                    logger.info("Get from DB: " + result[0]);
                    callback(null,result);
                }
            });
        }
        else{
            logger.error(err);
            callback(err,null);
        }
    });
}

module.exports.findDB = findDB;


/*
 * Method that finds by id a document in the DB.
 * @param: db - String - database
 * @param: id - String - user email
 * @param: callback - Function 
 * @return: message
 */

function findById(id,callback){

    var sql = "SELECT * FROM " + config.tableU + " WHERE email = ?";
    
    dbConnect(function(err,db){

        if(!err){
            db.query(sql,[id],function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else{
                    logger.info("Get user: " + result[0]);
                    callback(null,result);
                }
            });
        }
        else{
            logger.error(err);
            callback(err,null);
        }
    });
}

module.exports.findById = findById;



/*
 * Method that updates a document in the DB.
 * @param: db - String - database
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateDB(id,field,newValue,callback){
    console.log(field);
    var sql = "UPDATE " + config.tableU + " SET " + field + " = ? WHERE email = ?";
    
    dbConnect(function(err,db){

        if(!err){
            db.query(sql,[newValue,id],function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else{
                    logger.info("Updated user: " + JSON.stringify(result));
                    callback(null,"Ok");
                }
            });
        }
        else{
            logger.error(err);
            callback(err,null);
        }
    });
}

module.exports.updateDB = updateDB;


/*
 * Method that deletes a document in the DB.
 * @param: db - String - database
 * @param: email - String - email of the document to delete
 * @param: callback - Function 
 * @return: message
 */

function deleteDB(id,callback){

    var sql = "DELETE FROM " + config.tableU + "  WHERE email = ?";
    
    dbConnect(function(err,db){

        if(!err){
            db.query(sql,[id],function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else{
                    logger.info("Deleted user: " + JSON.stringify(result));
                    callback(null,"Ok");
                }
            });
        }
        else{
            logger.error(err);
            callback(err,null);
        }
    });
}

module.exports.deleteDB = deleteDB;
