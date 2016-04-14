/**
 * DailyUpdates.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: String,
  description: String,
  content: String,
  recommendation: Schema.Types.Mixed,
  timestamp: Date,
  image:String,
});
module.exports =mongoose.model('DailyUpdates', schema);
var models = {

  saveData:function(data, callback)  {
    var dailyupdates = this(data);
    if (data._id) {
        this.findOneAndUpdate({
            _id: data._id
        }, data, function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data2);
            }
        });
    } else {
      dailyupdates.timestamp=new Date();
        dailyupdates.save(function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data2);
            }
        });
    }

  },
  

};
module.exports = _.assign(module.exports, models);
