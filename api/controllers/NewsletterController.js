/**
 * NewsletterController
 *
 * @description :: Server-side logic for managing Newsletters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sendgrid = require('sendgrid')('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');
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            Newsletter.saveData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getAll: function(req, res) {
        if (req.body) {
            Newsletter.getAll(req.body, function(err, respo) {
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
                Newsletter.deleteData(req.body, function(err, respo) {
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
    newsletterApi: function(req, res) {

        if (req.body) {
            if (req.body.email && req.body.email != "") {
                Newsletter.newsletterApi(req.body, res.callback);
                console.log('in if');
            } else {
                res.json({
                    value: false,
                    data: "please provide email id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }

    },
    //if (req.body.email && req.body.email != "") {
    send: function(req, res) {
        sendgrid.send({
            to: req.body.email,
            from: "info@wohlig.com",
            subject: "Jacknows Newsletter",
            html: "<html><body><p>Hi ,</p><p>This mail is from Jacknows Newsletter </p></body></html>"
        }, function(err, json) {
            if (err) {
                res.json({
                    value: false
                });
            } else {
                res.json({
                    value: "Message Sent"
                });
            }
        });
    },
    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                Newsletter.getOne(req.body, function(err, respo) {
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
                Newsletter.findLimited(req.body, res.callback);
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

};
