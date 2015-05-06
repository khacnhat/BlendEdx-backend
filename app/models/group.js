/**
 * Created by macmini on 5/5/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var GroupSchema   = new Schema({
  name: String,
  description: String,
  subject: Schema.Types.ObjectId,
  teachers: [Schema.Types.ObjectId],
  students: [Schema.Types.ObjectId],
  created: Date,
  updated: Date
});

GroupSchema.statics.findByName = function(name, callback){
  return this.findOne({name: name}, callback);
};

GroupSchema.statics.getByUserId = function(userId, callback){
  return this.find({teachers: userId}, '_id name description', callback);
};

module.exports = mongoose.model('Group', GroupSchema);