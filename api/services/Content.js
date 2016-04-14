/**
 * Content.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var schema = new Schema({
  title:String,
  content:String
 });
 module.exports = mongoose.model('Content', schema);
 var models = {
     saveData: function(data, callback) {
        var content = this(data);
         content.save(function(err, deleted) {
             if (err) {
                 callback(err, null);
             } else {
                 callback(null, deleted);
             }
         });
     },


 };
 module.exports = _.assign(module.exports, models);
