var express = require('express');
var router = express.Router();
var mongo_data = require('../mongoconfig');


/* GET home page. */
router.get('/', function(req, res, next) {
  var query = require('url').parse(req.url,true).query;
  console.log("I am here 1:"+query.lon);
  console.log("I am here 1:"+query.lat);
  mongo_data.eventlist(Number(query.lon),Number(query.lat),Number(query.radius),function(err, eventlist){
    if (!err) {
      /*var strTeam = "",
        i = 0;
      for (i = 0; i < eventlist.count;) {
        strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
        i = i + 1;
      }
      strTeam = "<ul>" + strTeam + "</ul>";*/
      //res.render('index', { title: 'Express',events: eventlist });
      sortEvents(eventlist, 'ayushj151', function (sortedList) {

          res.json(sortedList);
        //  res.write(template.build("Test web page on node.js", "Hello there", "<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
         res.end();
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(template.build("Oh dear", "Database error", "<p>Error details: " + err + "</p>"));
      res.end();
    }
  });
});

module.exports = router;

var sortEvents = function(eventList, userId, callback) {
    mongo_data.getUserPreference(userId, function(primaryIntrests) {
        if(undefined !== eventList && null !== eventList && undefined !== eventList.events && null !== eventList.events) {
            eventList.events.sort(function (first, second) {
                var firstInterest = false;
                var secondInterest = false;
                var result = 0;
                if(null !== primaryIntrests && '' !== primaryIntrests) {
                    if(undefined !== first.category && null !== first.category && '' !== first.category) {
                        firstInterest = primaryIntrests.includes(first.category);
                    }
                    if(undefined !== second.category && null !== second.category && '' !== first.category) {
                        secondInterest = primaryIntrests.includes(second.category);
                    }
                }

                console.log('Event name1: ' + first.EventName + ' Interest: ' + firstInterest + ' Event name2: ' + second.EventName + ' Interest: ' + secondInterest);

                if(firstInterest && !secondInterest) {
                    result = -1;
                } else if(!firstInterest && secondInterest) {
                    result = 1;
                } else {
                    result = second.count - first.count;
                }
                return result;
            });
        }
        callback(eventList);
    });
};
