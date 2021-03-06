const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt')

const UserRepository = require('../../infrastructure/database/repositories/UserRepositoryMysql');
const RESPONSE = require('../responseState');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const userRepository = new UserRepository();
            const exUser = await userRepository.findEmailOne(email);

            if (exUser) {
                const result = bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, RESPONSE.LOGIN_PASSWORD_AUTH_FAIL);
                }
            } else {
                done(null, false, RESPONSE.LOGIN_USER_NOT_FIND);
            }
        } catch (error) {
            console.error(error);
            const errCode = RESPONSE.LOGIN_ERROR;
            errCode.message = error
            done(errCode);
        }
    }))
}
