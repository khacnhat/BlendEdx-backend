/**
 * Created by nhatnk on 5/6/15.
 */
module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, x-access-token, Content-Type");
  next();
}
