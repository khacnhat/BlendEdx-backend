/**
 * Created by macmini on 5/5/15.
 */
var express     = require('express');
var router      = express.Router();
var Group       = require('../models/group');
var Announcement       = require('../models/announcement');
var HttpStatus = require('http-status-codes');

// create group
router.post('/', function(req, res){
  if(req.user.role === 'teacher'){
    var name = req.body.name;
    Group.findByName(name, function(err, group){
      if(group === null){
        var group = new Group();
        group.name = name;
        group.description = req.body.description;
        group.subject = req.body.subject;
        group.teachers = [req.user._id];
        group.students = [];
        group.created = new Date();
        group.updated = new Date();
        group.save(function(err){
          if(err){
            res.send(err);
          }else{
            res.json(group);
          }
        });
      }else{
        res.status(HttpStatus.CONFLICT).json({message: 'Group existed'});
      }
    });
  }else{
    res.status(HttpStatus.METHOD_NOT_ALLOWED).json({message: 'User is not allowed to create group'});
  }
});

// get all groups  based on query
router.get('/', function(req, res){
  var query = req.query.name;
  Group.getByUserId(req.user._id, query, function(err, groups){
    if(!err){
      res.json(groups);
    }else{
      res.send(err);
    }
  });
});

// get a group
router.get('/:id', function(req, res){
  Group.findById(req.params.id, function(err, group){
    if(group !== null){
      res.json(group);
    }else{
      res.status(404).json({message: 'Group not found'});
    }
  });
});

// get a announcement list
router.get('/:id/announcements', function(req, res){
  var offset = req.query.offset? req.query.offset : 0;
  var limit = req.query.limit? req.query.limit : 10;
  Announcement.findByGroup(req.params.id, offset, limit, function(err, announcements){
    if(err){
      res.send(err);
    }else{
      console.log('Announcements: ', announcements);
      res.json(announcements);
    }
  });
});

module.exports = router;
