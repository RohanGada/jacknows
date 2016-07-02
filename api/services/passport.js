
var FacebookStrategy = require("passport-facebook");


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = require("passport");


module.exports.use(new FacebookStrategy({
        clientID: "643534085794616",
        clientSecret: "a48d87149d67008ca29a136141b184c8",
        callbackURL: "/user/loginFacebook/",
        profileFields: ['id', 'displayName', 'photos', 'email'],
        enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
        if (!_.isEmpty(profile)) {
            User.findOne({
                "oauthLogin.socialId": profile.id + ""
            }).exec(function(err, data) {
                if (err) {
                    done(err, false);
                } else {
                    usertemp = {
                        "name": profile.displayName,
                        "oauthLogin": [{
                            "socialId": profile.id + "",
                            "socialProvider": profile.provider
                        }],

                    };
                    if (profile.photos && profile.photos.length > 0) {
                        usertemp.image = profile.photos[0].value;
                    }
                    if (_.isEmpty(data)) {
                        var user = User(usertemp);
                        user.save(function(err, data2) {
                            done(err, data2);
                        });
                    } else {
                        done(err, data);
                    }

                }
            });

        } else {
            done("There is an Error", false);
        }
    }
));



module.exports.use(new GoogleStrategy({
        clientID: "804038447884-to2ormfpkrr3ieor12306sj0oiq0daih.apps.googleusercontent.com",
        clientSecret: "usaySzaGy38sJPT4u9xWvuHt",
        callbackURL: "/user/loginGoogleCallback"
    },
    function(token, tokenSecret, profile, done) {
        if (!_.isEmpty(profile)) {
            User.findOne({
                "oauthLogin.socialId": profile.id + ""
            }).exec(function(err, data) {
                if (err) {
                    done(err, false);
                } else {
                    usertemp = {
                        "name": profile.displayName,
                        "oauthLogin": [{
                            "socialId": profile.id + "",
                            "socialProvider": profile.provider
                        }],
                        "status": 1
                    };
                    if (profile.photos && profile.photos.length > 0) {
                        usertemp.profilePic = profile.photos[0].value;
                    }
                    if (_.isEmpty(data)) {
                        var user = User(usertemp);
                        user.save(function(err, data2) {
                            done(err, data2);
                        });
                    } else {
                        done(err, data);
                    }

                }
            });

        } else {
            done("There is an Error", false);
        }
    }
));
