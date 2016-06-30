/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require('sendgrid')('');
var moment = require('moment');

var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    callId: String,
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
            }, {
                status: data.status
            }).lean().exec(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    function callMail(emailData, emailData2) {
                        async.parallel([
                            function(callback1) {
                                Config.email(emailData, function(err, json) {
                                    if (err) {
                                        console.log(err);
                                        callback1(err, null);
                                    } else {
                                        callback1(null, {
                                            message: "Done"
                                        });
                                    }
                                });
                            },
                            function(callback1) {
                                Config.email(emailData2, function(err, json) {
                                    if (err) {
                                        console.log(err);
                                        callback1(err, null);
                                    } else {
                                        callback1(null, {
                                            message: "Done"
                                        });
                                    }
                                });
                            }
                        ], function(err, asyncrespo) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                if (booking.status == "accept") {
                                    data.message = data.expertname + " has accepted your request.";
                                    callMe(data, data2);
                                } else if (booking.status == "reject") {
                                    data.message = data.expertname + " has rejected your request.";
                                    callMe(data, data2);
                                } else {
                                    data.message = data.username + " has completed Payment.";
                                    callMe(data, data2);
                                }
                            }
                        });
                    }

                    function callMe(data, data2) {
                        var saveObj = {};
                        if (booking.status == "accept") {
                            saveObj = {
                                user: data2.user,
                                notification: data.message,
                                image: data.expertimage
                            };
                        } else if (booking.status == "reject") {
                            saveObj = {
                                user: data2.user,
                                notification: data.message,
                                image: data.expertimage
                            };
                        } else {
                            saveObj = {
                                expert: data2.expert,
                                notification: data.message,
                                image: data.userimage
                            };
                        }
                        Notification.saveData(saveObj, function(err, notRespo) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (booking.status == "paid") {
                                    Config.checkCall({ _id: data._id }, function(err, scheduRes) {
                                        if (err) {
                                            console.log(err);
                                            callback(err, null);
                                        } else {
                                            callback(null, data2);
                                        }
                                    });
                                } else {
                                    callback(null, data2);
                                }
                            }
                        });
                    }
                    switch (booking.status) {
                        case "accept":
                            var emailData = {};
                            emailData.email = data.email;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "We have sent your response to the user. We will get back to you once the call is confirmed.";
                            emailData.subject = "Booking Status";
                            var emailData2 = {};
                            emailData2.email = data.useremail;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "You have received a response from the expert regarding your request. Please login to check.";
                            emailData2.subject = "Booking Status";
                            callMail(emailData, emailData2);
                            break;
                        case "reject":
                            var emailData = {};
                            emailData.email = data.email;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "We have sent your response to the user. We will get back to you once the call is confirmed.";
                            emailData.subject = "Booking Status";
                            var emailData2 = {};
                            emailData2.email = data.useremail;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "You have received a response from the expert regarding your request. Please login to check.";
                            emailData2.subject = "Booking Status";
                            callMail(emailData, emailData2);
                            break;
                        case "paid":
                            var emailData = {};
                            emailData.email = data.expertemail;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "The call with " + data.username + " is confirmed. We will connect you with the user on " + moment(data2.callTime).format("DD-MM-YYYY hh:mm A") + ".";
                            emailData.subject = "Booking Status";
                            var emailData2 = {};
                            emailData2.email = data.email;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "Thank you for the payment. Your call with " + data.expertname + " is confirmed. We will connect you with the expert at " + moment(data2.callTime).format("DD-MM-YYYY hh:mm A") + ".";
                            emailData2.subject = "Booking Status";
                            callMail(emailData, emailData2);
                            break;
                        default:
                            callback({
                                message: "Wrong status"
                            }, null);
                            break;
                    }
                }
            });
        } else {
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
                                async.parallel([
                                    function(callback1) {
                                        var emailData = {};
                                        emailData.email = data.email;
                                        emailData.filename = 'dummy.ejs';
                                        emailData.name = data.username;
                                        emailData.content = "Your request has been sent across to the expert. Please await our confirmation";
                                        emailData.subject = "Booking Status";
                                        Config.email(emailData, function(err, json) {
                                            if (err) {
                                                callback1(err, null);
                                            } else {
                                                callback1(null, {
                                                    message: "Done"
                                                });
                                            }
                                        });
                                    },
                                    function(callback1) {
                                        Notification.saveData({
                                            expert: booking.expert,
                                            notification: data.username + " has requested for a call.",
                                            image: data.userimage
                                        }, function(err, notRespo) {
                                            if (err) {
                                                callback1(err, null);
                                            } else {
                                                callback1(null, {
                                                    message: "Done"
                                                });
                                            }
                                        });
                                    },
                                    function(callback1) {
                                        var emailData2 = {};
                                        emailData2.email = data.expertemail;
                                        emailData2.filename = 'dummy.ejs';
                                        emailData2.name = data.expertname;
                                        emailData2.content = "Hi! You have received a request for a discussion. Please login to check and confirm. Thanks.";
                                        emailData2.subject = "Booking Status";
                                        Config.email(emailData2, function(err, emailRespo) {
                                            if (err) {
                                                callback1(err, null);
                                            } else {
                                                callback1(null, {
                                                    message: "Done"
                                                });
                                            }
                                        });
                                    }
                                ], function(err, asyncrespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        console.log(err);
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
        this.find({}, {}, {}).lean().exec(function(err, deleted) {
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

        Booking.find(matchobj).populate("expert", '-password -forgotpassword -__v ').exec(callback);
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
        Booking.find(matchobj).populate("user", '-password -forgotpassword -__v ').exec(callback);
    },
    deleteAll: function(data, callback) {
        Booking.remove({}, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    editBooking: function(data, callback) {
        this.findOneAndUpdate({
            _id: data._id
        }, data).lean().exec(function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    getOne: function(data, callback) {
        this.findOne({
            _id: data._id
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null)
            } else {
                callback(null, data2);
            }
        });
    }
};
module.exports = _.assign(module.exports, models);
