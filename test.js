/**
 * Created by jiahao on 6/28/2016.
 */
'use strict';

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://192.168.99.100';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected succesfully to server");
    
    var collection = db.collection("user");

    collection.updateMany({username:"test2"}, {$set:{username:"test3"}},(error, data)=>{
        if(error) console.log(error);
        console.log(data.result);
        db.close();
    });
});