const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var user = mongoose.model('UserMaster');

passport.use(
    new localStrategy({usernameField:'email'},
    (email, password, done) => {
        
        user.findOne({email: email},
            (err, user) => {
                if(err){
                    return done(err);
                }
                else if(!user){
                    return done(null, false, {message: 'Email is not Registered'})
                }
                else if(!user.verifyPassword(password)){
                    return done(null, false, {message: 'Wrong Password!'})
                }
                else{
                    return done(null, user)
                }
            })
    })
)

