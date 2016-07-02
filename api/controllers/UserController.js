/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sendgrid = require('sendgrid')('');
// var redirect="http://146.148.4.222/test";
var redirect = "http://localhost:8080/#/home";
var redirect = "http://wohlig.co.in/jacknows/";
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            User.saveData(req.body, function(err, respo) {
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
            User.getAll(req.body, function(err, respo) {
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
    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                User.getOne(req.body, function(err, respo) {
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                //	console.log("not valid");
                User.deleteData(req.body, function(err, respo) {
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
    profile: function(req, res) {
        var user = req.session.user;
        if (user) {
            res.json(user);
        } else {
            res.json({});
        }
    },
    register: function(req, res) {
        var callback = function(err, data) {
            if (err || _.isEmpty(data)) {
                res.json({
                    error: err,
                    value: false
                });
            } else {
                req.session.user = data;

                res.json({
                    data: "User Registered",
                    value: true
                });
            }
        };
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                User.register(req.body, callback);
            } else {
                res.json({
                    value: false,
                    data: "Invalid params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    editProfile: function(req, res) {
        var callback = function(err, data) {
            if (err || _.isEmpty(data)) {
                res.json({
                    error: err,
                    value: false
                });
            } else {
                req.session.user = data;
                res.json({
                    data: "Profile Edited",
                    value: true
                });
            }
        };
        if (req.body) {
            if (req.session.user) {
                req.body._id = req.session.user._id;
                User.editProfile(req.body, callback);
            } else {
                res.json({
                    value: false,
                    data: "User not loggd-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    login: function(req, res) {
        var callback = function(err, data) {
            if (err || _.isEmpty(data)) {
                res.json({
                    error: err,
                    value: false
                });
            } else {
                if (data._id) {
                    req.session.user = data;

                    res.json({
                        data: "Login Successful",
                        value: true
                    });
                } else {
                    req.session.user = {};

                    res.json({
                        data: {},
                        value: false
                    });
                }
            }
        }
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                User.login(req.body, callback);
            } else {
                res.json({
                    data: "Please provide params",
                    value: true
                });
            }
        } else {
            res.json({
                data: "Invalid Call",
                value: true
            });
        }
    },
    logout: function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                res.json({
                    value: false,
                    error: err
                });
            } else {
                setTimeout(function() {
                    res.json({
                        value: true
                    });
                }, 3000);
            }
        });
    },
    changePassword: function(req, res) {
        if (req.body) {
            if (req.session.user) {
                req.body._id = req.session.user._id;
                if (req.body.password && req.body.password != "" && req.body.changePassword && req.body.changePassword != "") {
                    User.changePassword(req.body, function(err, data2) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: false,
                                data: err
                            });
                        } else {
                            if (data2.email) {
                                res.json({
                                    value: true,
                                    data: data2
                                });
                            } else {
                                res.json({
                                    value: false,
                                    data: {}
                                });
                            }
                        }
                    });
                } else {
                    res.json({
                        value: false,
                        data: "Invalid Params"
                    });
                }
            } else {
                res.json({
                    value: false,
                    data: "User not loggd-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    forgotPassword: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                User.forgotPassword(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Please provide email-id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    },
    getShortlist: function(req, res) {
        if (req.body) {
            if (req.session.user) {
                req.body._id = req.session.user._id;
                User.getShortlist(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "User not loggd-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    },
    getFindExpert: function(req, res) {
        if (req.body) {
            if (req.session.user) {
                req.body._id = req.session.user._id;
                User.getFindExpert(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "User not loggd-in"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    },
    loginGoogle: function(req, res) {
        passport.authenticate('google', {
            scope: "openid profile email"
        })(req, res);
    },
    loginGoogleCallback: function(req, res) {
        var callback = function(err, data) {
            if (err || _.isEmpty(data)) {
                res.json({
                    error: err,
                    value: false
                });
            } else {
                if (data._id) {
                    req.session.user = data;
                    req.session.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.redirect(redirect);
                        }
                    });
                } else {
                    res.json({
                        data: "User not found",
                        value: false
                    });
                }
            }
        }
        passport.authenticate('google', {
            failureRedirect: '/login'
        }, callback)(req, res);
    },
    loginFacebook: function(req, res) {
        var callback = function(err, data) {
            if (err || _.isEmpty(data)) {
                res.json({
                    error: err,
                    value: false
                });
            } else {
                if (data._id) {
                    req.session.user = data;
                    req.session.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.redirect(redirect);
                        }
                    });
                } else {
                    res.json({
                        data: "User not found",
                        value: false
                    });
                }
            }
        };
        passport.authenticate('facebook', {
            scope: ['public_profile', 'user_friends', 'email']
        }, callback)(req, res);
    },

    // send: function(req, res) {
    //     sendgrid.send({
    //         to: req.body.email,
    //         from: "info@wohlig.com",
    //         subject: "Welcome to Jacknows",
    //         html: "<html><body><p>Hi ,</p><p>Welcome to Jacknows </p></body></html>"
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

};
