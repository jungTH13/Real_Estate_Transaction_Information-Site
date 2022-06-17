const RESPONSE =require('../../config/responseState');
const {Op}=require('sequelize');
const Sequelize = require('sequelize');


const selectAll = async(table)=>{
    return await table.findAll();
};

const selectRecentlyDeal= async(table,coordinate)=>{
//좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
    const result=await table.findAll({
                where:{
                    id:{[Op.in]:[Sequelize.literal(`select max(id) as id
                                                    from projectdev.${table.name}
                                                    group by dong,name`)]},
                    x:{[Op.and]:[{[Op.gt]:coordinate.min_x},{[Op.lt]:coordinate.max_x}]},
                    y:{[Op.and]:[{[Op.gt]:coordinate.min_y},{[Op.lt]:coordinate.max_y}]}
                },
                raw:true
            })
    return result
}

module.exports={selectAll,selectRecentlyDeal};