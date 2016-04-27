/**
 * ExpertUserController
 *
 * @description :: Server-side logic for managing Expertusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            ExpertUser.saveData(req.body, function(err, respo) {
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
            ExpertUser.getAll(req.body, function(err, respo) {
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
                ExpertUser.deleteData(req.body, function(err, respo) {
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
        var expertuser = req.session.expertuser;
        if (expertuser) {
            res.json(expertuser);
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
                req.session.expertuser = data;
                res.json({
                    data: "Expert Registered",
                    value: true
                });
            }
        };
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                ExpertUser.register(req.body, callback);
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
                req.session.expertuser = data;
                res.json({
                    data: "Profile Edited",
                    value: true
                });
            }
        };
        if (req.body) {
            console.log(req.body);
            if (req.session.expertuser) {
                req.body._id = req.session.expertuser._id;
                ExpertUser.editProfile(req.body, callback);
            } else {
                res.json({
                    value: false,
                    data: "Expert not loggd-in"
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
                    req.session.expertuser = data;

                    res.json({
                        data: "Login Successful",
                        value: true
                    });
                } else {
                    req.session.expertuser = {};

                    res.json({
                        data: {},
                        value: false
                    });
                }
            }
        }
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                ExpertUser.login(req.body, callback);
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

    changePassword: function(req, res) {
        if (req.body) {
            if (req.session.expertuser) {
                req.body._id = req.session.user._id;
                if (req.body.password && req.body.password != "" && req.body.changePassword && req.body.changePassword != "") {
                    ExpertUser.changePassword(req.body, res.callback);
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

    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                ExpertUser.getOne(req.body, function(err, respo) {
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
