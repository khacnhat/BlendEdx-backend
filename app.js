/**
 * Created by macmini on 5/4/15.
 */
var express     = require('express');
var app         = express();
var config      = require('./config');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./app/helpers/cors'));
app.use("/public", express.static(__dirname +  '/app/public'));
app.use(require('./app/controllers'));
app.set('secret', config.secret);

mongoose.connect(config.database);

//Root directory
var path = require('path');
global.appRoot = path.resolve(__dirname);


var port = process.env.PORT || 9000;

app.listen(port, function(){
  console.log('App started at port: 9000');
});