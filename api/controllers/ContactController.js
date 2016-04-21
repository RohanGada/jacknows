/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            Contact.saveData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
};
