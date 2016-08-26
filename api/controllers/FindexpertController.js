/**
 * FindexpertController
 *
 * @description :: Server-side logic for managing findexperts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            // if (req.session.user) {
            //     req.body.user = req.session.user._id;
                Findexpert.saveData(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            // } else {
            //     res.json({
            //         value: false,
            //         data: "User not loggd-in"
            //     });
            // }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
};
