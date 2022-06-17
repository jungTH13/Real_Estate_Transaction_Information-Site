<template> 
<div id='wrap' class='section'>   
    <div id="naverMap"></div>    
</div>
</template>

<script>
export default {

    name: 'hello',
    data() {
        return {
            zoom_label:15,
            map:null,
            infoWindow:null,
        }
    },
    mounted() {

        var map = null;
        var infoWindow = null;
        console.log({zoom_label:this.zoom_label})
        var zoom_label=this.zoom_label;
        var markers = [];
        var infoWindows = [];

        initMap(zoom_label,this.searchAddress);
        this.map=map
        this.infoWindow=infoWindow

        this.searchAddress("역골길 3",this.map,this.infoWindow)

        function initMap(zoom_label,func) {
            
            map = new naver.maps.Map(document.getElementById('naverMap'), {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: zoom_label,
                zoomControl: false,
                zoomControlOptions: {position: naver.maps.Position.RIGHT_TOP}
            });

            infoWindow = new naver.maps.InfoWindow({
                anchorSkew: true
            });

            map.setCursor('pointer');


            searchAddressToCoordinate("신림동")
            function searchAddressToCoordinate(address) {
            naver.maps.Service.geocode({
                query: address
            }, function(status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                if (!address) {
                    return alert('Geocode Error, Please check address');
                }
                return alert('Geocode Error, address:' + address);
                }

                if (response.v2.meta.totalCount === 0) {
                return alert('No result.');
                }

                var htmlAddresses = [],
                item = response.v2.addresses[0],
                point = new naver.maps.Point(item.x, item.y);

                if (item.roadAddress) {
                htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
                }

                if (item.jibunAddress) {
                htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
                }

                if (item.englishAddress) {
                htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
                }

                infoWindow.setContent([
                '<div style="padding:10px;min-width:200px;line-height:150%;">',
                '<h4 style="margin-top:5px;">검색 주소 : '+ address +'</h4><br />',
                htmlAddresses.join('<br />'),
                '</div>'
                ].join('\n'));

                map.setCenter(point);
                infoWindow.open(map, point);
            });
        }


        } // end_mount
    },
    methods:{
        searchAddress(address,map,infoWindow) {
            naver.maps.Service.geocode({
                query: address
            }, function(status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                if (!address) {
                    return alert('Geocode Error, Please check address');
                }
                return alert('Geocode Error, address:' + address);
                }

                if (response.v2.meta.totalCount === 0) {
                return alert('No result.');
                }

                var htmlAddresses = [],
                item = response.v2.addresses[0],
                point = new naver.maps.Point(item.x, item.y);

                if (item.roadAddress) {
                htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
                }

                if (item.jibunAddress) {
                htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
                }

                if (item.englishAddress) {
                htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
                }

                infoWindow.setContent([
                '<div style="padding:10px;min-width:200px;line-height:150%;">',
                '<h4 style="margin-top:5px;">검색 주소 : '+ address +'</h4><br />',
                htmlAddresses.join('<br />'),
                '</div>'
                ].join('\n'));

                map.setCenter(point);
                infoWindow.open(map, point);
            });
        }
    }
    

}
</script>


<style>
    #naverMap {
        height: 100vh;
        min-height: 100vh;
        width: 100%;
    }
</style>