exports.url={
    //부동산 실거래가 조회용 API url
    type1:{
        name : ["아파트","연립다세대","오피스텔"],
        "아파트": 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade', // 아파트 실거래 API
        "연립다세대": 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcRHTrade', // 연립다세대 실거래 API
        //"단독다가구": 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcSHTrade', // 단독다가구 실거래 API
        "오피스텔": 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcOffiTrade' // 오피스텔 실거래 API
}}

seul=[
    {location:"서울", sgg_cd:11110, sgg_nm:"종로구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11140, sgg_nm:"중구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11170, sgg_nm:"용산구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11200, sgg_nm:"성동구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11215, sgg_nm:"광진구", url:1, key_type:1,},

    {location:"서울", sgg_cd:11230, sgg_nm:"동대문구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11260, sgg_nm:"중랑구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11290, sgg_nm:"성북구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11305, sgg_nm:"강북구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11320, sgg_nm:"도봉구", url:1, key_type:1,},

    {location:"서울", sgg_cd:11350, sgg_nm:"노원구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11380, sgg_nm:"은평구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11410, sgg_nm:"서대문구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11440, sgg_nm:"마포구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11470, sgg_nm:"양천구", url:1, key_type:1,},

    {location:"서울", sgg_cd:11500, sgg_nm:"강서구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11530, sgg_nm:"구로구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11545, sgg_nm:"금천구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11560, sgg_nm:"영등포구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11590, sgg_nm:"동작구", url:1, key_type:1,},

    {location:"서울", sgg_cd:11620, sgg_nm:"관악구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11650, sgg_nm:"서초구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11680, sgg_nm:"강남구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11710, sgg_nm:"송파구", url:1, key_type:1,},
    {location:"서울", sgg_cd:11740, sgg_nm:"강동구", url:1, key_type:1,},
];


exports.locationInfo=seul;