var express = require('express');
var router = express.Router();
var mongo_data = require('../mongoconfig');


/* GET home page. */
router.get('/', function(req, res, next) {
  var query = require('url').parse(req.url,true).query;
  console.log("I am here 1:"+query.lon);
  console.log("I am here 1:"+query.lat);
  mongo_data.eventlist(query.lon,query.lat,function(err, eventlist){
    if (!err) {
      /*var strTeam = "",
        i = 0;
      for (i = 0; i < eventlist.count;) {
        strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
        i = i + 1;
      }
      strTeam = "<ul>" + strTeam + "</ul>";*/
      //res.render('index', { title: 'Express',events: eventlist });
      res.json(eventlist);
    //  res.write(template.build("Test web page on node.js", "Hello there", "<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
     res.end();
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
