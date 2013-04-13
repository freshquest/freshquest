//create REST layer in front of mongo database
//hook stuff up to 

//TODO: later, add auth, etc.

var express = require("express");
var app = express();
app.use(express.logger());

app.use(express['static'](__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 

mongo.Db.connect(mongoUri, function (err, db) {
  console.log('connected to mongodb');
  //db.collection('mydocs', function(er, collection) {
  //  collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
  //  });
  //});
});

