module.exports = class {
    constructor(dong, name, jibun, deal_amount, build_year, deal_year, deal_month, deal_day, area, floor, house_type, cancel_deal_type, cancel_deal_day, req_gbn, x, y) {
        this.dong = dong // string
        this.name = name // string
        this.jibun = jibun // string
        this.deal_amount = deal_amount // int
        this.build_year = build_year // int
        this.deal_year = deal_year // int
        this.deal_month = deal_month // int
        this.deal_day = deal_day // int
        this.area = area // float
        this.floor = floor // int
        this.house_type = house_type // string
        this.cancel_deal_type = cancel_deal_type // string
        this.cancel_deal_day = cancel_deal_day // string
        this.req_gbn = req_gbn // string
        this.x = x // float
        this.y = y // float
    }
}
