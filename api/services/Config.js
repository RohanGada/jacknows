/**
 * Config.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var Userschema = new Schema({
   name:String,
   content:String,



 });
module.exports = {

  attributes: {

  }
};
