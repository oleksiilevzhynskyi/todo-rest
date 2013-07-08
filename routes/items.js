var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("todo_db");
    db.collection('items', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

 
exports.findById = function(req, res) {
    console.log(req.params);
    var id = req.params.id;
    console.log('findById: ' + id);
    db.collection('items', function(err, collection) {
        collection.findOne({_id: new ObjectID(id)}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('items', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.jsonp(items);
        });
    });
};


exports.create = function(req, res) {
    var item = {
        text: req.param('text'),
        done: req.param('done') === "true"
    };
    console.log('create: ' + item);
    db.collection('items', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            console.log("created: ", result)
            res.jsonp(item);
        });
    });
}

exports.update = function (req, res) {
    var id = req.params.id;
    console.log('update: ', id);
    db.collection('items', function(err, collection) {
        collection.update({_id: new ObjectID(id)}, {$set: {text: req.param('text'), done: req.param('done') === "true"}}, {safe:true}, function(err, result) {
            console.log("updated: ", result)
            res.jsonp(result);
        });
    });
}

exports.destroy = function (req, res) {
    var id = req.params.id;
    console.log('delete: ', id);
    db.collection('items', function(err, collection) {
        collection.findAndModify({_id: new ObjectID(id)}, [], {}, {remove: true}, function(err, object) {
            console.log("deleted: ", err, object);
            if (err || !object) {
                res.jsonp({deleted: false});    
            } else {
                res.jsonp({deleted: true})
            }
            
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    console.log("Populating employee database...");
    var items = [
        {"id": 1, done: false, text: "test items"}
    ];
 
    db.collection('items', function(err, collection) {
        collection.insert(items, {safe:true}, function(err, result) {});
    });
 
};