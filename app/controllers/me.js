/**
 * Created by nhatnk on 5/31/15.
 */

var express     = require('express');
var app         = express();
var router      = express.Router();
var User        = require('../models/user');
var Announcement       = require('../models/announcement');


/**
 * Get the list of announcements of the user
 */
router.get('/announcements', function(req, res){
  var offset = req.query.offset? req.query.offset : 0;
  var limit = req.query.limit? req.query.limit : 10;
  User.getAnnouncements(req.user._id, offset, limit, function(err, announcements){
    if(err){
      res.send(err);
    }else{
      res.json(announcements);
    }
  });
});

module.exports = router;