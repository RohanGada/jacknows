/**
 * BookingController
 *
 * @description :: Server-side logic for managing Bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sendgrid = require('sendgrid')('');
var request = require('request');
// const request = require('request-promise');
var http = require('http');
// var curl = require('curlrequest');
module.exports = {
    sms: function(req, res) {

        // Working
        //
        var text = "The call with XXXXXXX is confirmed. We will connect you with the user on XXXXXXX.";

        var text = encodeURI(text);
        request.get({
            url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=Ab239cf5d62a8e6d2c531663f289d0f5d&to=9922319328&sender=JAKNWS&message=" + text + "&format=json"
        }, function(err, http, body) {
            if (err) {
                console.log(err);
                // callback(err, null);
            } else {
                console.log(body);
                // callback(null, body);
            }
        });

    },

    saveData: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                if (req.body.from == "expert") {
                    if (req.session.expertuser) {
                        req.body.expertname = req.session.expertuser.firstName;
                        req.body.expertimage = req.session.expertuser.image;
                        req.body.email = req.session.expertuser.email;
                        req.body.expertmobile = req.session.expertuser.mobileno;
                        callSave();
                    } else {
                        res.json({
                            value: false,
                            data: "User not loggd-in"
                        });
                    }
                } else if (req.body.from == "user") {
                    if (req.session.user) {
                        req.body.user = req.session.user._id;
                        req.body.username = req.session.user.firstName;
                        req.body.userimage = req.session.user.image;
                        req.body.email = req.session.user.email;
                        req.body.usermobile = req.session.user.mobile;
                        callSave();
                    } else {
                        res.json({
                            value: false,
                            data: "User not loggd-in"
                        });
                    }
                } else {
                    res.json({
                        value: false,
                        data: "Please provide params"
                    });
                }
            } else {
                if (req.session.user) {
                    req.body.user = req.session.user._id;
                    req.body.username = req.session.user.firstName;
                    req.body.userimage = req.session.user.image;
                    req.body.email = req.session.user.email;
                    req.body.usermobile = req.session.user.mobile;
                    callSave();
                } else {
                    res.json({
                        value: false,
                        data: "User not loggd-in"
                    });
                }
            }

            function callSave() {
                Booking.saveData(req.body, function(err, respo) {
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
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getAll: function(req, res) {
        if (req.body) {
            Booking.getAll(req.body, function(err, respo) {
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
    foundSlot: function(req, res) {
        if (req.body) {
            Booking.foundSlot(req.body, function(err, respo) {
                if (!_.isEmpty(respo)) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            mesg: "This expert is already booked on this time",
                            data: respo
                        });
                    }
                } else {
                    res.json({
                        value: false,
                        mesg: "This expert is available on this time",
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

    getExpertTime: function(req, res) {
        if (req.body) {
            if (req.session.expertuser) {
                req.body.expert = req.session.expertuser._id;
                Booking.getExpertTime(req.body, function(err, respo) {
                    if (err) {
                        console.log(err);
                        callback(err, callback);
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
                    data: "Expert Not Logged in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid request"
            });
        }
    },
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                //  console.log("not valid");
                Booking.deleteData(req.body, function(err, respo) {
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
    getBooking: function(req, res) {
        if (req.body) {
            if (req.session.user) {
                req.body.user = req.session.user._id;
                Booking.getBooking(req.body, function(err, respo) {
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
                    data: "User not Loggedin"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getExpertBooking: function(req, res) {
        if (req.body) {
            if (req.session.expertuser) {
                req.body.expertuser = req.session.expertuser._id;
                Booking.getExpertBooking(req.body, function(err, respo) {
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
                    data: "Expert not Loggedin"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    deleteAll: function(req, res) {
        if (req.body) {
            Booking.deleteAll(req.body, function(err, respo) {
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
    mysend: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                //  console.log("not valid");
                Booking.mysend(req.body, function(err, respo) {
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
    editBooking: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                //  console.log("not valid");
                Booking.editBooking(req.body, function(err, respo) {
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
    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                Booking.getOne(req.body, function(err, respo) {
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
                    data: "User id Invalid"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },

    getLimited: function(req, res) {
        function callback(err, data) {
            Global.response(err, data, res);
        }
        if (req.body) {
            if (req.body.pagesize && req.body.pagenumber) {
                Booking.findLimited(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Invalid Params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    saveBooking: function(req, res) {
        if (req.body) {
            Booking.saveBooking(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
};
