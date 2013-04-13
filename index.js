//create REST layer in front of mongo database
//hook stuff up to 

//TODO: later, add auth, etc.

var express = require("express"),
    rest = require('./rest');


var app = express();
app.use(express.bodyParser());
app.use(express.logger());

app.use(express['static'](__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
    process.env.MONGOHQ_URL || 
    'mongodb://heroku:mintyfresh@alex.mongohq.com:10063/app14931700';

//TODO: autoreconnect

mongo.Db.connect(mongoUri, function (err, db) {
    console.log('connected to mongodb');
    rest(app,db);
});
