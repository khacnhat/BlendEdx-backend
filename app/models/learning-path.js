/**
 * Created by nhatnk on 6/22/15.
 */
var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var LearningItem = new Schema({
  objective: String,
  videos: [String],
  articles: [String],
  quiz: String,
  output: String
});

var LearningPathSchema = new Schema({
  name: String,
  items: [LearningItem]
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);