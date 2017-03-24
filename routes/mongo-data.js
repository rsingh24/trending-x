var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;
var server = new Server('ds135830.mlab.com', 35830, {
  auto_reconnect: true
});
var db = new Db('heroku_hml06j14', server);
var onErr = function(err, callback) {
  db.close();
  callback(err);
};
exports.eventlist = function(lon,lat,callback) {
  db.open(function(err, db) {
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
                strJson = '{"count":' + intCount + ',"events":[' + strJson + "]}"
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
