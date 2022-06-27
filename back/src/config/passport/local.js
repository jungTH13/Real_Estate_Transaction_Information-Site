const passport=require('passport');
const localStrategy = require('passport-local');
const bcrypt = require('bcrypt')

const User=require('../../models/user');
const RESPONSE = require('../responseState');

module.exports=()=>{
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email,password,done)=>{
        try{
            const exUser = await User.findOne({
                where:{email}
            });

            if(exUser){
                const result = bcrypt.compare(password,exUser.password);
                if(result){
                    done(null,exUser);
                }else{
                    done(null,false,RESPONSE.LOGIN_PASSWORD_AUTH_FAIL);
                }
            } else {
                done(null,false,RESPONSE.LOGIN_USER_NOT_FIND);
            }
        } catch (error){
            console.error(error);
            let errCode= RESPONSE.LOGIN_ERROR;
            errCode.message=error
            done(errCode);
        }
    }))
}
