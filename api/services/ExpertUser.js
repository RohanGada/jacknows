/**
 * ExpertUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    mobileno: String,
    addressDetails: String,
    experience: String,
    qualification: Number,
    professionalDetails: {
        type: [{
            professionalInfo: {
                type: [{
                    areaOfExpertise: String,
                    specilization: String,
                    description: String,
                    priceForService: String
                }],
                index: true
            },
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
            experience: {
                type: [{
                    companyName: String,
                    jobTitle: String,
                    jobDescription: String,
                    startDate: Date,
                    endDate: Date,
                    image: String
                }],
                index: true
            },
            awards: {
                type: [{
                    awardsandhonors: String,
                }],
                index: true
            },
            videoLinks: {
                type: [{
                    videoLink: String,
                }],
                index: true
            },
            addPhotos: {
                type: [{
                    image: String
                }],
                index: true
            },
            publicationLinks: {
                type: [{
                    publicationLink: String,
                }],
                index: true
            },

        }],
        index: true
    },
    callSettings: {
        type: [{
            date: Date,
            time: Date
        }],
        index: true
    },
    bankDetails: {
        type: [{
            accountHolderName: String,
            bankName: String,
            typeOfAccount: String,
            branchAddress: String,
            accountNo: String,
            code: String,
            accountHolderAddress: String
        }],
        index: true
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
    image: String,
});
module.exports =mongoose.model('ExpertUser', schema);
var models = {

  saveData:function(data, callback)  {
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
      expertuser.timestamp=new Date();
        expertuser.save(function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data2);
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
  deleteData:function(data,callback){
    this.findOneAndRemove({
      _id:data._id
    },function(err,deleted){
      if(err){
        callback(err,null)
      }else{
        callback(null,deleted)
      }
    });
  },

};
module.exports = _.assign(module.exports, models);
