const passport = require('passport')

const User = require('../../models/user')

const RESPONSE=require('../responseState')
const local = require("./local")

module.exports = ()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findOne({
            where:{id}
        })
        .then(user=>{
            done(null,user);
        })
        .catch((error)=>{
            let err= RESPONSE.LOGIN_ERROR;
            err.message=error
            done(err);
        })
    });

    local();

}