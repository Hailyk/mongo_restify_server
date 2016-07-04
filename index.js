'use strict';

// dependency declaration
var mongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    restify = require('restify'),
    colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config');

// constant variable
const url = config.database_url,
    name= config.name,
    port = process.env.port || config.port;

var log = false;

if(config.logging == true){
    log = true;
}

// instance variable
var db;

// console color
colors.setTheme({
    error: 'red',
    warn: 'yellow',
    info: 'grey'
});

start();

// setup function
// @arg next function next function to run
function start(){
    var certificate, key;
    // read ssl
    try{
        // read ssl certificate
        certificate = fs.readFileSync(path.join(__dirname + "ssl/certificate"));
        key = fs.readFileSync(path.join(__dirname + "ssl/key"));
    } catch(err){
        certificate = "";
        key = "";
        console.warn("certificate and/or key not found in ssl folder".warn);
    }
    
    // create Restify server instance
    var server = certificate == "" && key == "" ? restify.createServer({}) : restify.createServer({
        certificate: certificate,
        key: key,
        name: name
    });

    // restify tool import
    server.use(restify.queryParser());
    server.use(restify.bodyParser({mapParams: true}));
    server.use(restify.authorizationParser());
    server.pre(restify.pre.userAgentConnection());

    // get request handler
    server.get("/", (request, response, next)=>{
        authenticator(config, request, (error, name)=> {
            if(error) console.warn(error);
            var d = new Date();
            if (log) console.log(d.getTime() + " Get request to " + request.getQuery() + " from " + request.connection.remoteAddress+ ", key name:" + name);
            // get and check collection
            var collection = request.query.collection;
            if (collection == null) collection = "";
            // get and check query
            var query = request.query.query;
            if (query == null) query = {};
            else query = JSON.parse(query);
            // establish connection to database
            mongoClient.connect(url, (err, data)=> {
                if (!err) {
                    restGet(data, collection, query, (err, data)=> {
                        responseHandler(err, response, data);
                    });
                } else {
                    // handle connection error
                    response.send({
                        error: true,
                        data: "unable to connect to db contact db admin"
                    });
                }
            });
        });
        next();
    });

    // post request handler
    server.post("/", (request, response, next)=>{
        // authenticator 
        authenticator(config, request, (error, name)=> {
            // log traffic
            var d = new Date();
            if (log) console.log(d.getTime() + " Get request to " + request.getQuery() + " from " + request.connection.remoteAddress + ", key name:" + name);
            // request parma collection
            var collection = request.query.collection;
            if (collection == null) collection = "";
            var body = request.body;
            if (body != null) {
                // turn string into json
                if (typeof body == "string") body = JSON.parse(body);
                mongoClient.connect(url, (err, data)=> {
                    if (!err) {
                        restPost(data, collection, body, (err, result)=> {
                            responseHandler(err, response, result);
                        });
                    } else {
                        response.send({
                            error: true,
                            data: "unable to connect to db contact db admin"
                        });
                    }
                });
            } else {
                response.send({
                    error: true,
                    data: "empty body"
                });
            }
        });
        next();
    });

    // put request handler
    server.put("/", (request, response, next)=>{
        // authenticator 
        authenticator(config, request, (error, name)=> {
            // log traffic
            var d = new Date();
            if (log) console.log(d.getTime() + " Get request to " + request.getQuery() + " from " + request.connection.remoteAddress + ", key name:" + name);
            // request parma collection
            var collection = request.query.collection;
            if (collection == null) collection = "";
            var query = request.query.query;
            if (query == null) query = {};
            else query = JSON.parse(query);
            var body = request.body;
            if (body != null) {
                // turn string into json
                if (typeof body == "string") body = JSON.parse(body);
                // establish connection to database
                mongoClient.connect(url, (err, data)=> {
                    if (!err) {
                        restPut(data, collection, query, body, (err, result)=> {
                            responseHandler(err, response, result);
                        });
                    } else {
                        response.send({
                            error: true,
                            data: "unable to connect to db contact db admin"
                        });
                    }
                });
            } else {
                response.send({
                    error: true,
                    data: "request doesn't have body"
                });
            }
        });
        next();
    });

    // delete request handler
    server.del("/", (request, response, next)=>{
        authenticator(config, request, (error, name)=> {
            var d = new Date();
            if (log) console.log(d.getTime() + " Get request to " + request.getQuery() + " from " + request.connection.remoteAddress + ", key name" + name);
            var collection = request.query.collection;
            if (collection == null) collection = "";
            var query = request.query.query;
            if (query == null) query = {};
            else query = JSON.parse(query);
            mongoClient.connect(url, (err, data)=> {
                if (!err) {
                    restDelete(data, collection, query, (err, result)=> {
                        responseHandler(err, response, result);
                    });
                } else {
                    response.send({
                        error: true,
                        data: "unable to connect to db contact db admin"
                    });
                }
            });
        });
        next();
    });
    
    server.listen(port, (err)=>{
        if(err){
            console.error("Failed to start server".warn);
        }
        console.info("server listening on port "+ port);
    });
}

// rest get method
// @arg db object
// @arg collection string
// @arg query object
// @arg callback function
function restGet(db, collection, query, callback){
    db.collection(collection).find(query).toArray((err, data)=>{
        callback(err, data);
    })
}

// rest post method, replace data
// @arg db object db instance
// @arg collection string
// @arg data object
// @arg function
function restPost(db, collection, data, callback){
    db.collection(collection).insertOne(data, (err, result)=>{
        callback(err, result);
    });

}

// rest put method, push data to stack
// @arg db object db instance
// @arg collection string
// @arg filter object
// @arg data object
// @arg callback function
function restPut(db, collection, filter, data, callback){
    db.collection(collection).updateMany(filter, {$set:data}, (err, result)=>{
        callback(err, result);
    });
}

// rest delete method
// @arg db object db instance
// @arg collection string
// @arg filter object
// @arg callback function
function restDelete(db, collection, filter, callback){
    db.collection(collection).deleteMany(filter, (err, result)=>{
        callback(err, result);
    });
}

// @arg error object
// @arg response object
// @arg data object
function responseHandler(error, response, data){
    if (error) {
        // error handler for data retrieval
        response.send({
            error: true,
            data: data
        });
    } else {
        // send back data
        response.send({
            error: false,
            data: data
        });
    }
}

function authenticator(config, request, callback){
    if(config.auth){
        for(var i=0;i<config.user.length; i++){
            if(config.user[i].key == request.query.key){
                callback(null, config.user[i].name);
            }
        }
    } else {
        callback(null, "");
    }
}