/**
 * Created by macmini on 5/5/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var Announcement  = require('./announcement');

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

/**
 * Find a user by email
 * @param email The email to query
 * @param callback
 * @returns {Query|*}
 */
UserSchema.statics.findByEmail = function(email, callback){
  return this.findOne({email: email}, callback);
};

/**
 * Find members of group
 * @param groupId The identifier of the group
 * @param callback
 * @returns {Query|*}
 */
UserSchema.statics.findByGroup = function(groupId, callback){
  return this.find({groups: groupId}, '_id name role avatar', callback);
};

/**
 * Get the list of announcement that a user can view
 * @param userId The identifier of the user
 * @param offset The offset of the query
 * @param limit The limit of the query
 * @param callback The callback function to call
 */
UserSchema.statics.getAnnouncements = function(userId, offset, limit, callback){
  this.findById(userId, function(err, user){
    if(user){
      return Announcement.findByGroups(user.groups, offset, limit, callback);
    }else{
      return null;
    }
  });
};

UserSchema.statics.addGroup = function(userId, groupId, callback){
  return this.findById(userId, function(err, user){
    if(user){
      user.groups.push(groupId);
      user.save(callback);
    }
  });
};


module.exports = mongoose.model('User', UserSchema);