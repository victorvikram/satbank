//app.js
//Main process

//Requirements
var express = require('express');
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var multer  = require('multer');
const assert = require('assert');
var util = require('util');
var tags = require('./data/tags.json');
var crypto = require('crypto');
var mime = require('mime');
var generateDoc = require('./generateDoc');

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
      questions.insert(Qs);
    }
    MongoAPI.findQuestions = function(tags, callback) {
        searchObj = [];

        for(var key in tags) {
            searchObj.push({tag: key});
        }

        questions.find({
            $or: searchObj
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

//Multer storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });

app.set('appData', tags);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(require('./routes/index'));

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
        var tags = req.query;
        MongoAPI.findQuestions(tags, function(documents) {
            res.send(SUCCESS(documents));
        });
    });

router.route('/question/:qid')

    .get(function(req, res) {
        console.log(req.params.qid);
        MongoAPI.getQuestion(req.params.qid, function(question){
            var options = {
                headers: {
                    'Content-Type': question.file.mimetype
                }
            };
            var npath = question.file.path;
            res.sendFile(/*__dirname + */"/" + npath, options); // Note: commented this line
        });
    });

router.route('/generate')

    .get(function(req, res) {
        var paths = [];
        var done = false;

        for(var keys in req.query) {
            MongoAPI.getQuestion(keys, function(question) {
                var fname = question.file.filename;
                paths.push(fname);

                if(!done) return;
                generateDoc.generate(paths, function(npath) {
                        var options = {
                        headers: {
                            'Content-Type': 'application/pdf'
                        }
                    };
                    res.sendFile(npath, options)
                });

            });
        }
        done = true;
    });

app.use('/api', router);
app.listen(port);
