'use strict';

// dependency declaration
var mongo = require('mongodb'),
    assert = require('assert'),
    restify = require('restify'),
    colors = require('colors'),
    fs = require('fs'),
    path = require('path');

// constant variable
const url = 'mongodb://localhost:27017/myproject', name="testServer";

// instance variable
var server, mongoClient;

colors.setTheme({
    error: 'red',
    warn: 'yellow',
    info: 'grey'
});

run();

// setup function
// @arg next function next function to run
function setup(next){
    var certificate, key;
    // read ssl
    try{
        // read ssl certificate
        certificate = fs.readFileSync(path.join(__dirname + "ssl/certificate"));
        key = fs.readFileSync(path.join(__dirname + "ssl/key"));
    }catch(err){
        certificate = "";
        key = "";
        console.warn("certificate and/or key not found in ssl folder".warn);
    }
    
    // create Restify server instance
    server = certificate == "" && key == "" ? restify.createServer({}) : restify.createServer({
        certificate: certificate,
        key: key,
        name: name
    });
    
    // create mongo client instance
    mongoClient = mongo.MongoClient;
}

function run(){

    // get db instance
    var db = connectDb(url);


    //TODO: close db connection
}

// connect to database
// @arg url string url of mongo database
// @return object database instance
function connectDb(url){
    mongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.info("Connected succesfully to database");
        return db;
    });
    throw new Error("Unable to connect to database, check url");
}
