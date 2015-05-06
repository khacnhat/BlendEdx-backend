/**
 * Created by macmini on 5/5/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  groups: [Schema.Types.ObjectId],
  created: Date,
  updated: Date
});

UserSchema.statics.findByEmail = function(email, callback){
  return this.findOne({email: email}, callback);
};

UserSchema.statics.login = function(email, password, callback){
  return this.findOne({email: email, password: password}, callback);
};

module.exports = mongoose.model('User', UserSchema);