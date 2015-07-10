/**
 * Created by macmini on 5/5/15.
 */
var express     = require('express');
var router      = express.Router();
var Group       = require('../models/group');
var Announcement       = require('../models/announcement');
var User        = require('../models/user');
var HttpStatus = require('http-status-codes');
var randomstring = require("randomstring");

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
        group.code = randomstring.generate(7);
        group.open = true;
        group.save(function(err){
          if(err){
            res.status(HttpStatus.BAD_REQUEST).json({message: err});
          }else{
            User.addGroup(req.user._id, group._id, function(){
              res.json(group);
            });
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
  if(req.user.role === 'teacher') {
    Group.getByUserId(req.user._id, query, function (err, groups) {
      if (!err) {
        res.json(groups);
      } else {
        res.send(err);
      }
    });
  }else{
    Group.getByStudentId(req.user._id, query, function(err, groups){
      if(!err){
        res.json(groups);
      }else{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'List group was not successfully'});
      }
    });
  }
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
  var groupId = req.params.id;
  Announcement.findByGroup(groupId, offset, limit, function(err, announcements){
    if(err){
      res.send(err);
    }else{
      res.json(announcements);
    }
  });
});

/**
 * Reset code
 */
router.put('/:id/code', function(req, res){
  Group.findById(req.params.id, function(err, group){
    if(group){
      if(req.user.role === 'teacher' && group.teachers.indexOf(req.user._id) > -1) {
        group.code = randomstring.generate(7);
        group.save(function (err) {
          if (!err) {
            res.json({code: group.code});
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
          }
        });
      }else{
        res.status(HttpStatus.FORBIDDEN).json({message: 'Not allowed to reset group code'});
      }
    }else{
      res.status(HttpStatus.NOT_FOUND).json({message: 'Group not found'});
    }
  });
});

/**
 * Switch open status
 */
router.put('/:id/open', function(req, res){
  Group.findById(req.params.id, function(err, group){
    if(group){
      if(group.hasTeacher(req.user._id)) {
        group.open = req.query.open;
        if(group.open && !group.code){
          group.code = randomstring.generate(7);
        }
        group.save(function (err) {
          if (!err) {
            res.json({open: group.open, code: group.code});
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
          }
        });
      }else{
        res.status(HttpStatus.FORBIDDEN).json({message: 'Not allowed to switch open status'});
      }
    }else{
      res.status(HttpStatus.NOT_FOUND).json({message: 'Group not found'});
    }
  });
});

/**
 * Student join to group
 */
router.post('/join', function(req, res){
  Group.findByCode(req.body.code, function(err, group){
    if(group){
      if(req.user.role === 'student'){
        if(group.open) {
          if (!group.hasStudent(req.user._id)) {
            group.students.push(req.user._id);
            group.save(function (err) {
              if (!err) {
                User.findById(req.user._id, function(err, user){
                  if(user){
                    user.groups.push(group._id);
                    user.save(function(err){
                      if(!err){
                        res.json({groupId: group._id});
                      } else{
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal error'});
                      }
                    });
                  }else{
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal error'});
                  }
                });
              }else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal error'});
              }
            });
          } else {
            res.status(HttpStatus.CONFLICT).json({message: 'User is already a student of group'});
          }
        }else{
          res.status(HttpStatus.FORBIDDEN).json({message: 'Group is closed'});
        }
      }else{
        res.status(HttpStatus.FORBIDDEN).json({message: 'User is not allowed to join group'});
      }
    }else{
      res.status(HttpStatus.NOT_FOUND).json({message: 'Group not found'});
    }
  });
});

/**
 * List the members of group
 */
router.get('/:id/members', function(req, res){
  User.findByGroup(req.params.id, function(err, users){
    res.json(users);
  });
});

module.exports = router;
