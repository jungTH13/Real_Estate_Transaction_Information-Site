const passport = require('passport')
const RESPONSE=require('../responseState')
const local = require("./local")

const UserRepository = require('../../infrastructure/database/repositories/UserRepositoryMysql');

module.exports = ()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        const userRepository = new UserRepository;

        userRepository.findIdOne(id)
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