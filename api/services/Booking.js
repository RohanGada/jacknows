/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Userschema = new Schema({
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
module.exports = {

  attributes: {

  }
};
