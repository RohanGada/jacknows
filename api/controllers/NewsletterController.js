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

};
