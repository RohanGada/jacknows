/**
 * Newsletter.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require('sendgrid')('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');

var schema = new Schema({
    email: String,
    timestamp: Date,
    status: String
});
module.exports = mongoose.model('Newsletter', schema);
var models = {
  saveData: function(data, callback) {
      var newsletter = this(data);
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
          newsletter.save(function(err, data2) {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, data2);
              }
          });
      }

  },
  newsletterApi: function(data, callback) {
    var newsletter=this(data);
    newsletter.timestamp=new Date();
    newsletter.email=data.email;
    console.log(data);
    Newsletter.findOne({
      "email":newsletter.email
    }).exec(function(err, found) {
     if (err) {
       console.log(err);
       callback(err, null);
     } else if (_.isEmpty(found)) {
       newsletter.save(function(err, newsletter) {
         if (err) {
           callback(err, null);
         } else {
           sendgrid.send({
               to: newsletter.email,
               from: "info@wohlig.com",
               subject: "Jacknows Newsletter",
               html: "<html><body><p>Hi,</p><p>This mail is from Jacknows Newsletter</p></body></html>"
           }, function(err, json) {
               if (err) {
                   callback(err, null);
               } else {
                   console.log(json);
                   callback(null, {
                       comment: "Mail Sent"
                   });
               }
           });
           //callback(null, created);
         }
       });
     } else {
       callback(null, {
         message: "User Already Exist"
       });
     }
   });
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
};
module.exports = _.assign(module.exports, models);
