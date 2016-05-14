/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    //user: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //expert: String,
    expert: {
        type: Schema.Types.ObjectId,
        ref: 'ExpertUser'
    },
    callTime: Date,
    status: String,
    amount: String,
    discountCoupon: String,
    finalAmount: String,
    callStartTime: Date,
    callEndTime: Date,
    callDuration: String,
    areaOfExpertise: String,
    bookDate: Date,
    bookTime: Date,
    image: String,
    feedback: String,
    stateLog: {
        type: [{
            status: String,
            oldStatus: String,
            timestamp: Date
        }],
        index: true
    },
    transactionID: String,
    callRating: String,
    userRating: String,
    cancelReason: String,
    expertRating: String,
    query: String,
    from: String
});


module.exports = mongoose.model('Booking', schema);
var models = {

    saveData: function(data, callback) {
        var booking = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).lean().exec(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    switch (booking.status) {
                        case "accept":
                            Notification.saveData({
                                user: data2.user,
                                notification: data.expertname + " has accept your request.",
                                image: data.expertimage
                            }, function(err, notRespo) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, data2);
                                }
                            });
                            break;
                        case "reject":
                            Notification.saveData({
                                user: data2.user,
                                notification: data.expertname + " has reject your request.",
                                image: data.expertimage
                            }, function(err, notRespo) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, data2);
                                }
                            });
                            break;
                        case "paid":
                            Notification.saveData({
                                expert: data2.expert,
                                notification: data.username + " has paid for service.",
                                image: data.userimage
                            }, function(err, notRespo) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, data2);
                                }
                            });
                            break;
                        default:
                            callback(null, data2);
                            break;
                    }
                }
            });
        } else {
            //booking.timestamp = new Date();
            Booking.findOne({
                expert: data.expert,
                user: data.user,
                status: {
                    $in: ["accept", "paid", "pending"]
                }
            }).exec(function(err, foundme) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    if (_.isEmpty(foundme)) {
                        booking.status = "pending";
                        booking.save(function(err, data2) {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log(booking);
                                Notification.saveData({
                                    expert: booking.expert,
                                    notification: data.username + " has booked you.",
                                }, function(err, notRespo) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data2);
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, {
                            message: "Cannot Book Expert"
                        });
                    }
                }
            });
        }
    },
    getAll: function(data, callback) {
        this.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
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
    getBooking: function(data, callback) {
        var matchobj = "";
        if (data.status == "") {
            matchobj = {
                user: data.user,
                status: {
                    $in: ["completed", "reject", "refunded"]
                }
            }
        } else {
            matchobj = {
                user: data.user,
                status: data.status
            };
        }

        Booking.find(matchobj).populate("expert", '-_id -password -forgotpassword -__v ').exec(callback);
    },

    getExpertBooking: function(data, callback) {
        var matchobj = "";
        if (data.status == "") {
            matchobj = {
                expert: data.expertuser,
                status: {
                    $in: ["completed", "reject", "refunded"]
                }
            }
        } else {
            matchobj = {
                expert: data.expertuser,
                status: data.status
            };
        }
        Booking.find(matchobj).populate("user", '-_id -password -forgotpassword -__v ').exec(callback);
    },


};
module.exports = _.assign(module.exports, models);
