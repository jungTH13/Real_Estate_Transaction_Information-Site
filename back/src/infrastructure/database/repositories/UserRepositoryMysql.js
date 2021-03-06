const db = require('../orm/sequelize/models');
const UserRepository = require('../../../application/interface/UserRepository');

module.exports = class extends UserRepository {
    constructor() {
        super();
        this.model = db.User;
    }

    findIdOne(id) {
        return this.model.findOne({
            where: { id }
        })
    }

    findEmailOne(email) {
        return this.model.findOne({
            where: { email }
        })
    }
}
