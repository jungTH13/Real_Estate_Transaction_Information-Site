const db = require('../orm/sequelize/models');
const RESPONSE = require('../../../config/responseState')
const {Op}=require('sequelize');
const LocationRepository = require('../../../application/interface/LocationRepository')

module.exports = class extends LocationRepository{
    constructor(database=db){
        super();
        this.model=database.Location;
    }

    async findAll(){
        return await this.model.findAll();
    }

    async findOne(sgg_cd){
        return await this.model.findOne({
            where:{sgg_cd}
        });
    }

    async XYupdate(coordinate,sgg_cd){
        return await this.model.update({
            min_x : coordinate.min_x,
            max_x : coordinate.max_x,
            min_y : coordinate.min_y,
            max_y : coordinate.max_y,
        },
        {where:{sgg_cd}})
    }
}