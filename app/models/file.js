'use strict';
/**
 * Created by nhatnk on 5/16/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var FileSchema   = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  link: String,
  extension: String
});