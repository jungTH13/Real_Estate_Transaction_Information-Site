module.exports = class {
    constructor(repository) {
        this.repository = repository;
    }

    async findIncluedArea(coordinate) {
        const locationList = await this.repository.findAll();
        const result = [];
        for (const L of locationList) {
            if (
                (L.max_x >= coordinate.min_x && L.min_y <= coordinate.max_y) &&
                (L.min_x <= coordinate.max_x && L.max_y >= coordinate.min_y)) {
                result.push(L);
            }
        }
        return result;
    }

    async updateCoordinate(coordinate, sgg_cd) {
        return await this.repository.XYupdate(coordinate, sgg_cd);
    }

    async findAllinfo() {
        return await this.repository.findAll();
    }
}
