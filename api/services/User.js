/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5 = require('MD5');
var moment = require('moment');


var schema = new Schema({
    isVerify: {
        type: Boolean,
        default: false
    },
    verifyemail: String,
    verifyotp: {
        type: Boolean,
        default: false
    },
    forVerification: {
        type: Boolean,
        default: false
            //value:"false"
    },
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
    agreeTerms: Boolean,
    image: {
        type: String,
        default: ""
    },
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
    findCategory: {
        type: [{
            expertCategory: String,
            query: String
        }],
        index: true
    },
    oauthLogin: {
        type: [{
            socialProvider: String,
            socialId: String,
            modificationTime: Date
        }],
        index: true
    },



});

module.exports = mongoose.model('User', schema);
var models = {
    // register: function(data, callback) {
    //     if (data.password && data.password != "") {
    //         data.password = md5(data.password);
    //     }
    //     var user = this(data);
    //     this.count({
    //         "email": data.email
    //     }).exec(function(err, data2) {
    //         if (err) {
    //             callback(err, data);
    //         } else {
    //             if (data2 === 0) {
    //                 user.save(function(err, data3) {
    //                     data3.password = '';
    //                     callback(err, data3);
    //                 });
    //             } else {
    //                 callback("Email already Exists", false);
    //             }
    //         }
    //     });
    // },

    // register: function(data, callback) {
    //     if (data.password && data.password != "") {
    //         data.password = md5(data.password);
    //     }
    //     var user = this(data);
    //     user.email = data.email;
    //     this.count({
    //         "email": user.email
    //     }).exec(function(err, data2) {
    //         if (err) {
    //             callback(err, data);
    //         } else {
    //             if (data2 === 0) {
    //                 console.log(data2);
    //                 user.save(function(err, data3) {
    //                     data3.password = '';
    //                     if (err) {
    //                         callback(err, null);
    //                     } else {
    //                         var emailData = {};
    //                         emailData.email = data.email;
    //                         emailData.name = data.firstName;
    //                         emailData.content = "Thank you for signing up with us! We hope you have a great experience on this platform. Please take a moment to leave your feedback.";
    //                         emailData.filename = "dummy.ejs";
    //                         emailData.subject = "Signup in Jacknows";
    //                         Config.email(emailData, function(err, emailRespo) {
    //                             if (err) {
    //                                 console.log(err);
    //                                 callback(err, null);
    //                             } else {
    //                                 console.log(emailRespo);
    //                                 callback(null, data3);
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 callback("User already Exists", false);
    //             }
    //         }
    //     });
    // },


    register: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        var user = this(data);
        user.email = data.email;
        this.count({
            "email": user.email
        }).exec(function(err, data2) {
            if (err) {
                callback(err, data);
            } else {
                // console.log(_.isEmpty(data));
                if (data2 == 0) {
                    user.save(function(err, data3) {
                        // data3.password = '';
                        if (err) {
                            callback(err, null);
                        } else {
                            var text = "";
                            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                            for (var i = 0; i < 12; i++) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length));
                            }
                            user.verifyemail = md5(text);
                            var emailData = {};
                            emailData.email = data.email;
                            emailData.filename = "dummy.ejs";
                            emailData.name = data.firstName;
                            var encryptVerEm = text + "00x00" + ExpertUser.encrypt(data.email, 9);
                            console.log(encryptVerEm);
                            emailData.link = "http://localhost:8080/#/verifyemail/" + encryptVerEm;
                            emailData.content = "Thank you for signing up with us! We hope you have a great experience on this platform. Please take a moment to leave your feedback.Please click on the button below to verify your email :" + emailData.link;
                            emailData.subject = "Signup in Jacknows with Email Verification";

                            Config.email(emailData, function(err, emailRespo) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    // callback(null, data3);
                                    Otp.saveData({
                                        contact: user.mobileno
                                    }, function(err, data) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (data) {
                                            user.save(function(err, data3) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    callback(null, data3);
                                                }
                                            });
                                        } else {
                                            callback(null, data);
                                        }
                                    });
                                }
                            });
                            // ExpertUser.findOneAndUpdate({
                            //     _id: data3._id,
                            // }, {
                            //     text: ''
                            // }, function(err, data12) {
                            //     if (err) {
                            //         callback(err, null);
                            //     } else {
                            //
                            //         callback(null, data12);
                            //
                            //     }
                            // });
                        }
                    });

                } else {
                    callback({
                        message: "Expert already Exists"
                    }, false);
                }
            }
        });
    },
    encrypt: function(plaintext, shiftAmount) {
        var ciphertext = "";
        for (var i = 0; i < plaintext.length; i++) {
            var plainCharacter = plaintext.charCodeAt(i);
            if (plainCharacter >= 97 && plainCharacter <= 122) {
                ciphertext += String.fromCharCode((plainCharacter - 97 + shiftAmount) % 26 + 97);
            } else if (plainCharacter >= 65 && plainCharacter <= 90) {
                ciphertext += String.fromCharCode((plainCharacter - 65 + shiftAmount) % 26 + 65);
            } else {
                ciphertext += String.fromCharCode(plainCharacter);
            }
        }
        return ciphertext;
    },
    decrypt: function(ciphertext, shiftAmount) {
        var plaintext = "";
        for (var i = 0; i < ciphertext.length; i++) {
            var cipherCharacter = ciphertext.charCodeAt(i);
            if (cipherCharacter >= 97 && cipherCharacter <= 122) {
                plaintext += String.fromCharCode((cipherCharacter - 97 - shiftAmount + 26) % 26 + 97);
            } else if (cipherCharacter >= 65 && cipherCharacter <= 90) {
                plaintext += String.fromCharCode((cipherCharacter - 65 - shiftAmount + 26) % 26 + 65);
            } else {
                plaintext += String.fromCharCode(cipherCharacter);
            }
        }
        return plaintext;
    },

    // emailVerification: function(data, callback) {
    //     var splitIt = data.verifyemail.split("00x00");
    //     var verify = splitIt[0];
    //     var email = "";
    //     if (splitIt[1]) {
    //         email = User.decrypt(splitIt[1], 9);
    //     }
    //     User.findOneAndUpdate({
    //         verifyemail: md5(verify),
    //         email: email
    //     }, {
    //         $set: {
    //             "verifyemail": "",
    //             "isVerify":true
    //         }
    //     }, function(err, data2) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             console.log(data2);
    //             if (!data2 && _.isEmpty(data2)) {
    //                 callback("User already verified", null);
    //             } else {
    //                 // if (data2.verifyotp !== true) {
    //                 //     callback("Please complete mobile verification", null);
    //                 // } else {
    //                     var updated = data2.toObject();
    //                     updated.verifyemail = "";
    //                     delete updated._id;
    //                     User.saveData(updated, function(err, data2) {
    //                         if (err) {
    //                             console.log(err);
    //                             callback(err, null);
    //                         } else {
    //                             console.log(data2);
    //
    //                             callback(null, data2);
    //                         }
    //                     });
    //                 // }
    //             }
    //         }
    //     });
    //
    // },

    emailVerification: function(data, callback) {
        var splitIt = data.verifyemail.split("00x00");
        var verify = splitIt[0];
        var email = "";
        if (splitIt[1]) {
            email = User.decrypt(splitIt[1], 9);
        }
        console.log("email", email);
        User.findOneAndUpdate({
            verifyemail: md5(verify),
            email: email
        }, {
            $set: {
                "verifyemail": "",
                "isVerify": true
            }
        }, function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                console.log(data2);
                if (!data2 && _.isEmpty(data2)) {
                    callback("User already verified", null);
                } else {
                    // if (data2.verifyotp !== true) {
                    //     callback("Please complete mobile verification", null);
                    // } else {
                    var updated = data2.toObject();
                    updated.verifyemail = "";
                    delete updated._id;
                    User.saveData(updated, function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            console.log(data2);

                            callback(null, data2);
                        }
                    });
                    // }
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
            // _id: 0
        }, {}).populate('expertUser').exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getOne: function(data, callback) {
        this.findOne({
            _id: data._id
        }, {
            password: 0,
            forgotpassword: 0
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null)
            } else {
                callback(null, data2);
            }
        });
    },
    // getOne: function(data, callback) {
    //     this.findOne({}, {
    //
    //     }, {}).exec(function(err, deleted) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             callback(null, deleted);
    //         }
    //     });
    // },
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
        // data.password = md5(data.password);
        data.changePassword = md5(data.changePassword);
        this.findOneAndUpdate({
            _id: data._id,
            // password: data.password
        }, {
            password: data.changePassword
        }).lean().exec(function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(data2)) {
                    callback(null, {});
                } else {
                    delete data2.password;
                    delete data2.forgotpassword;
                    delete data2._id;
                    callback(null, data2);
                }
            }
        });
    },
    // changePassword: function(data, callback) {
    //     data.password = md5(data.password);
    //     data.changePassword = md5(data.changePassword);
    //     this.findOneAndUpdate({
    //         _id: data._id,
    //         password: data.password
    //     }, {
    //         password: data.changePassword
    //     }).lean().exec(function(err, data2) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             if (_.isEmpty(data2)) {
    //                 callback(null, {});
    //             } else {
    //                 delete data2.password;
    //                 delete data2.forgotpassword;
    //                 delete data2._id;
    //                 callback(null, data2);
    //             }
    //         }
    //     });
    // },
    login: function(data, callback) {
        data.password = md5(data.password);
        User.findOne({
            email: data.email,
            password: data.password
            // ,
            // isVerify: true
        }).exec(function(err, res) {
          console.log(err,'1515');
            if (err) {
                callback(err, null);
            } else {
                if (res) {
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
                } else {
                    callback(null, {
                        comment: "User not Verified"
                    });
                }
            }
        })

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
                    if (!found.oauthLogin || (found.oauthLogin && found.oauthLogin.length <= 0)) {
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
                                var emailData = {};
                                emailData.email = data.email;
                                console.log('data.email', data.email);
                                emailData.content = "Your new password for the JacKnows website is: " + text + ".Please note that this is a system generated password which will remain valid for 3 hours only. Kindly change it to something you would be more comfortable remembering at the earliest.";
                                emailData.filename = "newsletter.ejs";
                                emailData.subject = "Jacknows forgot password";
                                // user.email = data.email;
                                // user.filename = data.filename;
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
    getShortlist: function(data, callback) {
        //var name=firstName+" "+lastName;
        User.findOne({
            _id: data._id
        }, {
            _id: 0,
            password: 0,
            forgotpassword: 0
        }).populate("shortList.expertUser", '-password -forgotpassword -__v -bankDetails').exec(callback);
    },
    getFindExpert: function(data, callback) {
        //var name=firstName+" "+lastName;
        User.findOne({
            _id: data._id
        }, {
            _id: 0,
            password: 0,
            forgotpassword: 0
        }).populate("findCategory.category").exec(callback);
    },

    getLimited: function(data, callback) {
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        var checkfor = new RegExp(data.search, "i");
        var newreturns = {};
        newreturns.data = [];
        async.parallel([
            function(callback1) {
                User.count({
                    email: {
                        "$regex": checkfor
                    }
                }).exec(function(err, number) {
                    if (err) {
                        console.log(err);
                        callback1(err, null);
                    } else if (number) {
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callback1(null, newreturns);
                    } else {
                        newreturns.totalpages = 0;
                        callback1(null, newreturns);
                    }
                });
            },
            function(callback1) {
                User.find({
                    email: {
                        "$regex": checkfor
                    }
                }, {}).sort({
                    email: 1
                }).lean().exec(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback1(err, null);
                    } else {
                        console.log(data2.length);
                        if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            newreturns.pagenumber = data.pagenumber;
                            callback1(null, newreturns);
                        } else {
                            callback1({
                                message: "No data found"
                            }, null);
                        }
                    }
                });
            }
        ], function(err, respo) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, newreturns);
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
                    User.count({
                        firstName: {
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
                    User.find({
                        firstName: {
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
