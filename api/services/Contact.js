/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var schema = new Schema({
     name: String,
     email: String,
     message: String
 });
 module.exports = mongoose.model('Contact', schema);
 var models = {
   saveData: function(data, callback) {
       var contact = this(data);
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
           contact.save(function(err, data2) {
               if (err) {
                   callback(err, null);
               } else {
                  //  callback(null, data2);
                  var emailData = {};
                  emailData.email = data.email;
                  console.log('data.email',data.email);
                  emailData.content = "Hi, thanks for reaching out! This is an auto-generated response to let you know that we have received your request and will get back to you shortly.We appreciate your interest.";
                  emailData.filename = "newsletter.ejs";
                  emailData.subject = "Jacknows Contact";
                    // user.email = data.email;
                    // user.filename = data.filename;
                    Config.email(emailData, function(err, emailRespo) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            console.log(emailRespo);
                            callback(null, {
                                comment: "Mail Sent"
                            });
                        }
                    });
               }
           });
       }

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
   getAll: function(data, callback) {
       this.find({}, {
           // _id: 0
       }, {}).populate('expertUser').exec(function(err, deleted) {
           if (err) {
               callback(err, null);
           } else {
               callback(null, deleted);
           }
       });
   },




 };
 module.exports = _.assign(module.exports, models);
