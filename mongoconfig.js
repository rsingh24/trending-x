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
  console.log("I am here 1");
  db.open(function(err, db1) {
    if (!err) {
      db.collection('events', function(err, collection) {
        if (!err) {
          collection.find(
            {
              loc: {
                	$near: {
                		$geometry: {
                			type: 'Point',
                			coordinates: [lon, lat],
                			$maxDistance: 2000
                		}
                	}
                }
            }
          ).toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              if (intCount > 0) {
                var strJson = "";
                for (var i = 0; i < intCount;) {
                  strJson += '{"EventName":"' + docs[i].name + '","lon":"' + docs[i].loc.coordinates[0] + '","lat":"' + docs[i].loc.coordinates[1] + '"}'
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
