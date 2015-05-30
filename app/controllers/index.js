/**
 * Created by macmini on 5/5/15.
 */

var express     = require('express');
var router      = express.Router();
var Subject     = require('../models/subject');
var jwt         = require('jsonwebtoken');
var unless      = require('express-unless');

var authenticate = function(req, res, next){
  if(req.method != 'OPTIONS') {
    var token = req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, req.app.get('secret'), function (err, decoded) {
        if (err) {
          return res.status(401).json({message: 'Failed to authenticate token'});
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({message: 'No token provided'});
    }
  }else{
    next();
  }
};
authenticate.unless = unless;

router.use(authenticate.unless({path: ['/users/register', '/users/login', '/files']}));

router.use('/subjects', require('./subjects'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/announcements', require('./announcements'));
router.use('/files', require('./files'));

module.exports = router;