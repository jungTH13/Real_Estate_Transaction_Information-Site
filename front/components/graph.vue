<template>
  <div class="invisible">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="search" permanent :width="chartWidth" id="box">

      <v-list-item class="searchTitle" style="padding:0px 10px 0px 10px;">
        <v-btn icon hide-details @click.stop="search = !search">
          <v-icon hide-details>mdi-chart-line</v-icon>
        </v-btn>
        <v-list-item-title v-if="changeType === 0" style="text-align: center;">
          월별 거래량 (건)
        </v-list-item-title>
        <v-list-item-title v-if="changeType === 1" style="text-align: center;">
          평당 거래가 (만원)
        </v-list-item-title>
        <v-btn icon hide-details @click.stop="setGraphType">
          <v-icon hide-details>mdi-swap-horizontal</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <div v-if="!search">
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
      chartWidth: 600,
      drawer: true,
      search: true,
      mini: true,
      windowWidth: 0,
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
    },
    changeType() {
      return this.$store.state.graph.changeType;
    },
    labelCount() {
      return this.$store.state.graph.labelCount;
    }
  },
  watch: {
    labelCount(newVal, oldVal) {
      this.graphResize();
    },
    windowWidth(newVal, oldVal) {
      this.graphResize();
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.windowWidth != window.innerWidth) {
        this.windowWidth = window.innerWidth
      }
    });
  },
  methods: {
    setGraphType() {
      this.$store.dispatch('graph/setChangeType');
    },
    graphResize() {
      const count = this.labelCount;
      const size = this.windowWidth;
      let result = this.chartWidth;

      if (count > 20) {
        result = 800;
      } else {
        result = 600;
      }
      if (size < result + 20) {
        result = size - 20;
      }

      this.chartWidth = result;
    }
  }
}
</script>

<style>
#box {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 8px;
}

.chart {
  height: 600px;
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