/***************************************************
* Functions to query mongoDB using mongodb package *
***************************************************/

var log4js = require('log4js'); // for logging

log4js.configure({appenders: [{type: 'file', filename: '/var/log/file.log', category: 'dev'}]});
var logger = log4js.getLogger('dev');
logger.setLevel('INFO');



var MongoClient = require('mongodb').MongoClient;


/*
 * Method that inserts a new document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: callback - Function 
 * @return: message
 */

function insertDB(host,port,db,collec,data,callback){

    var user = {};
    
    var url = config.mongoURL+host+':'+port+'/'+db; // replace all the parameters with your mongo info

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

function insertDBResponse(host,port,db,collec,data,callback){

    var user = {};
    
    var url = config.mongoURL+host+':'+port+'/'+db;

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

function updateDB(host,port,db,collec,field2,id,field,value,callback){

    
    var url = config.mongoURL+host+':'+port+'/'+db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            
            var query1 = {[field]:id}; // to find the doc
            var query2 = {[field2]:value}; // the update info
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
 * Method that updates a document in the DB by id.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateDBId(host,port,db,collec,field2,id,value,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id); //object id
            var query2 = {[field2]:value}; // the update info
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
 * Method that adds a document to another in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function addDocDB(host,port,db,collec,field2,value,id,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            var ObjectId = require('mongodb').ObjectID; 
            var o_id = ObjectId(id); //document id where is going to be inserted the new one
            var query2 = {[field2]:value}; // new doc
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

function deleteDB(host,port,db,collec,field,id,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

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


function deleteDocDB(host,port,db,collec,id,field,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

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

function findDB(host,port,db,collec,field,id,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;
    
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
 * Method that finds a document in an interval in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: email - String - email to identify the document
 * @param: callback - Function 
 * @return: message
 */

function findDBInterval(host,port,db,collec,field,id,skip,limit,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;
    
    var array = [],i=0;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var query = {[field]:id};
            var collection = mongo.collection(collec);

            if(skip != null && limit != null){
				// replace "field" with the name of the field you want to search
                collection.find({'uid':id,'field': {'$gte': skip, '$lte': limit}}).each(function(err, doc){ 
                    if(!err && doc != null){
                        array[i] = doc;
                        i++;
                    }
                    else if (doc == null){
                        logger.info("Empty doc");
                        callback(null,array);
                    }
                    else if (err){
                        logger.error(err.message);
                        callback(err,null);
                    }
                }); 

            }
            else{
				// this returns the result in decrec order
                collection.find(query).sort({ _id: -1 }).each(function(err, doc){
                    if(!err && doc != null){
                        array[i] = doc;
                        i++;
                    }
                    else if (doc == null){
                        callback(null,array);
                    }
                    else if (err){
                        logger.error(err.message);
                        callback(err,null);
                    }
                }); 
            }
        }
    }); 
}

module.exports.findDbActivities = findDbActivities;

/*
 * Method that updates an array doc in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: data - map{} - data to be update
 * @param: callback - Function 
 * @return: message
 */

function updateArrayDB(host,port,db,collec,name,user,value,field2,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {

            var query2 = {[field2]:value};
            var collection = mongo.collection(collec);
			
			// replace field, name, value with the values you want to search in your db
			collection.update({'field':name,'field.value':user}, {$set: query2}, function (err, numUpdated) {
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
* Method that find for autocomplete a search
* @param: host - String - database host
* @param: port - String - database port
* @param: db - String - database
* @param: collec - String - collection
* @param: b - string - email
* @param: callback - Function 
* @return: message
*/

function findAutoDB(host,port,db,collec,b,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;
    
    var array = [],i=0;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            callback(err);
        } 
        else {
            var collection = mongo.collection(collec);
			// replace name with the field you want to search in your db and the limit is the quantity of result you want per search
            collection.find({'name': new RegExp(b, 'i')}).limit(5).each(function(err, items) {
                if(!err && items != null){
                    array[i] = items;
                    i++;
                }
                else if (items == null){
                    callback(null,array);
                }
                else if (err){
                    logger.error(err.message);
                    callback(err,null);
                }
            });
        }
    });
}

module.exports.findAutoDB = findAutoDB;

/*
 * Method that finds all document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: email - String - email to identify the document
 * @param: callback - Function 
 * @return: message
 */

function findDBAll(host,port,db,collec,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

    var array = [],i=0;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var collection = mongo.collection(collec);

            // Locate specific document by key
            collection.find().toArray(function(err, items) { 
                if(!err && items != null){
                    callback(null,items);
                }
                else if (items == null){
                    callback(null,null);
                }
                else if (err){
                    logger.error(err.message);
                    callback(err,null);
                }
            });
        }
    }); 
}

module.exports.findDBAll = findDBAll;

/*
 * Method that removes an array from a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: email - String - email to identify the document
 * @param: callback - Function 
 * @return: message
 */

function removeDocMember(host,port,db,collec,name,user,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

    var array = [],i=0;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, mongo) {
        if (err) {
            logger.error(err.message);
            callback(err);
        } 
        else {
            var collection = mongo.collection(collec);
			// rpelace the fields values for the ones you need to use to query in your db
            collection.update({'name':name},{$pull:{members:{uid:user}}},function(err,resp){
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

module.exports.removeDocMember = removeDocMember;

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

function findById(host,port,db,collec,id,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

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
 * Method that deletes by id a document in the DB.
 * @param: host - String - database host
 * @param: port - String - database port
 * @param: db - String - database
 * @param: collec - String - collection
 * @param: id - String - activity id
 * @param: callback - Function 
 * @return: message
 */

function deleteById(host,port,db,collec,id,field,callback){

    var url = config.mongoURL+host+':'+port+'/'+db;

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
