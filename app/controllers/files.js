/**
 * Created by nhatnk on 5/16/15.
 */
var express     = require('express');
var router      = express.Router();
var File       = require('../models/file');
var HttpStatus = require('http-status-codes');
var multiparty = require('multiparty');
var fs = require('fs')
var uuid = require('node-uuid');

router.get('/', function(req, res){
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form enctype="multipart/form-data" method="post">'+
    '<input type="file" name="file"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

// upload an attachment file
router.post('/', function(req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    var file = files.file[0];
    var contentType = file.headers['content-type'];
    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    var uuidName = uuid.v4() + extension;
    var destPath = '/Users/nhatnk/Uploads/'+uuidName;

    if (false) {//Check file type
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
      return res.json({name: file.originalFilename, path: destPath, extension: extension, size: file.size});
    }else
      return res.json({message: 'File not uploaded'});
  });
});

module.exports = router;
