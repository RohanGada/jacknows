/**
 * DailyUpdates.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Userschema = new Schema({
  title: String,
  description: String,
  content: String,
  recommendation: Schema.Types.Mixed,
  timestamp: Date,
  image:String,
});
module.exports = {

  attributes: {

  }
};
