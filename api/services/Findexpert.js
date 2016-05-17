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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

});
module.exports = mongoose.model('Findexpert', schema);
var models = {

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
            findexpert.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }

    },
};
module.exports = _.assign(module.exports, models);
