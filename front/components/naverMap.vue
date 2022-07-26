<template>
    <div id='wrap' class='section'>
        <div id="naverMap"></div>
    </div>
</template>

<script>
export default {
    props: {
        search: {},
    },
    name: 'hello',
    data() {
        return {
            zoom_label: 15,
            map: null,
            markers: [],
            pause: false,
            removeState: false,
            visibleMarkersCount: 0
        }
    },
    computed: {
        mapState() {
            return this.$store.state.dealList.mapState;
        },
        dealList() {
            return this.$store.state.dealList.dealList;
        },
        dealProviousList() {
            return this.$store.state.dealList.dealProviousList;
        },
        options() {
            return this.$store.state.dealList.options;
        },
        refreshMarker() {
            return this.$store.state.dealList.refreshMarker;
        },
        refreshList() {
            return this.$store.state.dealList.refreshList;
        },
        locationFixed() {
            return this.$store.state.location.locationFixed;
        },
        locationTableList() {
            return this.$store.state.location.locationTableList;
        }
    },
    watch: {
        search(newVal, oldVal) {
            if (newVal.length) {
                this.searchAddress(newVal, this.map,
                    this.getMapState);
            }
        },
        dealList(newVal, oldVal) {
            console.log(this.options);
            console.log(this.map.getCenter());
            this.setMarker(newVal, this.options);
        },
        refreshMarker(newVal, oldVal) {
            this.removeMarker();
            this.setMarker(this.dealList, this.options);
        }
    },
    methods: {
        controller(type) {
            if (type === "center_changed") {
                this.removeMarker(300);
                window.setTimeout(() => {
                    this.getMapState();
                }, 100);
                return;
            }
            if (type === "zoom_changed") {
                this.removeMarker();
                window.setTimeout(() => {
                    this.getMapState();
                }, 100);
                return;
            }
        },
        setAmount(amount) {
            let result = '';
            let a = parseInt(amount / 10000);
            let b = ((amount % 10000) / 10000);
            if (b <= 0) {
                result = `${a}억`;
            } else {
                result = `${Math.round((a + b) * 100) / 100}억`
            }
            return result
        },
        async setOffset(deal, mapBounds) {
            if (deal) {
                let marker = await new naver.maps.Marker({
                    position: new naver.maps.LatLng(deal.y, deal.x),
                    map: this.map
                })
                const position = this.map.mapPane.view.panes.overlayImage.children[0].style

                let positionX = parseInt(this.map.size.width * ((deal.x - mapBounds.min.x) / (mapBounds.max.x - mapBounds.min.x)));
                let positionY = parseInt(this.map.size.height * ((mapBounds.max.y - deal.y) / (mapBounds.max.y - mapBounds.min.y)));
                const offset = { x: positionX - parseInt(position.left), y: positionY - parseInt(position.top) };
                marker.setMap(null);
                console.log(offset);
                return offset
            }
        },
        async setMarker(dealList, options = null) {
            let visibleList = [];
            let dealProviousIndex = 0;
            let dealProviousLength = this.dealProviousList.length;
            let markersDivList = [];
            const mapBounds = { min: this.map.bounds._min, max: this.map.bounds._max };
            this.removeMarker();
            const offset = await this.setOffset(dealList[0], mapBounds);

            const promises = dealList.map((deal, index) => {
                //groupSet component에서 설정된 설정값에 따른 핸들링
                if (options) {
                    if ((!options.type[deal.house_type]) ||
                        (options.date.min[0] > deal.deal_year || (options.date.min[0] == deal.deal_year && options.date.min[1] > deal.deal_month)) ||
                        (options.date.max[0] < deal.deal_year || (options.date.max[0] == deal.deal_year && options.date.max[1] < deal.deal_month)) ||
                        (options.amount[0] > deal.deal_amount || (options.amount[1] != options.AMOUNTMAX && options.amount[1] < deal.deal_amount))
                    ) {
                        if (deal.provious && dealProviousIndex < dealProviousLength && this.dealProviousList[dealProviousIndex].name == deal.name && this.dealProviousList[dealProviousIndex].id == deal.provious && this.dealProviousList[dealProviousIndex].dong == deal.dong && this.dealProviousList[dealProviousIndex].house_type == deal.house_type) {
                            dealProviousIndex++;
                        }
                        deal.visible = false;
                        return;
                    }
                }
                //거래정보가 시각화되어지는 정보일 경우(=>searchResult에서 거래정보 시각화시 활용)
                visibleList.push(index);
                deal.visible = true;

                //최근거래가와 직전 거래가의 변동율에 따른 시각화 효과 설정
                let percentText = '';
                let contextstyle = 'border: 1px solid rgb(0, 0, 0, 0.25);'
                if (deal.provious && dealProviousIndex < dealProviousLength && this.dealProviousList[dealProviousIndex].name == deal.name && this.dealProviousList[dealProviousIndex].id == deal.provious && this.dealProviousList[dealProviousIndex].dong == deal.dong && this.dealProviousList[dealProviousIndex].house_type == deal.house_type) {
                    let dealProvious = this.dealProviousList[dealProviousIndex]

                    if ((options.date.min[0] > dealProvious.deal_year || (options.date.min[0] == dealProvious.deal_year && options.date.min[1] > dealProvious.deal_month)) ||
                        (options.date.max[0] < dealProvious.deal_year || (options.date.max[0] == dealProvious.deal_year && options.date.max[1] < dealProvious.deal_month))) {
                        contextstyle = 'border: 1px solid rgb(0, 0, 0,0.25);'
                    }
                    else if (deal.deal_amount < dealProvious.deal_amount) {
                        let blue = 2 * (deal.deal_amount / dealProvious.deal_amount > 0.5 ? 1 - deal.deal_amount / dealProvious.deal_amount : 0.5);
                        contextstyle = (blue < 0.1 ? `border: 2px solid rgb(0, 255, 0,0.25);` : `border: 2px solid rgb(0, 0, 255,${blue});`);
                        percentText = `
                        <div style="font-size:10px; color:blue; position:absolute; font-weight:900; bottom:1px; left:1px;">
                            ${Math.round((deal.deal_amount / dealProvious.deal_amount) * 100 - 100)}%↓
                        </div>
                        `
                    }
                    else if (deal.deal_amount > dealProvious.deal_amount) {
                        let red = 2 * (deal.deal_amount / dealProvious.deal_amount < 1.5 ? deal.deal_amount / dealProvious.deal_amount - 1 : 0.5);
                        contextstyle = (red < 0.1 ? `border: 2px solid rgb(0, 255, 0,0.25);` : `border: 2px solid rgb(255, 0, 0,${red});`);
                        percentText = `
                        <div style="font-size:10px; color:red; position:absolute; font-weight:900; bottom:1px; left:1px;">
                            ${Math.round((deal.deal_amount / dealProvious.deal_amount) * 100 - 100)}%↑
                        </div>
                        `
                    }
                    dealProviousIndex++;
                }
                //locationFixed로 지역 거래정보 검색이 고정되었을 경우, 화면 밖의 거래정보들에 대한 핸들링
                if (this.locationFixed && (mapBounds.min.x > deal.x || mapBounds.min.y > deal.y || mapBounds.max.x < deal.x || mapBounds.max.y < deal.y)) {
                    return;
                }
                this.setTextMarkers(deal, contextstyle, percentText, index, markersDivList, mapBounds, offset)
            })

            Promise.all(promises)
                .then(() => {
                    this.visibleMarkersCount = markersDivList.length;
                    this.map.mapPane.view.panes.overlayImage.innerHTML += markersDivList.join('');
                    this.$store.dispatch('dealList/setVisibleDealsIndex', visibleList);
                    this.$store.dispatch('dealList/refreshList');
                    console.log('visibleList:', visibleList.length, 'visibleMarkers:', markersDivList.length)
                });


        },
        setTextMarkers(deal, contextstyle, percentText, index, markersDivList, mapBounds, offset) {
            let positionX = parseInt(this.map.size.width * ((deal.x - mapBounds.min.x) / (mapBounds.max.x - mapBounds.min.x))) - offset.x;
            let positionY = parseInt(this.map.size.height * ((mapBounds.max.y - deal.y) / (mapBounds.max.y - mapBounds.min.y))) - offset.y;
            const contentText = `
                <div title="" style="position: absolute; overflow: visible; box-sizing: content-box !important; cursor: inherit; left: ${positionX}px; top: ${positionY}px;">
                    <div style="cursor: pointer;">
                        <div class="marker" style="${contextstyle}" onclick='dealDetail(${index})'>
                            <div style="font-size:15px; position:absolute; top:2px; font-weight:900; left:2px;">
                            ${this.setAmount(deal.deal_amount)}
                            </div>
                            <div style="font-size:10px; position:absolute; font-weight:900; bottom:1px; right:1px;">
                            ${Math.round(deal.area)}㎡
                            </div>
                            ${percentText}
                        </div>
                    </div>
                </div>`;
            markersDivList.push(contentText);
        },
        setMarkers(deal, contextstyle, percentText, index) {
            let contentText = `
                        <div class="marker" style="${contextstyle}" onclick='dealDetail(${index})'>
                            <div style="font-size:15px; position:absolute; top:2px; font-weight:900; left:2px;">
                            ${this.setAmount(deal.deal_amount)}
                            </div>
                            <div style="font-size:10px; position:absolute; font-weight:900; bottom:1px; right:1px;">
                            ${Math.round(deal.area)}㎡
                            </div>
                            ${percentText}
                        </div>
                       `;
            this.markers.push(new naver.maps.Marker({
                position: new naver.maps.LatLng(deal.y, deal.x),
                map: this.map,
                icon: {
                    content: contentText,
                    //size: new naver.maps.Size(22, 35),
                    //anchor: new naver.maps.Point(11, 35)
                }
            }));
        },
        dealDetail(dealIndex) {
            const deal = this.dealList[dealIndex];
            for (const location of this.locationTableList) {
                if (location[1] && location[1] == deal.dong) {
                    this.$store.dispatch('location/selectDealLocation', location.concat([deal.name]));
                    return;
                }
            }
        },
        removeMarker(visibleMarkersCountLimit = 0) {
            if (this.map.mapPane.view.panes.overlayImage.innerHTML != '' && visibleMarkersCountLimit < this.visibleMarkersCount) {
                this.map.mapPane.view.panes.overlayImage.innerHTML = '';
            }
        },
        getMapState() {
            if (!this.pause) {
                this.pause = true;
                let map = this.map;
                let oldPoint = { x: map.getCenter().x, y: map.getCenter().y };
                setTimeout(this.delaySetMapState, 400, map, oldPoint);
            }
        },
        delaySetMapState(map, oldPoint) {

            let newPoint = { x: this.map.getCenter().x, y: this.map.getCenter().y };
            if (oldPoint.x == newPoint.x && oldPoint.y == newPoint.y) {
                //지도의 중앙이 변경을 감지 후 locationFixed에 따라 mapState의 갱신 여부를 스킵
                if (!this.locationFixed) {
                    this.$store.dispatch('dealList/setDeals', {
                        point: { x: map.getCenter().x, y: map.getCenter().y },
                        bounds: { max: map.getBounds()._max, min: map.getBounds()._min },
                        Zoom: map.getZoom(),
                    }).then(() => {
                        setTimeout(() => {
                            this.pause = false;
                            if (this.mapState.point.x != map.getCenter().x || this.mapState.point.y != map.getCenter().y) {
                                this.getMapState();
                            }
                        }, 500)
                    })
                } else {
                    this.setMarker(this.dealList, this.options);
                    this.pause = false;
                }

            } else {
                setTimeout(this.delaySetMapState, 400, map, newPoint);
            }
        },
        searchAddress(address, map) {
            naver.maps.Service.geocode({
                query: address
            }, function (status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                    if (!address) {
                        return alert('Geocode Error, Please check address');
                    }
                    return alert('Geocode Error, address:' + address);
                }
                if (response.v2.meta.totalCount === 0) {
                    return alert('No result.');
                }

                let item = response.v2.addresses[0];
                console.log("searchAddress:", response.v2.addresses);
                let point = new naver.maps.Point(item.x, item.y);

                map.setCenter(point);
                map.setZoom(17);
            });
        }
    },
    mounted() {
        let map = null
        var zoom_label = this.zoom_label;

        initMap(zoom_label, this.controller);
        this.map = map;
        window.map = map;

        window.dealDetail = this.dealDetail;

        function initMap(zoom_label, controller) {
            map = new naver.maps.Map(document.getElementById('naverMap'), {
                center: new naver.maps.LatLng(37.5666103, 126.9783882),
                zoom: zoom_label,
                zoomControl: false,
                zoomControlOptions: { position: naver.maps.Position.RIGHT_TOP },
                mapTypeId: naver.maps.MapTypeId.NORMAL
            });

            naver.maps.Event.addListener(map, "center_changed", function () {
                controller("center_changed");
            });

            naver.maps.Event.addListener(map, "zoom_changed", function () {
                controller("zoom_changed");
            });

        } // end_mount
    }

}
</script>


