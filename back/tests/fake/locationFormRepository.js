const dealDomain = require('../../src/domain/deal');

module.exports = class {

    constructor(){
        this.data=[];
    }

    async insertDeals(deals,sgg_cd){
        this.data=this.data.concat(deals);
    }

    async deleteDeals(house_type,Year,Month,ssg_cd){
        for(let i;i<this.data.length;i++){
            let deal=data[i];
            if(deal.hous_type==house_type&&deal.deal_year==Year&&deal.deal_month==Month){
                this.data.splice(i,1);
                i--;
            }
        }
    }

    // async findAll(ormOptions,ssg_cd){

    // }

    // async findOne(ormOptions,sgg_cd){

    // }

    async findRecentlyDealOnType(house_type,sgg_cd){
        return this.data.reduce((result,output)=>{
            if(output.house_type==house_type&&output.deal_year>result.deal_year){
            }else{
                return result;
            }
        })
    }

    async findRecentlyDeals(coordinate,ssg_cd){

    }

    async findMaxOne(attribute,sgg_cd){
        return 
    }

    async findMinOne(attribute,sgg_cd){
        return 
    }

    async bulkCreate(deals,sgg_cd){
        this.data=this.data.concat(deals);
    }
} 