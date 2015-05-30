/**
 * Created by macmini on 5/5/15.
 */

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var CommentSchema = new Schema({
  text: String,
  author: {_id: Schema.Types.ObjectId, name: String, avatar: String},
  created: Date,
  updated: Date
});

var FileSchema   = new Schema({
  name: String,
  path: String,
  extension: String,
  size: Number
});

var AnnouncementSchema = new Schema({
  text: String,
  author: {_id: Schema.Types.ObjectId, name: String, avatar: String},
  groups: [{_id: Schema.Types.ObjectId, name: String}],
  attachments: [FileSchema],
  comments: [CommentSchema],
  created: Date,
  updated: Date
});

AnnouncementSchema.statics.findByGroup = function(groupId, offset, limit, callback){
  return this
    .find({'groups._id': groupId})
    .select('text author attachments comments created updated')
    .sort({'created': -1})
    .skip(offset)
    .limit(limit)
    .exec(callback);
};


module.exports = mongoose.model('Announcement', AnnouncementSchema);