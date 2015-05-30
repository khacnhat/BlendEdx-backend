/**
 * Created by macmini on 5/5/15.
 */
var express     = require('express');
var router      = express.Router();
var Announcement       = require('../models/announcement');
var Group       = require('../models/group');
var HttpStatus = require('http-status-codes');

// create an announcement
router.post('/', function(req, res){
  var ann = new Announcement();
  ann.text = req.body.text;
  ann.groups = req.body.groups;
  ann.attachments = req.body.attachments;
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



// delete an announcement
router.delete('/:id', function(req, res){
  if(req.user.role === 'teacher'){
    //Teacher can delete any announcement in his groups
    var announcementId = req.params.id;
    Announcement.findById(announcementId, function(err, ann){
      if(ann != null){
        var groupIds = ann.groups.map(function(g){
          return g._id
        });
        Group.find({_id: { $in: groupIds}, teachers: req.user._id}, function(err, groups){
          if(groups.length > 0){
            ann.remove(function(err){
              if(!err) {
                res.json({_id: announcementId});
              }else{
                res.status(500).json({message: 'Internal Server Error'});
              }
            });
          }else{
            res.status(404).json({message: 'Announcement not found'});
          }
        });
      }else{
        res.status(404).json({message: 'Announcement not found'});
      }
    });
  }else{
    //User can delete his announcement
    var announcementId = req.params.id;
    Announcement.remove({_id: announcementId, 'author._id': req.user._id}, function(err){
      if(!err){
        res.json({_id: announcementId});
      }else{
        res.status(404).json({message: 'Announcement not found'});
      }
    });
  }

});

module.exports = router;
