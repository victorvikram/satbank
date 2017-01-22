//app.js
//Main process

//Requirements
var express = require('express');
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var multer  = require('multer');
const assert = require('assert');

//Mongo setup
var mongo_url = 'mongodb://localhost:27017/satbank';

var MongoAPI = {
    noInit: function() {
        throw "No database connection!";
    }
}
MongoAPI.insertQuestion = MongoAPI.noInit;
MongoAPI.findQuestions = MongoAPI.noInit;
MongoAPI.getQuestion = MongoAPI.noInit;

mongo.connect(mongo_url, function(err, db) {
    assert(db, "Cannot connect to database!");
    console.log("Connected successfully to server");
    var questions = db.collection('questions');

    MongoAPI.insertQuestion = function(postData) {
      var Qs = {
          tag: postData.body.tag,
          file: postData.file
      };
      //console.log(Qs);
      questions.insert(Qs);
      //console.log("Inserted");
    }
    MongoAPI.findQuestions = function(searchTag, callback) {
        questions.find({
            tag: searchTag
        }).project(        
        {
            _id: 1
        }).toArray(function(err, documents) {
            callback(documents);
        });
    }
    MongoAPI.getQuestion = function(qid, callback) {
        questions.find({
            _id: ObjectID(qid)
        }).toArray(function(err, documents){
            if(documents.length != 1)
                throw "Question not found";
            console.log(documents[0]);
            callback(documents[0]);
        });
    }
});

//Express setup
var app = express();
var port = process.env.PORT || 6969;
var router = express.Router();
var upload = multer({ dest: 'uploads/' });

function SUCCESS(data) {
    return {
	    status: "success",
	    message: "Generic success",
        data: data
    };
}

function ERROR(msg) {
	return {
        status: "error",
	    message: "Generic error"
    };
}

app.get('/', function(req, res) {
    res.send("hello world!");
});

router.use(function(req, res, next) {
	try {
		next();
	} catch(e) {
		res.send(ERROR(e.message));
	}
});

router.route('/question')

    .post(upload.single('qdata'), function(req, res) {
        MongoAPI.insertQuestion(req);
        res.send(SUCCESS());
    });

router.route('/questions')

    .get(function(req, res) {
        var searchTag = req.query.searchTag;
        if(searchTag == null)
            throw "Invalid search data"
        MongoAPI.findQuestions(searchTag, function(documents) {
            console.log(documents);
            res.send(SUCCESS(documents));
        });
    });

router.route('/question/:qid')

    .get(function(req, res) {
        console.log(req.params.qid);
        MongoAPI.getQuestion(req.params.qid, function(question){
            var options = {
                root: __dirname,
                headers: {
                    'Content-Type': question.file.mimetype
                }
            };
            var npath = question.file.path;
            res.sendFile(npath, options);
        });
    });

app.use('/api', router);
app.listen(port);
