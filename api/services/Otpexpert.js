/**
 * Otpexpert.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;
  var request = require("request");
  var schema = new Schema({
      contact: String,
      otp: String,
      timestamp: {
          type: Date,
          default: Date.now
      }
  });
  var d = new Date();
 d.setMinutes(d.getMinutes() - 10);
 module.exports = mongoose.model("Otpexpert", schema);
 var model = {
     saveData: function(data, callback) {
         // console.log('data in otp ssavedata', data);
         data.otp = (Math.random() + "").substring(2, 8);
           // console.log('data in otp ssavedata', data.otp);
         var otpexpert = this(data);
         this.count({
             contact: data.contact
         }, function(err, found) {
             if (err) {
                 console.log(err);
                 callback(err, null);
             } else {

               console.log("Found111 otpexpert",found);
                 if (found === 0) {
                     console.log(found);
                     otpexpert.save(function(err, data2) {
                         if (err) {
                             console.log(err);
                             callback(err, null);
                         } else {

                           console.log(data2);
                             // console.log('in else');
                             //
                             data.content2 = "Hi, your OTP for verification of your mobile number on JacKnows is " + data.otp;
                             Config.message2({
                                 mobile: data.mobileno,
                                 content: data.content2
                             }, function(err, data2) {
                                 if (err) {
                                     callback(null, {
                                         message: "Done error msg"
                                     });
                                 } else {

                                  //  console.log("message",content);
                                   callback(null,"done")
                                     // callback(null, {
                                     //     message: "Done"
                                     // });
                                 }
                             });


                             // request.get({
                             //     url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=Ab239cf5d62a8e6d2c531663f289d0f5d&to=" + data2.contact + "&sender=JAKNWS&message=Hi, your OTP for verification of your mobile number on JacKnows is " + data.otp + "&format=json"
                             // }, function(err, http, body) {
                             //     if (err) {
                             //         console.log(err);
                             //         callback(err, null);
                             //     } else {
                             //         console.log(body);
                             //     }
                             // });


                         }
                     });
                 } else {
                   console.log('inside 1 else otp exp');
                     data.timestamp = new Date();
                     Otpexpert.findOneAndUpdate({
                         contact: data.contact
                     }, data, function(err, data2) {
                         if (err) {
                             console.log('err');
                             callback(err, null);
                         } else {
                           //  callback(null, data2);
console.log('inside 2 else otp exp');
                            data.content2 = "Hi, your OTP for verification of your mobile number on JacKnows is " + data.otp;
                            Config.message2({
                                mobile: data.mobileno,
                                content: data.content2
                            }, function(err, data2) {
                                if (err) {
                                    callback(null, {
                                        message: "Done"
                                    });
                                } else {
console.log('inside 3 else otp exp');
                                  // console.log("message",content);
                                  callback(null,"done")
                                    // callback(null, {
                                    //     message: "Done"
                                    // });
                                }
                            });
                             //  request.get({
                             //      url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=Accfcbe3dd1296a7def430bb0678279b3&to=" + data.contact + "&sender=JAKNWS&message=Dear User, One Time Password (OTP) to complete your mobile number verification is " + data.otp + "&format=json"
                             //  }, function(err, http, body) {
                             //      if (err) {
                             //          console.log(err);
                             //          callback(err, null);
                             //      } else {
                             //          console.log(body);
                             //          delete data.otp;
                             //          callback(null, data);
                             //      }
                             //  });
                         }
                     });
                 }
             }
         });
     },

     checkOtpExpert: function(data, callback) {
       console.log(d);
         Otpexpert.findOneAndUpdate({
             contact: data.contact,
             otp: data.otp,
             timestamp: {
                 $gte: d
             }
         }, {
             $set: {
                 otp: ""
             }
         }, function(err, data2) {
             if (err) {
                 console.log(err);
                 callback(err, null);
             } else {
               console.log(data2);
                 if (data2 !== null) {
                     ExpertUser.findOneAndUpdate({
                         mobileno: data.contact
                     }, {
                         $set: {
                             "verifyotp": true
                         }
                     }, function(err, data2) {
                        callback(null, data2);
                         // if (data2.verifyemail !== "") {
                         //     callback("Please check your inbox for instructions on email verification.", null);
                         // } else {
                             var updated = data2.toObject();
                             delete updated._id;
                             // User.saveData(updated, function(err, data2) {
                             //     if (err) {
                             //         console.log(err);
                             //         callback(err, null);
                             //     } else {
                             //         console.log(data2);
                             //
                             //         callback(null, data2);
                             //     }
                             // });
                         // }
                     });

                 } else {
                     callback(null, {
                         message: "OTP expired"
                     });
                 }
             }
         });
     },
 };

  module.exports = _.assign(module.exports, model);
