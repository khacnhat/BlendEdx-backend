/**
 * Created by macmini on 5/5/15.
 */

var express     = require('express');
var router      = express.Router();
var Subject     = require('../models/subject');

// create new subject
router.post('/', function(req, res){
  var name = req.body.name;

  Subject.findByName(name, function(err, subject){
    if(subject === null){
      var subject = new Subject();
      subject.name = name;
      subject.save(function(err){
        if(err){
          res.send(err);
        }else{
          res.json({message: 'Subject created'});
        }
      });
    }else{
      res.status(409).json({message: 'Subject existed'});
    }
  });
});

// get all subjects
router.get('/', function(req, res){
  Subject.find(function(err, subjects){
    if(err){
      res.send(err);
    }else{
      res.json(subjects);
    }
  });
});

// retrieve a subject
router.get('/:id', function(req, res){
  Subject.findById(req.params.id, function(err, subject){
    if(subject !== null){
      res.json(subject);
    }else{
      res.status(404).json({message: 'Subject not found'});
    }
  });
});

module.exports = router;