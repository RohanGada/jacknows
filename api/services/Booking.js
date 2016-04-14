/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: String,
  callSettingsime: Date,
  expert: String,
  status: Schema.Types.Mixed,
  stateLog: Schema.Types.Mixed,
  amount: String,
  discountCoupon: String,
  finalAmount: String,
  callStartTime: Date,
  callEndTime: Date,
  CallDuration: Date
});


 module.exports =mongoose.model('Booking', schema);
 var models = {

   saveData:function(data, callback)  {
     var booking = this(data);
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
       booking.timestamp=new Date();
         booking.save(function(err, data2) {
             if (err) {
                 callback(err, null);
             } else {
                 callback(null, data2);
             }
         });
     }

   },
   getAll: function(data, callback) {
       this.find({}, {}, {}, function(err, deleted) {
           if (err) {
               callback(err, null);
           } else {
               callback(null, deleted);
           }
       });
   },
   deleteData:function(data,callback){
     this.findOneAndRemove({
       _id:data._id
     },function(err,deleted){
       if(err){
         callback(err,null)
       }else{
         callback(null,deleted)
       }
     });
   },

 };
 module.exports = _.assign(module.exports, models);
