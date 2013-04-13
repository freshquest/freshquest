var mongo = require("mongodb"),
    BSON = mongo.BSONPure;
 
module.exports = function setupRest(app, db) {

    function sendError(status,message,res){
        res.header('Content-Type', 'application/json');
        res.send({error : message},status); 
    }
 
    /**
     * Query
     */
    app.get('/api/:collection/:id?', function (req, res) {
        
        var query = {};
 
        // Providing an id overwrites giving a query in the URL
        if (req.params.id) query._id = new BSON.ObjectID(req.params.id);

        var options = req.params.options || {};
 
        var test = ['limit', 'sort', 'fields', 'skip', 'hint', 'explain', 'snapshot', 'timeout'];
 
        for (var k in req.query) {
            if (test.indexOf(k) > -1) {
                options[k] = req.query[k];
            }else{
                query[k] = req.query[k];
            }
        }

        console.log('query',query);
        console.log('options',options);
 
        db.collection(req.params.collection, function (err, collection) {

            if(!collection) return res.send("Unable to find collection",400,res);
            if(err) return sendError(err.message,500,res);

            collection.find(query, options, function (err, cursor) {

                if(!cursor) return res.send("Unable to execute query",400,res);
                if(err) return sendError(err.message,500,res);
 
                cursor.toArray(function (err, docs) {

                    if(!docs) return sendError('Unable to convert database cursor to array',500,res);
                    if(err) return sendError(err.message,500,res);

                    var result = [];
                    if (req.params.id) {
                        if (docs.length > 0) {
                            res.header('Content-Type', 'application/json');
                            res.send(docs[0]);
                        } else {
                            res.send(404);
                        }
                    } else {
                        docs.forEach(function (doc) {
                            result.push(doc);
                        });
                        res.header('Content-Type', 'application/json');
                        res.send(result);
                    }
                });
            });
        });
    });
 
    /**
     * Insert
     */
    app.post('/api/:collection', function (req, res) {
        if (!req.body) return sendError('You must specify a collection to insert',400,res);

        db.collection(req.params.collection, function (err, collection) {

            if(!collection) return res.send("Unable to find collection",400,res);
            if(err) return sendError(err.message,500,res);

            // We only support inserting one document at a time
            collection.insert(Array.isArray(req.body) ? req.body[0] : req.body, function (err, docs) {

                if(!docs) return res.send("Unable to insert document into collection",400,res);
                if(err) return sendError(err.message,500,res);

                res.header('Location', '/' + req.params.db + '/' + req.params.collection + '/' + docs[0]._id.toHexString());
                res.header('Content-Type', 'application/json');
                res.send(docs, 201);
            });
        });
    });
 
    /**
     * Update
     */
    app.put('/api/:collection/:id', function (req, res) {
        var spec = {
            '_id': new BSON.ObjectID(req.params.id)
        };
 
        db.collection(req.params.collection, function (err, collection) {

            if(!collection) return res.send("Unable to find collection",400,res);
            if(err) return sendError(err.message,500,res);

            collection.update(spec, req.body, true, function (err, docs) {

                if(!docs) return res.send("Unable to update document",400,res);
                if(err) return sendError(err.message,500,res);

                res.header('Content-Type', 'application/json');
                res.send(docs);
            });
        });
    });
 
    /**
     * Delete
     */
    app.del('/api/:collection/:id', function (req, res) {
        var spec = {
            '_id': new BSON.ObjectID(req.params.id)
        };
 
        db.collection(req.params.collection, function (err, collection) {

            if(!collection) return res.send("Unable to find collection",400,res);
            if(err) return sendError(err.message,500,res);

            collection.remove(spec, function (err, docs) {

                if(err) return sendError(err.message,500,res);

                res.header('Content-Type', 'application/json');
                res.send(spec);
            });
        });
    });
};
