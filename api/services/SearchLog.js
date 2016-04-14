/**
 * SearchLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    search: String,
    timestamp: Date,
});
module.exports = mongoose.model('SearchLog', schema);
var models = {

    saveData: function(data, callback) {
      var searchlog = this(data);
        searchlog.save(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },


};
module.exports = _.assign(module.exports, models);
