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
  updated: Date,
  code: String,
  open: Boolean
});

GroupSchema.statics.findByName = function(name, callback){
  return this.findOne({name: name}, callback);
};

GroupSchema.statics.findByCode = function(code, callback){
  return this.findOne({code: code}, callback);
};

/**
 * Find groups belong to teacher
 * @param userId
 * @param query
 * @param callback
 * @returns {Query|*}
 */
GroupSchema.statics.getByUserId = function(userId, query, callback){
  var q = {teachers: userId};
  if(query){
   q.name = {$regex: query};
  }
  return this.find(q, '_id name description', callback);
};

/**
 * Find groups belong to student
 * @param userId The identifier of the student
 * @param query The query contain the name
 * @param callback
 * @returns {Query|*}
 */
GroupSchema.statics.getByStudentId = function(studentId, query, callback){
  var q = {students: studentId};
  if(query){
    q.name = {$regex: query};
  }
  return this.find(q, '_id name description', callback);
};

GroupSchema.methods.hasStudent = function(studentId){
  return this.students.indexOf(studentId) > -1;
}

GroupSchema.methods.hasTeacher = function(teacherId){
  return this.teachers.indexOf(teacherId) > -1;
}


module.exports = mongoose.model('Group', GroupSchema);