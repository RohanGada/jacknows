/**
 * ExpertUser.js
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
 	gender:String,
 	mobileno:String,
 	addressDetails:String,
 	experience:String,
 	qualification:Number,
	bankDetails:Schema.Types.Mixed,
 	callSettings:Schema.Types.Mixed,
 	professionalDetails:Schema.Types.Mixed,
 	notification:Schema.Types.Mixed,
  image:String,


 });
module.exports = {

  attributes: {

  }
};
