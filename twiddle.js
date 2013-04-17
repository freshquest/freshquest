var mongo = require("mongodb"),
    BSON = mongo.BSONPure;

module.exports = function (app, db) {

    var hexTest = new RegExp("^[0-9a-fA-F]{24}$");

    function makeError(status,message) {
        var error = new Error(message);
        error.status = status;
        return error;
    }

    // Callback signature should be function (err, docs) or (err, doc)
    function find(collection, query, many, callback) {
        if (many)        
            db.collection(collection).find(query).toArray(callback);
        else
            db.collection(collection).findOne(query, callback);
    }

    // GET /api/farm_plus/5169e40b9f9477588676e816
    // GET /api/farm_plus/wake_robin_farm
    app.get('/api/farm_plus/:id', function (req, res, next) {

        var id = req.params.id;
        var query = {};
        if(hexTest.test(id))
            query._id = BSON.ObjectID(id);
        else
            query.slug = id;

        find('farm', query, false, function(err, farmdoc) {
            if (!farmdoc) {
                next(makeError(404,'Object not found'));
                return;
            }
            // Splice current booth onto farmer object
            find('market_day_booth', { farmerId : farmdoc._id }, false, function(err, boothdoc) {
                farmdoc.marketDayBooth = boothdoc;
                res.json(farmdoc);
            });
        });
    });

    // GET /api/farm~/5169e40b9f9477588676e816
    // GET /api/farm~/wake_robin_farm
    app.get('/api/farm~/:id', function (req, res, next) {

        var id = req.params.id;
        var query = {};
        if(hexTest.test(id))
            query._id = BSON.ObjectID(id);
        else
            query.slug = id;

        find('farm', query, false, function(err, farmdoc) {
            if (!farmdoc) {
                next(makeError(404,'Object not found'));
                return;
            }
            // Splice current booth onto farmer object
            find('market_day_booth', { farmerId : farmdoc._id }, false, function(err, boothdoc) {
                farmdoc.marketDayBooth = boothdoc;
                res.json(farmdoc);
            });
        });
    });

    // GET /api/farm~
    app.get('/api/farm~', function (req, res, next) {
        var query = {};
        find('farm', query, true, function(err, farmdocs) {
            if (!farmdocs) {
                next(makeError(404,'No farms found'));
                return;
            }
            // Splice booths onto farmer objects
            var query2 = {};
            // FIXME filter on the current market day
            find('market_day_booth', query2, true, function(err, boothdocs) {
                if (boothdocs) boothdocs.forEach(function(booth) {
                    farmdocs.some(function(farm) {
                        if (!farm._id.equals(booth.farmerId)) {
                            farm.marketDayBooth = booth;
                            return true;
                        } else {
                            return false; // like continue;
                        }
                    });
                });
                res.json(farmdocs);
            });
        });
    });

}