/**
 * Created by macmini on 5/5/15.
 */
var express     = require('express');
var router      = express.Router();
var Announcement       = require('../models/announcement');
var HttpStatus = require('http-status-codes');

router.post('/', function(req, res){
  var ann = new Announcement();
  ann.text = req.body.text;
  ann.groups = req.body.groups;
  ann.attachments = [];
  ann.comments = [];
  ann.created = new Date();
  ann.updated = new Date();
  ann.author = {_id: req.user._id, name: req.user.name, avatar: req.user.avatar};
  ann.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.status(201).json(ann);
    }
  });
});

// create a comment
router.post('/:id/comments', function(req, res){
  var announcementId = req.params.id;
  Announcement.findById(announcementId, function(err, ann){
    if(ann != null){
      var comment = {
        text: req.body.text,
        author: {_id: req.user._id, name: req.user.name, avatar: req.user.avatar},
        created: new Date(),
        updated: new Date()
      }
      ann.comments.push(comment);
      ann.save(function(err){
        if(err){
          res.status(500).json({message: 'Internal server error'});
        }else{
          res.json(comment);
        }
      });
    }else{
      res.status(404).json({message: 'Announcement not found'});
    }
  });


});

module.exports = router;
