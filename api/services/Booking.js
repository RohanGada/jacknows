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
    amount: Number,
    discountCoupon: Number,
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
    from: String,
    alreadyBooked:{
      type:Boolean,
      default:false
    }
});


module.exports = mongoose.model('Booking', schema);
var models = {
    saveData: function(data, callback) {
        var updateObj = {};
        var booking = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).lean().exec(function(err, data2) {
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
                                },function(callback1) {
                                    Config.message2({
                                        mobile: emailData2.mobile,
                                        content: emailData2.content2
                                    }, function(err, data2) {
                                        // callback1(null, {
                                        //     message: "Done"
                                        // });
                                    });
                                },function(callback1) {
                                    Config.message2({
                                        mobile: emailData.mobile,
                                        content: emailData.content2
                                    }, function(err, data2) {
                                        // callback1(null, {
                                        //     message: "Done"
                                        // });
                                    });
                                }
                            ],
                            function(err, asyncrespo) {
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
                                    } else if (booking.status == "failure") {
                                        data.message = "Booking with " + data.username + " was cancelled.";
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
                        } else if (booking.status == "failure") {
                            saveObj = {
                                user: data2.expert,
                                notification: data.message,
                                image: data.userimage
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
                                    // callback(null, data2);
                                    Config.checkCall({
                                        _id: data._id
                                    }, function(err, scheduRes) {
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
                            var emailData = {}; /////TO EXPERT
                            emailData.email = data.email;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "Hi, we have sent your reply to the User, we will revert once the call is confirmed.";
                            emailData.mobile = data.expertmobile;
                            emailData.content2 = "We have sent your response to the user. We will get back to you once the call is confirmed.";
                            emailData.subject = "Booking Status";
                            var emailData2 = {}; /////TO USER
                            emailData2.email = data.useremail;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "Hi, the expert has replied to your request, please login to check. (http://wohlig.co.in/jacknows/#/login)";
                            emailData2.subject = "Booking Status";
                            emailData2.mobile = data.mobile;
                            emailData2.content2 = "You have received a response from the expert regarding your request. Please login to check.";
                            callMail(emailData, emailData2);
                            break;
                        case "reject":
                            var emailData = {}; /////TO EXPERT
                            emailData.email = data.email;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "Hi, we have sent your reply to the User, we will revert once the call is confirmed.";
                            emailData.subject = "Booking Status";
                            emailData.mobile = data.expertmobile;
                            emailData.content2 = "Hi, we have sent your reply to the User, we will revert once the call is confirmed.";
                            var emailData2 = {}; /////TO USER
                            emailData2.email = data.useremail;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "Hi, the expert has replied to your request, please login to check. (http://wohlig.co.in/jacknows/#/login)";
                            emailData2.subject = "Booking Status";
                            emailData2.mobile = data.mobile;
                            emailData2.content2 = "Hi, the expert has replied to your request, please login to check.";
                            callMail(emailData, emailData2);
                            break;
                        case "paid":
                            var emailData = {}; /////TO EXPERT
                            var timestamp = moment(data2.callTime).add(5, "hours").add(30, "minutes").format("DD-MM-YYYY hh:mm A");
                            // var timestamp = moment(data2.callTime).format("DD-MM-YYYY hh:mm A");
                            emailData.email = data.expertemail;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "Your call with " + data.username + " is confirmed for " + timestamp + " IST.";
                            emailData.mobile = data.expertmobile;
                            emailData.content2 = "Your call with " + data.username + " is confirmed. We will connect you with the user on " + timestamp + ".";
                            emailData.subject = "Booking Status";
                            var emailData2 = {}; /////TO USER
                            emailData2.email = data.email;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "Thanks for making the payment, your call with " + data.expertname + "  is confimed for " + timestamp + ".";
                            emailData2.subject = "Booking Status";
                            emailData2.mobile = data.mobile;
                            emailData2.content2 = "Thank you for the payment. Your call with " + data.expertname + "  is confirmed. We will connect you with the expert at " + timestamp + ".";
                            callMail(emailData, emailData2);
                            break;
                        case "failure":
                            var emailData = {}; /////TO EXPERT
                            emailData.email = data.expertemail;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.expertname;
                            emailData.content = "Your booking with " + data.username + " was cancelled";
                            emailData.mobile = data.expertmobile;
                            emailData.content2 = "Your booking with " + data.username + " was cancelled";
                            emailData.subject = "Booking Status";
                            var emailData2 = {}; /////TO USER
                            emailData2.email = data.email;
                            emailData2.filename = 'dummy.ejs';
                            emailData2.name = data.username;
                            emailData2.content = "Your booking with " + data.expertname + " was cancelled";
                            emailData2.subject = "Booking Status";
                            emailData2.mobile = data.mobile;
                            emailData2.content2 = "Your booking with " + data.expertname + " was cancelled";
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
                    console.log('in else');
                    console.log(foundme);
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
                                        emailData.content = "Thanks, your request has been sent to the expert. We will get back to you once they revert.";
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
                                        emailData2.content = "Hi, you have received a request from a user, please login to check. (http://wohlig.co.in/jacknows/#/login)";
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
                                    },
                                    function(callback1) {
                                        data.content2 = "Hi! You have received a request for a discussion. Please login to check and confirm. Thanks.";
                                        Config.message2({
                                            mobile: data.mobile,
                                            content: data.content2
                                        }, function(err, data2) {
                                            if (err) {
                                                callback1(err, null);
                                                // callback1(null, {
                                                //     message: "Done"
                                                // });
                                            } else {
                                                callback1(null, {
                                                    message: "Done"
                                                });
                                            }
                                        });
                                    },
                                    function(callback1) {
                                        data.content2 = "Your request has been sent across to the expert. Please await our confirmation.";
                                        Config.message2({
                                            mobile: data.usermobile,
                                            content: data.content2
                                        }, function(err, data2) {
                                            if (err) {
                                                callback1(err, null);
                                                // callback1(null, {
                                                //     message: "Done"
                                                // });
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

    foundSlot: function(data, callback) {
        // console.log('data.callTime',data.callTime);
        // data.callTime = new Date(data.callTime);
        // var chkwithin2Hr = moment(data.callTime).add(2, 'hour');
        // console.log('chkwithin2Hr',chkwithin2Hr);
        this.find({
            expert: data.expertuser,
            callTime: data.callTime
        }, {}, {}).exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            }
            else{
                console.log('here else');
                callback(null, deleted);

              }
                // console.log('deleted', deleted[0].callDuration);


        });
    },
    getAll: function(data, callback) {
        this.find({}, {}, {}).populate("expert", "firstName").populate("user", "firstName").lean().exec(function(err, deleted) {
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
                    $in: ["complete", "reject", "refund"]
                }
            }
        } else {
            matchobj = {
                user: data.user,
                status: data.status
            };
        }

        Booking.find(matchobj).populate("expert", '-password -forgotpassword -educationalQualification -awards -videoLinks -addPhotos -publicationLinks -experience -callSettings -__v ').exec(callback);
    },
    getExpertBooking: function(data, callback) {
        var matchobj = "";
        if (data.status == "") {
            matchobj = {
                expert: data.expertuser,
                status: {
                    $in: ["complete", "reject", "refund"]
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
    },

    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    Booking.count({
                        query: {
                            '$regex': check
                        }
                    }).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    Booking.find({
                        query: {
                            '$regex': check
                        }
                    }, {
                        password: 0
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).populate("expert", "firstName").populate("user", "firstName").exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function(err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    },

    saveBooking: function(data, callback) {
        var booking = this(data);
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
            booking.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }

    },

    getExpertTime: function(data, callback) {
        Booking.find({
            expert: data.expert
        }).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

};
module.exports = _.assign(module.exports, models);
