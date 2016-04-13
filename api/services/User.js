/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var schema = new Schema({
   name:String,
   email:String,
   password:String,
   facebook:String,
   google:String,
   summary:String,
   experience:String,
   contact:Number,
   forgotId:String,
   notification:Schema.Types.Mixed,
   shortList:{
     type:[{
       expertUser:
       {type:Schema.Types.ObjectId,
       ref:'Expertuser'},
       timestamp:Date
     }]
     index:true
     },


 });


module.exports = {

  attributes: {

  }
};
