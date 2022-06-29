const LocationService = require('../../src/application/service/location');

const CoordinateDomain = require('../../src/domain/coordinate');

const fakeLocationRepository = require('../fake/LocationFormRepository');

describe('findIncludeArea test',()=>{
    
    const locationService= new LocationService(fakeLocationRepository);

    test('입력된 coordinate와 범위가 겹치는 정보를 반환 하는가',async ()=>{
        //given
        const coordinate1 = new CoordinateDomain(126.956869,126.9908365,37.4786424,37.4945963);
        const coordinate2 = new CoordinateDomain(126.9400033,127.0079383,37.5163848,37.548273);

        //when
        const result1 = await locationService.findIncluedArea(coordinate1)
        const result2 = await locationService.findIncluedArea(coordinate2)

        //then
        expect(result1).toEqual([{
                                    max_x:126.982,
                                    min_x:126.904,
                                    max_y:37.5143,
                                    min_y:37.4766,
                                    sgg_cd:11590,
                                }]);
        expect(result2).toEqual([{
                                    max_x:127.015,
                                    min_x:126.947,
                                    max_y:37.5549,
                                    min_y:37.517,
                                    sgg_cd:11170,
                                },
                                {
                                    max_x:126.962,
                                    min_x:126.881,
                                    max_y:37.5871,
                                    min_y:37.5354,
                                    sgg_cd:11440,
                                }]);

    })
})