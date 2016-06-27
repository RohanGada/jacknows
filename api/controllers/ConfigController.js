/**
 * ConfigController
 *
 * @description :: Server-side logic for managing Configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var moment = require('moment');
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
        Booking.find({
            $or: [{
                callTime: {
                    $gt: moment(new Date()).add(1, 'days').seconds(0)._d,
                    $lte: moment(new Date()).add(1, 'days').add(1, 'minutes').seconds(0)._d
                }
            }, {
                callTime: {
                    $gt: moment().add(1, 'hours').seconds(0),
                    $lte: moment().add(1, 'hours').add(5, 'minutes').seconds(0)
                }
            }, {
                callTime: {
                    $gt: moment().seconds(0),
                    $lte: moment().add(5, 'minutes').seconds(0)
                }
            }]
        }).populate("user", "-_id firstName mobile email").populate("expert", "-_id firstName mobileno email").lean().exec(function(err, data2) {
            if (err) {
                console.log(err);
                res.json({ value: false, data: err });
            } else if (data2 && data2.length > 0) {
                res.json({ value: true, data: data2 });
                // var time = {};
                // var days = "";
                // var date = "";
                // time.email = data2.expert.email;
                // time.timestamp = moment().format("MMM DD YYYY");
                // time.time = moment().format("HH.mm A");
                // time.subject = "Call Reminder";
                // time.name = data2.expert.firstName;
                // time.content = "";
                // time.mobile = data2.expert.mobileno;
            } else {
                console.log("No calls found");
                res.json({ value: false, data: { message: "No data found" } });
            }
        });
    },
};
