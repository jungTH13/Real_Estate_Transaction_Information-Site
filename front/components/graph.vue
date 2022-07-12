<template>
  <div class="invisible">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="search" permanent :width="600" id="box">

      <v-list-item class="searchTitle" style="padding:0px 10px 0px 10px;">
        <v-btn icon hide-details @click.stop="search = !search">
          <v-icon hide-details>mdi-chart-line</v-icon>
        </v-btn>
        <v-list-item-title style="text-align: center;">
          월별 거래량 및 평당 거래가
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <div v-if="!search" class="chart">
        <Chart></Chart>
      </div>

    </v-navigation-drawer>
  </div>


</template>

<script>
import Chart from '~/components/chart.vue';

export default {

  data() {
    return {
      drawer: true,
      search: true,
      mini: true,
    }
  },
  components: {
    Chart
  },
  computed: {
    dealList() {
      return this.$store.state.dealList.dealList;
    },
    visibleDealsIndex() {
      return this.$store.state.dealList.visibleDealsIndex;
    },
    refreshList() {
      return this.$store.state.dealList.refreshList;
    }
  },
  watch: {

  },
  methods: {

  }
}
</script>

<style>
#box {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 8px;
}



.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 400;
  font-size: 100px;
  color: #2E495E;
  letter-spacing: 1px;
  font-size: 6em;
}

.green {
  color: #00C48D;
}

.subtitle {
  font-weight: 300;
  font-size: 1em;
  color: #2E495E;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>