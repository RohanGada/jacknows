/**
 * Newsletter.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sendgrid = require('sendgrid')('');

var schema = new Schema({
    email: String,
    timestamp: Date,
    status: String
});
module.exports = mongoose.model('Newsletter', schema);
var models = {
    saveData: function(data, callback) {
        var newsletter = this(data);
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
            newsletter.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }

    },
    getAll: function(data, callback) {
        this.find({}, {
            // _id: 0
        }, {}).populate('expertUser').exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    newsletterApi: function(data, callback) {
        var newsletter = this(data);
        newsletter.timestamp = new Date();
        newsletter.email = data.email;
        console.log(data);
        Newsletter.findOne({
            "email": newsletter.email
        }).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                newsletter.save(function(err, newsletter) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var emailData = {};
                        emailData.email = data.email;
                        console.log('data.email', data.email);
                        emailData.content = "Newsletter demo.";
                        emailData.filename = "newsletter.ejs";
                        emailData.subject = "Jacknows Newsletter";
                        Config.email(emailData, function(err, emailRespo) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                console.log(emailRespo);
                                callback(null, {
                                    comment: "Mail Sent"
                                });
                            }
                        });
                    }
                });
            } else {
                callback(null, {
                    message: "User Already Exist"
                });
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

    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    Newsletter.count({
                        email: {
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
                    Newsletter.find({
                        email: {
                            '$regex': check
                        }
                    }, {
                        password: 0
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
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
};
module.exports = _.assign(module.exports, models);
