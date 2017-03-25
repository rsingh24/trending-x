var express = require('express');
var router = express.Router();
var mongo_data = require('./mongoconfig');


/* GET home page. */
router.get('/', function(req, res, next) {
  mongo_data.eventlist(-0.462224,51.506479,function(err, eventlist){
    if (!err) {
      /*var strTeam = "",
        i = 0;
      for (i = 0; i < eventlist.count;) {
        strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
        i = i + 1;
      }
      strTeam = "<ul>" + strTeam + "</ul>";*/
      res.render('index', { title: 'Express',events: eventlist });
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