<style>
#naverMap {
    height: 100vh;
    min-height: 100vh;
    width: 100%;
}

.marker {
    overflow: hidden;
    padding: 0px 0px 0px 0px;
    position: absolute;
    background-color: #ffffffcc;
    border: 2px solid rgba(0, 0, 0, 0.253);
    padding: 0.5rem;
    line-height: 1rem;
    border-radius: 0.5rem;
    width: 45px;
    height: 20px;
}

.markerup {
    overflow: hidden;
    padding: 0px 0px 0px 0px;
    position: absolute;
    background-color: #ffffffcc;
    border: 2px solid rgba(17, 0, 255, 0.904);
    padding: 0.5rem;
    line-height: 1rem;
    border-radius: 0.5rem;
    width: 55px;
    height: 25px;
}

.markerdown {
    overflow: hidden;
    padding: 0px 0px 0px 0px;
    position: absolute;
    background-color: #ffffffcc;
    border: 2px solid #1bf;
    padding: 0.5rem;
    line-height: 1rem;
    border-radius: 0.5rem;
    width: 55px;
    height: 25px;
}

.marker:hover {
    position: absolute;
    background-color: #f06ec9ad;
    border: 2px solid rgb(0, 0, 0);
    padding: 0.5rem;
    line-height: 1rem;
    border-radius: 0.5rem;
}
</style>