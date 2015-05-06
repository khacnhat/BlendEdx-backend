/**
 * Created by macmini on 5/5/15.
 */
/**
 * Created by macmini on 5/5/15.
 */

var express     = require('express');
var app         = express();
var router      = express.Router();
var User        = require('../models/user');
var jwt         = require('jsonwebtoken');

// register new user
router.post('/register', function(req, res){
  var email = req.body.email;
  User.findByEmail(email, function(err, user){
    if(user === null){
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.role = req.body.role;
      user.avatar = req.body.avatar;
      user.groups = [];
      user.created = new Date();
      user.updated = new Date();

      user.save(function(err){
        if(err){
          res.send(err);
        }else{
          res.json({message: 'Registration successful'});
        }
      });
    }else{
      res.status(409).json({message: "This email is used"});
    }
  });
});

router.post('/login', function(req, res){
  User.login(req.body.email, req.body.password, function(err, user){
    if(user !== null){
      var token = jwt.sign(user, req.app.get('secret'), {
        expiresInMinutes: 1440
      });
      res.json({
        user: user,
        token: token
      });
    }else{
      res.status(401).json({message: 'Email or password incorrect'});
    }
  });
});

module.exports = router;