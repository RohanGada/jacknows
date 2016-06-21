/**
 * ExpertUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5 = require('MD5');
var sendgrid = require('sendgrid')('');

var schema = new Schema({
    name: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    name: String,
    age: String,
    gender: String,
    mobileno: String,
    addressDetails: String,
    callTime: String,
    image: {
        type: String,
        default: ""
    },
    descriptionAndSkills: String,
    category: String,
    salesPitch: String,
    city: String,

    accountHolderName: String,
    bankName: String,
    typeOfAccount: String,
    branchAddress: String,
    accountNo: String,
    code: String,
    accountHolderAddress: String,


    // professionalDetails: {
    //     type: [{
    // professionalInfo: {
    //     type: [{
    areaOfExpertise: String,
    specilization: String,
    description: String,
    priceForService: Number,
    //     }],
    //     index: true
    // },
    educationalQualification: {
        type: [{
            degreeTitle: String,
            instituteName: String,
            city: String,
            country: String,
            yearOfPassing: String
        }],
        index: true
    },
    experience: Schema.Types.Mixed,
    awards: {
        type: [{
            awardsandhonors: String,
        }],
        index: true
    },
    videoLinks: {
        type: [{
            name: String,
        }],
        index: true
    },
    addPhotos: {
        type: [{
            image2: String
        }],
        index: true
    },
    publicationLinks: {
        type: [{
            name: String,
        }],
        index: true
    },

    //     }],
    //     index: true
    // },
    unavailableSettings: Schema.Types.Mixed,
    customSettings: Schema.Types.Mixed,
    callSettings: Schema.Types.Mixed,
    // bankDetails: {
    //     type: [{
    //         accountHolderName: String,
    //         bankName: String,
    //         typeOfAccount: String,
    //         branchAddress: String,
    //         accountNo: String,
    //         code: String,
    //         accountHolderAddress: String
    //     }],
    //     index: true
    // },
    // expertRegistration: {
    //     type: [{
    //         fName: String,
    //         lName: String,
    //         emailid: String,
    //         mobile: String,
    //         pswd: String,
    //         //confirmPswd: String,
    //         age: String,
    //         sex: String
    //     }],
    //     index: true
    // },
    image: String,
});
module.exports = mongoose.model('ExpertUser', schema);
var models = {

    // register: function(data, callback) {
    //     if (data.password && data.password != "") {
    //         data.password = md5(data.password);
    //     }
    //     data.name = data.firstName + " " + data.lastName;
    //     var expertuser = this(data);
    //     this.count({
    //         "email": data.email
    //     }).exec(function(err, data2) {
    //         if (err) {
    //             callback(err, data);
    //         } else {
    //             if (data2 === 0) {
    //                 expertuser.save(function(err, data3) {
    //                     data3.password = '';
    //                     callback(err, data3);
    //                 });
    //             } else {
    //                 callback("Email already Exists", false);
    //             }
    //         }
    //     });
    // },
    register: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        data.name = data.firstName + " " + data.lastName;
        var expertuser = this(data);
        expertuser.email = data.email;
        this.count({
          $or:[{"email": data.email},{"mobileno": data.mobileno}]

        }).exec(function(err, data2) {
            if (err) {
                callback(err, data);
            } else {
                if (data2 === 0) {
                    expertuser.save(function(err, data3) {
                        data3.password = '';
                        if (err) {
                            callback(err, null);
                        } else {
                            var emailData = {};
                            emailData.email = data.email;
                            emailData.filename = 'dummy.ejs';
                            emailData.name = data.firstName;
                            emailData.content = "Thank you for sharing your details with us. Our expert on-boarding team will get back to you at the earliest."
                            emailData.timestamp = new Date();
                            emailData.subject = "Signup in Jacknows";
                            Config.email(emailData, function(err, emailRespo) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(emailRespo);
                                    callback(null, data3);
                                }
                            });
                            // sendgrid.send({
                            //     to: expertuser.email,
                            //     from: "info@wohlig.com",
                            //     subject: "Welcome to Jacknows",
                            //     html: "<html><body><p>Hi,</p><p>Welcome to Jacknows</p></body></html>"
                            // }, function(err, json) {
                            //     if (err) {
                            //         callback(err, null);
                            //     } else {
                            //         console.log(json);
                            //         callback(null, data3);
                            //
                            //     }
                            // });

                        }
                        // callback(err, data3);
                    });
                } else {
                    callback("Expert already Exists", false);
                }

            }
        });
    },
    editProfile: function(data, callback) {
        delete data.password;
        delete data.forgotpassword;
        if (data.firstName && data.firstName != "" && data.lastName && data.lastName) {
            data.name = data.firstName + " " + data.lastName;
        }
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
        ExpertUser.findOne({
            $or: [{
                mobileno: data.email
            }, {
                email: data.email
            }],
            password: data.password
        }, function(err, data2) {
            if (err) {
                console.log(err);
                callback(er, null);
            } else {
                if (_.isEmpty(data2)) {
                    ExpertUser.findOne({
                        $or: [{
                            mobileno: data.email
                        }, {
                            email: data.email
                        }],
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
                                ExpertUser.findOneAndUpdate({
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
                    ExpertUser.findOneAndUpdate({
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

    saveData: function(data, callback) {
        //delete data.forgotpassword;
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        var expertuser = this(data);
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
            this.count({
                "email": data.email
            }).exec(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    if (data2 === 0) {
                        expertuser.save(function(err, data3) {
                            data3.password = '';
                            callback(null, data3);
                        });
                    } else {
                        callback("Email already Exists", false);
                    }
                }
            });
        }
    },
    getAll: function(data, callback) {
        this.find({}, {}, {}, function(err, deleted) {
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
    searchData: function(data, callback) {
        var check = new RegExp([data.search], "i");
        // var check = new RegExp(data.search, "[data.search]");
        var newreturns = {};
        newreturns.arr = {};
        newreturns.arr.expertise = [];
        newreturns.arr.location = [];
        SearchLog.updateLog(data, function(error, respo) {
            if (error) {
                console.log(error);
                callback(error, null)
            } else {
                if (!data.minprice || data.minprice == "") {
                    data.minprice = 0;
                } else {
                    data.minprice = parseInt(data.minprice);
                }
                if (!data.maxprice || data.maxprice == "") {
                    data.maxprice = 0;
                } else {
                    data.maxprice = parseInt(data.maxprice);
                }
                var matchobj = {
                    $or: [{
                        name: {
                            '$regex': check
                        }
                    }, {
                        descriptionAndSkills: {
                            '$regex': check
                        }
                    }, {
                        areaOfExpertise: {
                            '$regex': check
                        }
                    }],
                    city: {
                        $in: data.location
                    },
                    areaOfExpertise: {
                        $in: data.areaofexpert
                    },
                    priceForService: {
                        $gte: data.minprice,
                        $lte: data.maxprice
                    }
                };
                if (!data.location || (data.location && data.location.length == 0)) {
                    delete matchobj["city"];
                }
                if (!data.areaofexpert || (data.areaofexpert && data.areaofexpert.length == 0)) {
                    delete matchobj["areaOfExpertise"];
                } else {
                    matchobj["$or"].splice(2, 1);
                }
                if (data.minprice == 0 && data.maxprice == 0) {
                    delete matchobj["priceForService"];
                }
                // callback(null, matchobj);
                ExpertUser.find(matchobj, {
                    password: 0,
                    forgotpassword: 0
                }, function(err, data3) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        if (data3.length > 0) {
                            newreturns.data = data3;
                            _.each(data3, function(z) {
                                if (z.areaOfExpertise && z.areaOfExpertise != "") {
                                    var index = newreturns.arr.expertise.indexOf(z.areaOfExpertise);
                                    if (index == -1)
                                        newreturns.arr.expertise.push(z.areaOfExpertise);
                                }
                                if (z.city && z.city != "") {
                                    var index = newreturns.arr.location.indexOf(z.city);
                                    if (index == -1)
                                        newreturns.arr.location.push(z.city);
                                }
                            });
                            callback(null, newreturns);
                        } else {
                            callback(null, []);
                        }
                    }
                });
            }
        });

    },

    getOne: function(data, callback) {
        ExpertUser.findOne({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },

};
module.exports = _.assign(module.exports, models);
