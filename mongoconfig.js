var haversine = require('./modules/haversine_v1');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Use connect method to connect to the Server
var db1 ;
MongoClient.connect(process.env.MONGOLAB_URI+"?authMode=scram-sha1", function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db1=db;
  db.close();
});

exports.eventlist = function(lon,lat,callback) {
  console.log("I am here 1"+lon+"-------"+lat);

  db1.open(function(err, db) {
    if (!err) {
      console.log(new Date());
      db.collection('events', function(err, collection) {
        if (!err) {
          collection.find(
            {
               $and : [
                    {location:{
                    	$near: [lon, lat],
                      $maxDistance: 1
                  }},
                  {
                    $or : [
                    {
                    "date.from":{
                        $gte: "2017-03-21T20:05:21.641Z"
                      }
                    },
                    {
                    "date.to":{
                        $lte: "2017-03-27T20:05:21.641Z"
                      }
                    }
                  ]
                }
              ]
            }
          ).toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
                console.log("I am here 2:"+intCount);
              if (intCount > 0) {
                var strJson = "";
                for (var i = 0; i < intCount;) {

                  var eventLon=docs[i].location[0];
                  var eventLat=docs[i].location[1];
                  var distance = haversine.getDistanceInMiles({'latitude':lat,'longitude':lon},{'latitude':eventLat,'longitude':eventLon})
                  strJson += '{"EventName":"' + docs[i].name + '","distance":"' +distance+ '","sentiment":"' + docs[i].social.twitter.sentiments + '","count":"' + docs[i].social.twitter.count + '"}';
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
                strJson = '{"count":' + intCount + ',"events":[' + strJson + "]}";

                callback("", JSON.parse(strJson));
              }else{
                callback("", "{}");
              }
            } else {
              console.log("I am here 3");
              console.log("Err" + err);
              onErr(err, callback);
            }
          }); //end collection.find
        } else {
            console.log(err);
          onErr(err, callback);
        }
      }); //end db.collection
    } else {
      onErr(err, callback);
    }
  }); // end db.open
};

exports.getEventHandlers = function(callback) {
  MongoClient.connect(process.env.MONGOLAB_URI+"?authMode=scram-sha1", function(err, db) {

    if (!err) {
      db.collection('events', function(err, collection) {
        if (!err) {
          collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              //console.log("I am here 2:"+intCount);
              if (intCount > 0) {
                var strJson = "";
                for (var i = 0; i < intCount;) {
                  strJson += docs[i].social.twitter.identifier;//'{"EventName":"' + docs[i].name + '","lon":"' + docs[i].location[0] + '","lat":"' + docs[i].location[1] + '"}';
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
                console.log('Event Handles: ' + strJson);
                callback(strJson);
              }else{
                callback('');
              }
            } else {
              //console.log("I am here 3");
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

exports.updateSentiments = function(eventHandler,sentiment,callback) {
  console.log("I am here 1");
  MongoClient.connect(process.env.MONGOLAB_URI+"?authMode=scram-sha1", function(err, db) {
    if (!err) {
      db.collection('events', function(err, collection) {
        if (!err) {

          collection.find(
            {
              social: {
                	twitter:{
                    identifier: eventHandler

              }
            }
          }).toArray(function(err, docs) {
            if (!err) {
                db.close();
                var intCount = docs.length;
                  console.log("I am here 2:"+intCount);
                if (intCount > 0) {
                  //var strJson = "";
                  //for (var i = 0; i < intCount;) {
                    var currentCount = docs[0].social.twitter.count;
                    var currentSentiment = docs[0].social.twitter.sentiments;
                    var newCount= Number(currentCount)+1;
                    var newSentiment = Number(currentSentiment)+sentiment;
                      collection.update(
                        {
                          "social.twitter.identifier": eventHandler

                        },
                        {
                          social: {
                          	twitter:{
                              count: newCount
                            }
                          },
                          social: {
                          	twitter:{
                              sentiments: newSentiment
                            }
                          }
                        });
                }
              }else {
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
