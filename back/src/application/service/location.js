module.exports = class {
    constructor(repository){
        this.repository = repository;
    }

    async findIncluedArea(coordinate){
        const locationList = await this.repository.findAll();
        let result=[];
        for(let L of locationList){
            if(
            (L.max_x>=coordinate.min_x &&L.min_y<=coordinate.max_y) &&
            (L.min_x<=coordinate.max_x &&L.max_y>=coordinate.min_y)){
                result.push(L);
            }
        }
        return result;
    }
}