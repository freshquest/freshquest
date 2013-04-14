//create REST layer in front of mongo database
//hook stuff up to 

//TODO: later, add auth, etc.

var development = !process.env.NODE_ENV;

var express = require("express"),
    rest = require('./rest'),
    api = require('./api');


var app = express();
app.use(express.bodyParser());
app.use(express.logger());

app.use(express['static'](__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

var mongo = require('mongodb');

if (!process.env.NODE_ENV)
	var mongoUri = 'mongodb://localhost/freshquest?w=1'
else
	var mongoUri = 'mongodb://heroku:mintyfresh@alex.mongohq.com:10063/app14931700';
    //process.env.MONGOLAB_URI || 
    //process.env.MONGOHQ_URL || 
    
//TODO: autoreconnect



var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(mongoUri, function(err, db) {
    console.log('connected to mongodb');
    api(app,db);
    rest(app,db);
});
