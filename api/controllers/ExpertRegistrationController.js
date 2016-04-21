/**
 * ExpertRegistrationController
 *
 * @description :: Server-side logic for managing expertregistrations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 module.exports = {
     saveData: function(req, res) {
         if (req.body) {
             ExpertRegistration.saveData(req.body, res.callback);
         } else {
             res.json({
                 value: false,
                 data: "Invalid call"
             });
         }
     },
 };
