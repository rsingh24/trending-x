var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Use connect method to connect to the Server
var db1 ;
MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db1=db;
  db.close();
});

exports.eventlist = function(lon,lat,callback) {
  console.log("I am here 1"+lon+"-------"+lat);
  db1.open(function(err, db) {
    if (!err) {
      db.collection('events', function(err, collection) {
        if (!err) {
          collection.find(
            {
              "location": {
                	$near: [lon, lat],
                  $maxDistance: 1
              }
            }
          ).toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
                console.log("I am here 2:"+intCount);
              if (intCount > 0) {
                var strJson = "";
                for (var i = 0; i < intCount;) {
                  strJson += '{"EventName":"' + docs[i].name + '","lon":"' + docs[i].location[0] + '","lat":"' + docs[i].location[1] + '"}';
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
                strJson = '{"count":' + intCount + ',"events":[' + strJson + "]}";
                console.log("Here1:"+strJson);
                callback("", JSON.parse(strJson));
              }
            } else {
              console.log("I am here 3");
              console.log(err);
              onErr(err, callback);
            }
          }); //end collection.find
        } else {
          onErr(err, callback);
        }
      }); //end db.collection
    } else {
      onErr(err, callback);
    }
  }); // end db.open
};

exports.getEventHandlers = function(lon,lat,callback) {
  console.log("I am here 1");
  db1.open(function(err, db) {
    if (!err) {
      db.collection('events', function(err, collection) {
        if (!err) {
          collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
                console.log("I am here 2:"+intCount);
              if (intCount > 0) {
                var strJson = "";
                for (var i = 0; i < intCount;) {
                  strJson += '{"EventName":"' + docs[i].name + '","lon":"' + docs[i].location[0] + '","lat":"' + docs[i].location[1] + '"}';
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
                strJson = '{"count":' + intCount + ',"events":[' + strJson + "]}";
                console.log("HEre1:"+strJson);
                callback("", JSON.parse(strJson));
              }
            } else {
              console.log("I am here 3");
              onErr(err, callback);
            }
          }); //end collection.find
        } else {
          onErr(err, callback);
        }
      }); //end db.collection
    } else {
      onErr(err, callback);
    }
  }); // end db.open
};
