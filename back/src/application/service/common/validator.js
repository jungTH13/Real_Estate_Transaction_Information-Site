exports.coordinate = (coordinate) => {
    if (coordinate.min_x > coordinate.max_x || coordinate.min_y > coordinate.max_y) {
        throw new Error('coordinate 내부 값이 올바르지 않습니다.')
    }
    if (coordinate.min_x === undefined || coordinate.min_y === undefined || coordinate.max_x === undefined || coordinate.max_y === undefined) {
        throw new Error('coorfinate의 데이터가 존재하지 않습니다.')
    }
}
