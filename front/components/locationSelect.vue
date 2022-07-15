<template>
    <v-chip-group v-model="locationSelection" active-class="deep-purple accent-3 white--text">
        <v-chip v-for="[index, location] of locationTableList.entries()" :key=index>

            <strong v-if="location.length == 1">
                {{ location[location.length - 1] }}
            </strong>
            <v-badge v-if="location.length == 1" dot inline bordered style="position:absolute; left:0px;">
            </v-badge>
            <div v-if="location.length == 2" hide-details>{{ location[location.length - 1] }}</div>

        </v-chip>
    </v-chip-group>
</template>

<script>
export default {
    data() {
        return {
            locationSelection: undefined
        }
    },
    computed: {
        dealList() {
            return this.$store.state.dealList.dealList;
        },
        mapState() {
            return this.$store.state.dealList.mapState;
        },
        locationTableList() {
            return this.$store.state.location.locationTableList;
        },
        locationFixed() {
            return this.$store.state.location.locationFixed;
        }
    },
    watch: {
        locationSelection(newVal, oldVal) {
            if (newVal != undefined) {
                this.$store.dispatch('location/setLocationFixed', true);
                const searchText = this.locationTableList[newVal].join('');
                this.$emit('searchText', searchText);

                this.$store.dispatch('dealList/setDealsByLocation', this.locationTableList[newVal])
                this.$store.dispatch('graph/setTradingVolumByLocation', this.locationTableList[newVal])
                this.$store.dispatch('graph/setAmountAVGListByLocation', this.locationTableList[newVal])
            } else {
                this.$store.dispatch('location/setLocationFixed', false);
            }
            console.log(newVal)
        },
        dealList(newVal, oldVal) {
            if (!this.locationFixed) {
                this.setLocationTableList();
            }
        },
    },
    methods: {
        setLocationTableList() {
            this.$store.dispatch('location/setLocationTableList', this.mapState)
        }

    }
}
</script>

<style>
</style>