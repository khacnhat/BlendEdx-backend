/**
 * Created by macmini on 5/5/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var SubjectSchema = new Schema({
  name: String
});

SubjectSchema.statics.findByName = function(name, callback){
  return this.findOne({name: name}, callback);
};

module.exports = mongoose.model('Subject', SubjectSchema);