/**
 * Newsletter.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require('sendgrid')('');

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
    newsletterApi: function(data, callback) {
        var newsletter = this(data);
        newsletter.timestamp = new Date();
        newsletter.email = data.email;
        console.log(data);
        Newsletter.findOne({
            "email": newsletter.email
        }).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                newsletter.save(function(err, newsletter) {
                    if (err) {
                        callback(err, null);
                    } else {
                      newsletter.email = data.email;
                      newsletter.filename = '../views/';
                      newsletter.timestamp = new Date();
                      Config.email(newsletter, function(err, emailRespo) {
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
            } else {
                callback(null, {
                    message: "User Already Exist"
                });
            }
        });
    },
    getOne: function(data, callback){
      this.findOne({
    _id: data._id
      }).exec(function(err, data2){
        if(err){
          console.log(err);
          callback(err, null)
        }
        else {
          callback(null, data2);
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
