/**
 * Newsletter.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var Userschema = new Schema({
  email:String,
  timestamp:Date,
  status:String
 });
module.exports = {

  attributes: {

  }
};
