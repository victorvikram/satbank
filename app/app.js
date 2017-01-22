//app.js
//Main process

//Requirements
var express = require('express');
var mongo = require('mongodb').MongoClient;


//Mongo setup
var mongo_url = 'mongodb://localhost:27017/satbank';
var insert = function(db) {
    var questions = db.collection('questions')
    q = {name: "asdfasdf"};
    questions.insert(q);
    console.log("Inserted");
}

mongo.connect(mongo_url, function(err, db) {
    console.log(err);
    console.log("Connected successfully to server");
    //insert(db);
});

//Express setup
var app = express();
var port = process.env.PORT || 6969;
var router = express.Router();

app.get('/', function(req, res) {
    res.send("hello world!");
});

app.use('/', router);
app.listen(port);
