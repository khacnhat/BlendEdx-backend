/**
 * Created by macmini on 5/5/15.
 */
/**
 * Created by macmini on 5/5/15.
 */

var express       = require('express');
var app           = express();
var router        = express.Router();
var User          = require('../models/user');
var Group          = require('../models/group');
var Announcement  = require('../models/announcement');
var jwt           = require('jsonwebtoken');
var bcrypt        = require('bcrypt-nodejs');
var multiparty = require('multiparty');
var fs = require('fs')
var uuid = require('node-uuid');
var easyimg = require('easyimage');
var HttpStatus = require('http-status-codes');


// register new user
router.post('/register', function(req, res){
  var email = req.body.email;
  User.findByEmail(email, function(err, user){
    if(user === null){
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password);
      user.role = req.body.role;
      user.avatar = req.body.avatar;
      user.groups = [];
      user.created = new Date();
      user.updated = new Date();

      user.save(function(err){
        if(err){
          res.send(err);
        }else{
          var token = jwt.sign(user, req.app.get('secret'), {
            expiresInMinutes: 1440
          });
          res.json({
            user: user,
            token: token
          });
        }
      });
    }else{
      res.status(409).json({message: "This email is used"});
    }
  });
});

/**
 * Login function
 */
router.post('/login', function(req, res){
  User.findByEmail(req.body.email, function(err, user){
    if(user !== null && bcrypt.compareSync(req.body.password, user.password)){
      var token = jwt.sign(user, req.app.get('secret'), {
        expiresInMinutes: 1440
      });
      res.json({
        user: {_id: user._id, name: user.name, role: user.role},
        token: token
      });
    }else{
      res.status(401).json({message: 'Email or password incorrect'});
    }
  });
});

/**
 * Get user profile
 */
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(user){
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created: user.created
      });
    }else{
      res.status(404).json({message: 'User not found'});
    }
  });
});

/**
 * Upload avatar
 */
router.post('/:id/avatar', function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    var file = files.file[0];
    var contentType = file.headers['content-type'];
    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    var uuidName = uuid.v4() + extension;
    var destPath = appRoot + '/app/public/users/original/'+uuidName;

    if (extension != '.jpg' && extension != '.png' ) {
      fs.unlink(tmpPath);
      return res.status(400).json({message: 'Unsupported file type.'});
    }
    var is = fs.createReadStream(tmpPath);
    var os = fs.createWriteStream(destPath);

    if(is.pipe(os)) {
      fs.unlink(tmpPath, function (err) {
        if (err) {
          console.log(err);
        }
      });
      //Preparing images
      easyimg.thumbnail({
        src: destPath,
        dst: appRoot + '/app/public/users/50x50/' + uuidName,
        width: 50,
        height: 50
      }).then(function(){
        easyimg.thumbnail({
          src: destPath,
          dst: appRoot + '/app/public/users/110x110/' + uuidName,
          width: 100,
          height: 100
        }).then(function(){
          User.findById(req.user._id, function(err, user){
            if(user){
              //Remove existing avatar
              if(user.avatar){
                var originalPath = appRoot + "/app/public/users/original/" + user.avatar;
                if(fs.existsSync(originalPath)){
                  fs.unlinkSync(originalPath);
                }
                var thumbnail50x50Path = appRoot + "/app/public/users/50x50/" + user.avatar;
                if(fs.existsSync(thumbnail50x50Path)){
                  fs.unlinkSync(thumbnail50x50Path);
                }
                var thumbnail110x110Path = appRoot + "/app/public/users/110x110/" + user.avatar;
                if(fs.existsSync(thumbnail110x110Path)){
                  fs.unlinkSync(thumbnail110x110Path);
                }
              }
              user.avatar = uuidName;
              user.save(function(){
                return res.json({name: file.originalFilename, path: uuidName, extension: extension, size: file.size});
              });
            }
          });
        });
      });
    }else
      return res.status(500).json({message: 'File not uploaded'});
  });
});

module.exports = router;