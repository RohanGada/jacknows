
var FacebookStrategy = require("passport-facebook");


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = require("passport");


module.exports.use(new FacebookStrategy({
        clientID: "1676496155933091",
        clientSecret: "f47e8f9004da629d5feccf47fc9a142c",
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
        clientID: "509027466200-p7sfllmlr5aquvqrm970tjlfo8n8pf8f.apps.googleusercontent.com",
        clientSecret: "4KyfLPNLx9KECFCMI0NjW39O",
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
