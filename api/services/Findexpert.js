/**
 * Findexpert.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    category: String,
    query: String,
    email:String,
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },

});
module.exports = mongoose.model('Findexpert', schema);
var models = {

    // saveData: function(data, callback) {
    //     var findexpert = this(data);
    //     if (data._id) {
    //         this.findOneAndUpdate({
    //             _id: data._id
    //         }, data, function(err, data2) {
    //             if (err) {
    //                 callback(err, null);
    //             } else {
    //                 callback(null, data2);
    //             }
    //         });
    //     } else {
    //         findexpert.save(function(err, data2) {
    //             if (err) {
    //                 callback(err, null);
    //             } else {
    //                 callback(null, data2);
    //             }
    //         });
    //     }
    //
    // },
    saveData: function(data, callback) {
        var findexpert = this(data);
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
            findexpert.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    //  callback(null, data2);
                    var emailData = {};
                    emailData.email = "chaitalee.wohlig@gmail.com";
                    console.log('data.email', emailData.email);
                    emailData.content = "Hi, thanks for reaching out! This is an auto-generated response to let you know that we have received your query and will get back to you shortly.We appreciate your interest.";
                    emailData.filename = "newsletter.ejs";
                    emailData.subject = "Jacknows Query Response";
                    // user.email = data.email;
                    // user.filename = data.filename;
                    Config.email(emailData, function(err, emailRespo) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            console.log(emailRespo);
                            callback(null, data2);
                            // callback(null, {
                            //     comment: "Mail Sent"
                            // });
                        }
                    });
                }
            });
        }

    },
    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    Findexpert.count({
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
                    Findexpert.find({
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

    getOne: function(data, callback) {
        Findexpert.findOne({
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
};
module.exports = _.assign(module.exports, models);
