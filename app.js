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
app.use(require('./app/controllers'));
app.set('secret', config.secret);

mongoose.connect(config.database);

var port = process.env.PORT || 8080;

app.listen(port);