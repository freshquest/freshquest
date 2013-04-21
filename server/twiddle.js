var mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    async = require("async");

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

    // GET /api/~farm/5169e40b9f9477588676e816
    // GET /api/~farm/wake_robin_farm
    app.get('/api/~farm/:id', function (req, res, next) {

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

    // GET /api/~farm
    app.get('/api/~farm', function (req, res, next) {
        var query = {};
        find('farm', query, true, function(err, farmdocs) {
            if (!farmdocs) {
                next(makeError(404,'No farms found'));
                return;
            }
            // Join booths. Fetch them all at once and then splice them onto
            // farmer objets
            var query2 = {}; // FIXME filter on the current market day
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

    // GET /api/~user/me
    app.get('/api/~user/me', function (req, res, next) {
        var query = { _id: BSON.ObjectID('5169ec8c5f8edf2493aef86d') }; // FIXME pull this from the session
        find('user', query, false, function(err, userdoc) {
            if (!userdoc) {
                next(makeError(404,'User not found'));
                return;
            }
            res.json(userdoc);
        });
    });

    // GET /api/~user_shopping_list/me
    app.get('/api/~user_shopping_list/me', function (req, res, next) {
        var query = { _id: BSON.ObjectID('5169ec8c5f8edf2493aef86d') }; // FIXME pull this from the session
        find('user', query, false, function(err, userdoc) {
            var shoppingList = userdoc.shoppingList;
            if (!shoppingList) shoppingList = {};
            async.each(shoppingList, function(listBooth, callback) {
                var query2 = { _id: listBooth.id };
                find('market_day_booth', query2, false, function(err, boothdoc) {
                    if (boothdoc) {
                        listBooth.shed = boothdoc.shed;
                        listBooth.stall = boothdoc.stall;
                    }
                    var query3 = { _id: boothdoc.farmerId };
                    find('farm', query3, false, function(err, farmdoc) {
                        listBooth.farm = farmdoc;
                        callback(null);
                    });
                });
            }, function(err) {
                res.json(userdoc.shoppingList);
            });
        });
    });

    // GET /api/~product/Apples
    app.get('/api/~product/:item', function (req, res, next) {
        var item = req.params.item;
        var query = { "sellSheet.item" : item } // FIXME filter on the current market day
        find('market_day_booth', query, true, function(err, boothdocs) {
            if (!boothdocs) boothdocs = {};
            async.each(boothdocs, function(booth, callback) {
                var query2 = { _id: booth.farmerId };
                find('farm', query2, false, function(err, farmdoc) {
                    booth.farm = farmdoc;
                    callback(null);
                });
            }, function(err) {
                res.json({
                    item: item,
                    booths: boothdocs
                });
            });
        });
    });

}