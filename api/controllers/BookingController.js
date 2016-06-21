/**
 * BookingController
 *
 * @description :: Server-side logic for managing Bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sendgrid = require('sendgrid')('');

module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                if (req.body.from == "expert") {
                    req.body.expertname = req.session.expertuser.name;
                    req.body.expertimage = req.session.expertuser.image;
                    req.body.email = req.session.expertuser.email;
                    callSave();
                } else if (req.body.from == "user") {
                    req.body.user = req.session.user._id;
                    req.body.username = req.session.user.firstName + " " + req.session.user.lastName;
                    req.body.userimage = req.session.user.image;
                    req.body.email = req.session.user.email;
                    req.body.mobile = req.session.user.mobile;
                    callSave();
                } else {
                    res.json({
                        value: false,
                        data: "Please provide params"
                    });
                }
            } else {
                if (req.session.user) {
                    req.body.user = req.session.user._id;
                    req.body.username = req.session.user.firstName + " " + req.session.user.lastName;
                    req.body.userimage = req.session.user.image;
                    req.body.email = req.session.user.email;
                    req.body.mobile = req.session.user.mobile;
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                //	console.log("not valid");
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


    // send: function(req, res) {
    //   var fname = req.session.firstname;
    //   var lname = req.session.lasttname;
    //     sendgrid.send({
    //         to: req.session.email,
    //         from: "info@wohlig.com",
    //         subject: "Booking status for Jacknows",
    //         html: "<html><body><p>Hi,</p><p>Your booking status for Jacknows is </p></body></html>"
    //     }, function(err, json) {
    //         if (err) {
    //             res.json({
    //                 value: false
    //             });
    //         } else {
    //             res.json({
    //                 value: "Message Sent"
    //             });
    //         }
    //     });
    // },
    //
    mysend: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                //	console.log("not valid");
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
};
