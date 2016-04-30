/**
 * ExpertUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var md5 = require('MD5');

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
    image: String,
    descriptionAndSkills: String,
    category: String,
    salesPitch: String,

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
    priceForService: String,
    //     }],
    //     index: true
    // },
    educationalQualification: {
        type: [{
            degreeTitle: String,
            instituteName: String,
            city: String,
            country: String,
            yearOfPassing: Date
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

    register: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = md5(data.password);
        }
        data.name = data.firstName + " " + data.lastName;
        var expertuser = this(data);
        this.count({
            "email": data.email
        }).exec(function(err, data2) {
            if (err) {
                callback(err, data);
            } else {
                if (data2 === 0) {
                    expertuser.save(function(err, data3) {
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
            email: data.email,
            password: data.password
        }, function(err, data2) {
            if (err) {
                console.log(err);
                callback(er, null);
            } else {
                if (_.isEmpty(data2)) {
                    ExpertUser.findOne({
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
        var check = new RegExp(data.search, "i");
        ExpertUser.find({
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
            }]
        }, {
            password: 0,
            forgotpassword: 0
        }, function(err, data3) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (data3.length > 0) {
                    callback(null, data3);
                } else {
                    callback(null, []);
                }
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
