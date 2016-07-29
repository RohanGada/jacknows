/**
 * ConfigController
 *
 * @description :: Server-side logic for managing Configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var request = require("request");
var moment = require('moment');
var checksum = require('./checksum');
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            Config.saveData(req.body, function(err, respo) {
                if (err) {
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respo
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getAll: function(req, res) {
        if (req.body) {
            Config.getAll(req.body, function(err, respo) {
                if (err) {
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respo
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                Config.deleteData(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid Id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    checkCall: function(req, res) {
        Config.checkCall(req.body, function(err, data) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    data: err
                });
            } else {
                res.json({
                    value: true,
                    data: data
                });
            }
        });
    },
    emailReader: function(req, res) {
        var isfile2 = fs.existsSync('./views/' + req.body.filename);
        if (isfile2) {
            res.view(req.body.filename, req.body);
        } else {
            res.json({
                value: false,
                message: "Please provide params"
            });
        }
    },
    scheduleCron: function(req, res) {
        var plusobj = {};
        plusobj.day = moment().add(1, 'days').seconds(0)._d;
        plusobj.dayfive = moment().add(1, 'days').add(5, 'minutes').seconds(0)._d;
        plusobj.hour = moment().add(1, 'hours').seconds(0)._d;
        plusobj.hourfive = moment().add(1, 'hours').add(5, 'minutes').seconds(0)._d;
        plusobj.mins = moment().seconds(0)._d;
        plusobj.minsfive = moment().add(5, 'minutes').seconds(0)._d;
        Booking.find({
            $or: [{
                callTime: {
                    $gt: plusobj.day,
                    $lte: plusobj.dayfive
                }
            }, {
                callTime: {
                    $gt: plusobj.hour,
                    $lte: plusobj.hourfive
                }
            }, {
                callTime: {
                    $gt: plusobj.mins,
                    $lte: plusobj.minsfive
                }
            }],
            status: "paid"
        }).populate("user", "-_id firstName mobile email").populate("expert", "-_id firstName mobileno email").lean().exec(function(err, data2) {
            console.log(data2);
            if (err) {
                console.log(err);
                res.json({ value: false, data: err });
            } else if (data2 && data2.length > 0) {
                // res.json({ value: true, data: data2 });
                async.each(data2, function(some, callback1) {
                    var time = {};
                    time.user = {};
                    time.expert = {};
                    if (some.expert.email) {
                        time.expert.email = some.expert.email;
                    }
                    time.expert.filename = 'dummy.ejs';
                    time.user.filename = 'dummy.ejs';
                    if (some.user.email) {
                        time.user.email = some.user.email;
                    }
                    time.expert.subject = "Call Reminder";
                    time.user.subject = "Call Reminder";
                    time.expert.name = some.expert.firstName;
                    time.user.name = some.user.firstName;
                    if (some.expert.mobileno) {
                        time.expert.mobile = some.expert.mobileno;
                    }
                    if (some.user.mobile) {
                        time.user.mobile = some.user.mobile;
                    }
                    var timer = moment(some.callTime).diff(moment());
                    if ((timer < 60000 || timer > 60000) && timer < 3600000) {
                        time.expert.content = "We will connect you as soon as the expert is on the online. Request you to please be ready and hope that you have a great consultation experience";
                        time.user.content = "We will connect you as soon as the expert is on the online. Request you to please be ready and hope that you have a great consultation experience";
                        callMe();
                    } else if ((timer < 3600000 || timer > 3600000) && timer < 86400000) {
                        time.expert.content = "This is a reminder message for your call through JacKnows. We will be calling you in an hour. Please make sure your phone is on, sufficiently charged and you are in a good signal area. Thank you. ";
                        time.user.content = "This is a reminder message for your call through JacKnows. We will be calling you in an hour. Please make sure your phone is on, sufficiently charged and you are in a good signal area. Thank you. ";
                        callMe();
                    } else {
                        time.expert.content = "This is a reminder from JacKnows. We will be connecting you at " + moment(some.callTime).format("MMM DD YYYY hh:mm A") + " tomorrow. Thank you";
                        time.user.content = "This is a reminder from JacKnows. We will be connecting you at " + moment(some.callTime).format("MMM DD YYYY hh:mm A") + " tomorrow. Thank you";
                        callMe();
                    }

                    function callMe() {
                        console.log(time);
                        async.parallel([
                            function(callback2) {
                                if (time.expert.email) {
                                    Config.email(time.expert, function(err, respo) {
                                        console.log(err);
                                        callback2(null, { message: "Done" });
                                    });
                                } else {
                                    callback2(null, { message: "Done" });
                                }
                            },
                            function(callback2) {
                                if (time.user.email) {
                                    Config.email(time.user, function(err, respo) {
                                        console.log(err);
                                        callback2(null, { message: "Done" });
                                    });
                                } else {
                                    callback2(null, { message: "Done" });
                                }
                            },
                            function(callback2) {
                                if (time.expert.mobile) {
                                    Config.message(time.expert, function(err, respo) {
                                        console.log(err);
                                        callback2(null, { message: "Done" });
                                    });
                                } else {
                                    callback2(null, { message: "Done" });
                                }
                            },
                            function(callback2) {
                                if (time.user.mobile) {
                                    Config.message(time.user, function(err, resp) {
                                        console.log(err);
                                        callback2(null, { message: "Done" });
                                    });
                                } else {
                                    callback2(null, { message: "Done" });
                                }
                            }
                        ], function(err, respo) {
                            console.log(err);
                            callback1(null, "Write Done");
                        });
                    }
                }, function(err) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, { message: "Apps Copied Successfully" });
                    }
                });
            } else {
                console.log("No calls found");
                res.json({ value: false, data: { message: "No data found" } });
            }
        });
    },
    callStatus: function(req, res) {
        if (req.query && req.query.status && req.query.status != "" && req.query.callId && req.query.callId != "") {
            Booking.update({
                callId: req.query.callId
            }, {
                $set: {
                    status: req.query.status.toLowerCase()
                }
            }, function(err, respo) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    console.log(respo);
                    if (respo.nModified == 1) {
                        res.json({
                            value: true,
                            data: { message: "Status updated successfully" }
                        });
                    } else {
                        res.json({
                            value: false,
                            data: { message: "Call-Id not found" }
                        });
                    }
                }
            });
        } else {
            res.json({
                value: false,
                data: { message: "Invalid params. Please provide status" }
            });
        }
    },
    callPay: function(req, res) {
        if (req.body && req.body._id) {
            if (req.session.user) {
                if (req.session.user.mobile && req.session.user.email) {
                    Booking.findOne({
                        _id: req.body._id
                    }, {
                        _id: 0,
                        finalAmount: 1
                    }).exec(function(err, respo) {
                        if (err) {
                            console.log(err);
                            res.json(err, null);
                        } else if (_.isEmpty(respo)) {
                            res.json({ message: "Booking was not found" }, null);
                        } else {
                            var genParams = {
                                "CHANNEL_ID": "WEB",
                                "CUST_ID": req.session.user._id,
                                "EMAIL": req.session.user.email,
                                "INDUSTRY_TYPE_ID": "Retail",
                                "MID": "GoFish30419544249686",
                                "MERC_UNQ_REF": req.body._id,
                                "MOBILE_NO": req.session.user.mobile,
                                "ORDER_ID": "ORD-",
                                "REQUEST_TYPE": "DEFAULT",
                                "THEME": "merchant",
                                "TXN_AMOUNT": respo.finalAmount,
                                "WEBSITE": "jacknows"
                            };
                            var possible = "abcdefghijklmnopqrstuvwxyz1234567890";
                            for (var i = 0; i < 8; i++) {
                                genParams.ORDER_ID += possible.charAt(Math.floor(Math.random() * possible.length));
                            }
                            var abc = "https://pguat.paytm.com/oltp-web/processTransaction?";
                            _.each(genParams, function(value, key) {
                                abc += key + "=" + value + "&";
                            });
                            checksum.genchecksum(genParams, "7_Ew6zbUNTNvfJXv", function(err, genParams) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        value: false,
                                        data: err
                                    });
                                } else {
                                    abc += "CHECKSUMHASH=" + encodeURIComponent(genParams.CHECKSUMHASH);
                                    res.json({
                                        value: true,
                                        data: abc
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        value: false,
                        data: "Please update mobile-number and email"
                    });
                }
            } else {
                res.json({
                    value: false,
                    data: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    },
    response: function(req, res) {
        console.log(req.body);
        if (req.body && req.body.MERC_UNQ_REF) {
            // res.json({
            //     value: true,
            //     data: req.body
            // });
            Booking.findOne({ _id: req.body.MERC_UNQ_REF }).populate("user").populate("expert").lean().exec(function(err, respo) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    if (_.isEmpty(respo)) {
                        console.log("No data found");
                        res.json({
                            value: false,
                            data: "Booking not found"
                        });
                    } else {
                        var reqParam = {};
                        console.log(respo);
                        if (respo.user) {
                            if (req.body.RESPCODE == "01") {
                                reqParam._id = req.body.MERC_UNQ_REF;
                                reqParam.transactionID = req.body.BANKTXNID;
                                reqParam.user = respo.user._id;
                                reqParam.username = respo.user.firstName;
                                reqParam.userimage = respo.user.image;
                                reqParam.email = respo.user.email;
                                reqParam.mobile = respo.user.mobile;
                                reqParam.from = "user";
                                reqParam.status = "paid";
                                reqParam.expertmobile = respo.expert.mobileno;
                                reqParam.expertemail = respo.expert.email;
                                reqParam.expertname = respo.expert.firstName;
                                callSave();
                            } else {
                                reqParam.cancelReason = req.body.RESPMSG
                                reqParam._id = req.body.MERC_UNQ_REF;
                                reqParam.user = respo.user._id;
                                reqParam.username = respo.user.firstName;
                                reqParam.userimage = respo.user.image;
                                reqParam.email = respo.user.email;
                                reqParam.mobile = respo.user.mobile;
                                reqParam.from = "user";
                                reqParam.status = "failure";
                                reqParam.expertmobile = respo.expert.mobileno;
                                reqParam.expertemail = respo.expert.email;
                                reqParam.expertname = respo.expert.firstName;
                                callSave();
                            }
                        } else {
                            res.json({
                                value: false,
                                data: "User not found"
                            });
                        }

                        function callSave() {
                            Booking.saveData(reqParam, function(err, respo) {
                                if (err) {
                                    res.json({
                                        value: false,
                                        data: err
                                    });
                                } else {
                                    if (respo._id) {
                                        res.json({
                                            value: true,
                                            data: respo
                                        });
                                    } else {
                                        res.json({
                                            value: false,
                                            data: respo
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    },
    checkFailed: function(req, res) {
        Booking.update({
            callTime: {
                $lt: new Date()
            },
            status: {
                $in: ["pending"]
            }
        }, {
            $set: {
                status: "failure",
                cancelReason: "Time expired"
            }
        }, {
            multi: true
        }, function(err, updated) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    data: err
                });
            } else {
                res.json({
                    value: false,
                    data: updated
                });
            }
        });
    }
};
