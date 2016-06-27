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
       var testimonial = this(data);
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
           //booking.timestamp = new Date();
           testimonial.save(function(err, data2) {
               if (err) {
                   callback(err, null);
               } else {
                   callback(null, data2);
               }
           });
       }

   },
   getAll: function(data, callback) {
        this.find().exec(callback);
    },

   deleteData: function(data, callback) {
       this.findOneAndRemove({
           _id: data._id
       }, function(err, deleted) {
           if (err) {
               callback(err, null)
           } else {
               callback(null, deleted)
           }
       });
   },
   getOne: function(data, callback){
     this.findOne({
   _id: data._id
     }).exec(function(err, data2){
       if(err){
         console.log(err);
         callback(err, null)
       }
       else {
         callback(null, data2);
       }
     });
   },

 };
 module.exports = _.assign(module.exports, models);
