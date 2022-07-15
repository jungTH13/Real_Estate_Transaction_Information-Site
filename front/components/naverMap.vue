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
        setContent(type = 0) {
            if (type = 0) {
                return `
                        <div class="marker" alt="">
                        <div style="font-size:10px">
                        ${this.setAmount(deal.deal_amount)}
                        <div>
                        <div style="font-size:7px">
                        ${deal.area}㎡
                        <div>
                        <div style="font-size:7px">
                        ${deal.name}
                        <div>
                        </div>
                       `
            }
        },
        setAmount(amount) {
            let result = '';
            let a = parseInt(amount / 10000);
            let b = amount % 10000;
            if (a) {
                result += `${a}억`
            }
            if (b) {
                result += `${b}만`
            }
            return result
        },
        async setMarker(dealList, options = null) {
            let visibleList = [];
            let dealProviousIndex = 0;
            let dealProviousLength = this.dealProviousList.length;
            if (this.locationFixed) {
                this.removeMarker();
            }

            const promises = dealList.map((deal, index) => {
                if (options) {
                    if ((!options.type[deal.house_type]) ||
                        (options.date.min[0] > deal.deal_year || (options.date.min[0] == deal.deal_year && options.date.min[1] > deal.deal_month)) ||
                        (options.date.max[0] < deal.deal_year || (options.date.max[0] == deal.deal_year && options.date.max[1] < deal.deal_month)) ||
                        (options.amount[0] > deal.deal_amount || (options.amount[1] != options.AMOUNTMAX && options.amount[1] < deal.deal_amount))
                    ) {
                        if (deal.provious && dealProviousIndex < dealProviousLength && this.dealProviousList[dealProviousIndex].name == deal.name && this.dealProviousList[dealProviousIndex].id == deal.provious && this.dealProviousList[dealProviousIndex].dong == deal.dong) {
                            dealProviousIndex++;
                        }
                        deal.visible = false;
                        return;
                    }
                }
                visibleList.push(index);
                deal.visible = true;
                let contextstyle = 'border: 1px solid rgb(0, 0, 0,0.5);'
                if (deal.provious && dealProviousIndex < dealProviousLength && this.dealProviousList[dealProviousIndex].name == deal.name && this.dealProviousList[dealProviousIndex].id == deal.provious && this.dealProviousList[dealProviousIndex].dong == deal.dong) {
                    let dealProvious = this.dealProviousList[dealProviousIndex]

                    if ((options.date.min[0] > dealProvious.deal_year || (options.date.min[0] == dealProvious.deal_year && options.date.min[1] > dealProvious.deal_month)) ||
                        (options.date.max[0] < dealProvious.deal_year || (options.date.max[0] == dealProvious.deal_year && options.date.max[1] < dealProvious.deal_month))) {
                        contextstyle = 'border: 1px solid rgb(0, 0, 0,1);'
                    }
                    else if (deal.deal_amount < dealProvious.deal_amount) {
                        let blue = 2 * (deal.deal_amount / dealProvious.deal_amount > 0.5 ? 1 - deal.deal_amount / dealProvious.deal_amount : 0.5);
                        // blue = 105 + parseInt(150 * blue);
                        // const green = 255 - blue;
                        // console.log('blue:', blue, ', green:', green);
                        contextstyle = `border: 2px solid rgb(0, 0, ${parseInt(blue * 255)},0.75);`;
                    } else if (deal.deal_amount > dealProvious.deal_amount) {
                        let red = 2 * (deal.deal_amount / dealProvious.deal_amount < 1.5 ? deal.deal_amount / dealProvious.deal_amount - 1 : 0.5);
                        // red = 105 + parseInt(150 * red);
                        // const green = 255 - red;
                        // console.log('red:', red, ', green:', green);
                        contextstyle = `border: 2px solid rgb(${parseInt(255 * red)}, 0, 0,0.75);`;
                    }
                    dealProviousIndex++;
                }
                let contentText = `
                        <div class="marker" style="${contextstyle}" alt="">
                        <div style="font-size:10px; margin:0px">
                        ${this.setAmount(deal.deal_amount)}
                        <div>
                        <div style="font-size:7px">
                        ${deal.area}㎡
                        <div>
                        <div style="font-size:7px">
                        ${deal.name}
                        <div>
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
            })

            Promise.all(promises)
                .then(() => {
                    this.$store.dispatch('dealList/setVisibleDealsIndex', visibleList);
                    this.$store.dispatch('dealList/refreshList');
                    console.log(this.markers.length)
                });


        },
        removeMarker() {
            this.markers.forEach((marker) => {
                marker.setMap(null);
                marker = null;
            })
            this.markers = [];
        },
        getMapState() {
            if (!this.pause && !this.locationFixed) {
                this.pause = true;
                let map = this.map;
                let oldPoint = { x: map.getCenter().x, y: map.getCenter().y };
                setTimeout(this.delaySetMapState, 400, map, oldPoint);
            }
        },
        delaySetMapState(map, oldPoint) {

            let newPoint = { x: this.map.getCenter().x, y: this.map.getCenter().y };
            if (oldPoint.x == newPoint.x && oldPoint.y == newPoint.y) {
                this.removeMarker();
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

        initMap(zoom_label, this.getMapState);
        this.map = map;

        function initMap(zoom_label, getMapState) {
            map = new naver.maps.Map(document.getElementById('naverMap'), {
                center: new naver.maps.LatLng(37.5666103, 126.9783882),
                zoom: zoom_label,
                zoomControl: false,
                zoomControlOptions: { position: naver.maps.Position.RIGHT_TOP },
                mapTypeId: naver.maps.MapTypeId.NORMAL
            });

            naver.maps.Event.addListener(map, "center_changed", function () {
                window.setTimeout(function () {
                    getMapState();
                }, 100);
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
    width: 55px;
    height: 25px;
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
    background-color: #ffffffcc;
    border: 2px solid rgb(0, 0, 0);
    padding: 0.5rem;
    line-height: 1rem;
    border-radius: 0.5rem;
    width: 100px;
    height: 100px;
}
</style>