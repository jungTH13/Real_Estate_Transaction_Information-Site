const Sequelize=require('sequelize');

module.exports= class Location extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            location:{
                type: Sequelize.STRING(20),
                allowNull:false,
            },  
            sgg_cd:{
                type: Sequelize.INTEGER,
                allowNull:false,
            },
            sgg_nm:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            url:{
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            key_type:{
                type: Sequelize.INTEGER,
                allowNull:false
            },
            min_x:{
                type: Sequelize.FLOAT,
                allowNull:true,

            },
            min_y:{
                type: Sequelize.FLOAT,
                allowNull:true,

            },
            max_x:{
                type: Sequelize.FLOAT,
                allowNull:true,

            },
            max_y:{
                type: Sequelize.FLOAT,
                allowNull:true,

            },

        },{
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'Location',
            tableName:'locations',
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
}