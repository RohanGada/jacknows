/**
 * ContentController
 *
 * @description :: Server-side logic for managing Contents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

  module.exports = {
      saveData: function(req, res) {
          if (req.body) {
              Content.saveData(req.body, function(err, respo) {
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
          } else {
              res.json({
                  value: false,
                  data: "Invalid call"
              });
          }
      },
  };
