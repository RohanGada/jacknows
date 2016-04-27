/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5 = require('MD5');
var sendgrid = require('sendgrid')('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');


var schema = new Schema({
    name: String,
    email: String,
    password: String,
    facebook: String,
    google: String,
    summary: String,
    experience: String,
    contact: Number,
    forgotId: String,
    firstName: String,
    lastName: String,
    mobile: String,
    additionalInfo: String,
    forgotpassword: String,

    notification: {
        type: [{
            user: String,
            description: String,
            action: String,
            timestamp: Date
        }],
        index: true
    },
    shortList: {
        type: [{
            expertUser: {
                type: Schema.Types.ObjectId,
                ref: 'ExpertUser'
            },
            timestamp: Date
        }],
        index: true
    },
});

module.exports = mongoose.model('User', schema);
var models = {
    register: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        var user = this(data);
        this.count({
            "email": data.email
        }).exec(function(err, data2) {
            if (err) {
                callback(err, data);
            } else {
                if (data2 === 0) {
                    user.save(function(err, data3) {
                        data3.password = '';
                        callback(err, data3);
                    });
                } else {
                    callback("Email already Exists", false);
                }
            }
        });
    },
    editProfile: function(data, callback) {
        delete data.password;
        delete data.forgotpassword;
        this.findOneAndUpdate({
            _id: data._id
        }, data, function(err, data2) {
            if (err) {
                callback(err, false);
            } else {
                data.password = '';
                data.forgotpassword = '';
                callback(null, data);
            }
        });
    },
    saveData: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        var user = this(data);
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
            user.save(function(err, data2) {
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
            _id: 0
        }, {}).populate('expertUser').exec(function(err, deleted) {
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
    changePassword: function(data, callback) {
        data.password = md5(data.password);
        data.changePassword = md5(data.changePassword);
        this.findOneAndUpdate({
            _id: data._id,
            password: data.password
        }, {
            password: data.changePassword
        }, function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(data2)) {
                    callback(null, {});
                } else {
                    data2.password = "";
                    data2.forgotpassword = "";
                    callback(null, data2);
                }
            }
        });
    },
    login: function(data, callback) {
        data.password = md5(data.password);
        User.findOne({
            email: data.email,
            password: data.password
        }, function(err, data2) {
            if (err) {
                console.log(err);
                callback(er, null);
            } else {
                if (_.isEmpty(data2)) {
                    User.findOne({
                        email: data.email,
                        forgotpassword: data.password
                    }, function(err, data4) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            if (_.isEmpty(data4)) {
                                callback(null, {
                                    comment: "User Not Found"
                                });
                            } else {
                                User.findOneAndUpdate({
                                    _id: data4._id
                                }, {
                                    password: data.password,
                                    forgotpassword: ""
                                }, function(err, data5) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        data5.password = "";
                                        data5.forgotpassword = "";
                                        callback(null, data5);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    User.findOneAndUpdate({
                        _id: data2._id
                    }, {
                        forgotpassword: ""
                    }, function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            data3.password = "";
                            data3.forgotpassword = "";
                            callback(null, data3);
                        }
                    });
                }
            }
        });
    },
    forgotPassword: function(data, callback) {
        this.findOne({
            email: data.email
        }, {
            password: 0,
            forgotpassword: 0
        }, function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    if (!found.oauthLogin[0]) {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 8; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var encrypttext = md5(text);
                        this.findOneAndUpdate({
                            _id: found._id
                        }, {
                            forgotpassword: encrypttext
                        }, function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                sendgrid.send({
                                    to: found.email,
                                    from: "info@wohlig.com",
                                    subject: "One Time Password For Blazen",
                                    html: "<html><body><p>Dear " + found.name + ",</p><p>Your One Time Password for Blazen is " + text + "</p></body></html>"
                                }, function(err, json) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, {
                                            comment: "Mail Sent"
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, {
                            comment: "User logged in through social login"
                        });
                    }
                } else {
                    callback(null, {
                        comment: "User not found"
                    });
                }
            }
        });
    },
    getShortlist:function(data,callback){
      //var name=firstName+" "+lastName;
        User.findOne({
          _id:data._id
        },{
          _id:0,
          password:0,
          forgotpassword:0
        }).populate("shortList.expertUser", '-_id -password -forgotpassword -__v -bankDetails').exec(callback);
    }
};
module.exports = _.assign(module.exports, models);
