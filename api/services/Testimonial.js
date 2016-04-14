/**
 * Testimonial.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var schema = new Schema({
  name:String,
  testimonial:String,
  company:String,
  image:String,

 });
 module.exports = mongoose.model('Testimonial', schema);
 var models = {
     saveData: function(data, callback) {
         var tewstimonial = this(data);
         tewstimonial.save(function(err, deleted) {
             if (err) {
                 callback(err, null);
             } else {
                 callback(null, deleted);
             }
         });
     },


 };
 module.exports = _.assign(module.exports, models);
