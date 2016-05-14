/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    notification: String,
    image: String,
    expert: String,
    user: String,
    status: Boolean,
    timestamp: Date
});

module.exports = mongoose.model('Notification', schema);
var models = {
    saveData: function(data, callback) {
        var notification = this(data);
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
            notification.timestamp = new Date();
            notification.status = false;
            notification.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }

    },
    getAll: function(data, callback) {
        Notification.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        notification.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    getOne: function(data, callback) {
        Notification.findOne({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },

    findNotification: function(data, callback) {
        var matchobj = {};
        if (data.from == "expert") {
            matchobj = {
                expert: data._id,
                status: false
            };
        } else {
            matchobj = {
                user: data._id,
                status: false
            }
        }
        Notification.find(matchobj,
          {},
          {
            sort:{_id:-1}
          },function(err, nodata) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, nodata);
            }
        });
    },
};
module.exports = _.assign(module.exports, models);
