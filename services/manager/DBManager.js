/*****************************************
 * DB Manager for operations with mongo. *
 * @author: Julyamnis Marval             *
 * @version: 1.0                         *
 ****************************************/

var log4js      = require('log4js'); // for logging
var MongoClient = require('mongodb').MongoClient;
var config      = require('../config/config');

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
 * Method that inserts a new document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: callback - Function 
 * @return: message
 */

function insertDB(collec,data,callback){

    var user = {};
    
    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {

           // Get the documents collection
           var collection = mongo.collection(collec);

            // Insert some users
            collection.insert(data, function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else {
                    logger.info("Inserted in DB");
                    callback(null,"Ok");
                }
                //Close connection
                mongo.close();
            });
        }
    });
}

module.exports.insertDB = insertDB;

/*
 * Method that inserts a new document in the DB and get the doc inserted.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: callback - Function 
 * @return: message
 */

function insertDBResponse(collec,data,callback){

    var user = {};
    
    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {

           // Get the documents collection
           var collection = mongo.collection(collec);

            // Insert some users
            collection.insert(data, function (err, result) {
                if (err) {
                    logger.error(err.message);
                    callback(err);
                } 
                else {
                    logger.info("Inserted in DB");
                    callback(null,result.ops[0]);
                }
                //Close connection
                mongo.close();
            });
        }
    });
}

module.exports.insertDBResponse = insertDBResponse;


/*
 * Method that updates a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateDB(collec,field2,id,field,value,callback){

    
    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            
            var query1 = {[field]:id};
            var query2 = {[field2]:value};
            var collection = mongo.collection(collec);

           // Insert some users
           collection.update(query1, {$set: query2}, function (err, numUpdated) {
               if (err) {
                   logger.error(err.message);
                   callback(err,null);
               } 
               else if (numUpdated) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No document to update");
                   callback("error",null);
               }
               //Close connection
               mongo.close();
          });
      }
   });
}

module.exports.updateDB = updateDB;

/*
 * Method that updates a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateDBId(collec,field2,id,value,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id);
            var query2 = {[field2]:value};
            var collection = mongo.collection(collec);

           collection.update({_id:o_id}, {$set: query2}, function (err, numUpdated) {
               if (err) {
                   logger.error(err.message);
                   callback(err,null);
               } 
               else if (numUpdated) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No document to update");
                   callback("error",null);
               }
               //Close connection
               mongo.close();
          });
      }
   });
}

module.exports.updateDBId = updateDBId;


/*
 * Method that adds a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function addDocDB(collec,field2,value,id,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id);
            var query2 = {[field2]:value};
            var collection = mongo.collection(collec);
            
            collection.update({_id:o_id},{$push:query2},function(err, model) {
                if (err) {
                   logger.error(err.message);
                   callback(err,null);
               } 
               else if (model) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No document to update");
                   callback(null,null);
               }
            });
        }

        //Close connection
        mongo.close();
   });

}

module.exports.addDocDB = addDocDB;


/*
 * Method that deletes a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: email - String - email of the document to delete
 * @param: callback - Function 
 * @return: message
 */

function deleteDB(collec,field,id,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {

            var collection = mongo.collection(collec);
            var query1 = {[field]:id};

            collection.deleteOne(query1, function(err, result) {
                
                if(!err && result.result.n == 1){
                    callback(null,result);
                }
                else{
                    logger.error(err.message);
                    callback(err);
                }
            });


        }
    });
}

module.exports.deleteDB = deleteDB;


/*
 * Method that deletes one field of a document.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: id - String - field id
 * @param: field -string - field to ve verify
 * @return: response - json
 */


function deleteDocDB(collec,id,field,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {

            var query1 = {[field]:id};
            var query2 = {[field]:""};

            var collection = mongo.collection(collec);

           collection.update(query1, {$unset: query2}, function (err, numUpdated) {
               if (err) {
                   logger.error(err.message);
                   callback(err);
               } 
               else if (numUpdated) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No collection updated");
                   callback(null,null);
               }
               //Close connection
               mongo.close();
          });
      }
   });


}

module.exports.deleteDocDB = deleteDocDB;


/*
 * Method that finds a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: email - String - email to identify the document
 * @param: callback - Function 
 * @return: message
 */

function findDB(collec,field,id,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var query = {[field]:id};
            var collection = mongo.collection(collec);

            // Locate specific document by key
            collection.find(query).nextObject(function(err, doc) { 
                if(doc != null || doc != undefined){
                    callback(null,doc);
                }
                else{
                    logger.error(err);
                    callback(err);
                }
            });
        }
    }); 
}

module.exports.findDB = findDB;


/*
 * Method that updates a document in the DB.
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateArrayDB(collec,name,user,value,field2,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {

            var query2 = {[field2]:value};
            var collection = mongo.collection(collec);

           // Insert some users
           collection.update({'name':name,'members.uid':user}, {$set: query2}, function (err, numUpdated) {
               if (err) {
                   logger.error(err.message);
                   callback(err,null);
               } 
               else if (numUpdated.result.nModified > 0) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No document to update");
                   callback("error",null);
               }
               //Close connection
               mongo.close();
          });
      }
   });
}

module.exports.updateArrayDB = updateArrayDB;





/*
 * Method that finds by id a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: id - String - activity id
 * @param: callback - Function 
 * @return: message
 */

function findById(collec,id,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    var array = [],i=0;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id);
            var collection = mongo.collection(collec);
            
            collection.find(ObjectId(id)).nextObject(function(err,resp){
                if(!err){
                    callback(null,resp);
                }
                else{
                    logger.error(err.message);
                    callback("error",null);
                }
            });
        }
    });

}

module.exports.findById = findById;

/*
 * Method that finds by id a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: id - String - activity id
 * @param: callback - Function 
 * @return: message
 */

function deleteById(collec,id,field,callback){

    var url = config.mongoURL+config.host+':'+config.port+'/'+config.db;

    var array = [],i=0;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id);

            var collection = mongo.collection(collec);

           collection.remove({_id:o_id}, function (err, numUpdated) {
               if (err) {
                   logger.error(err.message);
                   callback(err);
               } 
               else if (numUpdated) {
                   callback(null,"ok");
               } 
               else {
                   logger.error("No collection updated");
                   callback(null,null);
               }
               //Close connection
               mongo.close();
          });
        }
    });
}

module.exports.deleteById = deleteById;
