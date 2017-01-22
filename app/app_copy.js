//app.js
//Main process

//Requirements
var express = require('express');
var mongo = require('mongodb').MongoClient;
var tags = require('./data/tags.json');


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

app.set('appData', tags);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(require('./routes/index'));

app.get('/', function(req, res) {
    res.send("bye world!");
});

app.use('/', router);
app.listen(port);
