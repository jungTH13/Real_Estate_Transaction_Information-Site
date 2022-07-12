<template>
  <div>
    <canvas id="myChart"></canvas>
    <div v-if="loading === true" class="loading">loading...</div>
  </div>
</template>

<script>
import Chart from 'chart.js';
export default {
  data() {
    return {
      loading: false,
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      data: {
        labels: this.labels,
        datasets: [{
          label: '',
          backgroundColor: '#2E495E00',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 0, 0, 0, 0, 0, 0],
        }]
      },
      config: {
        type: 'line',
        data: this.data,
        options: {}
      },
      chart: null,
    }
  },
  mounted() {
    //this.data.labels=this.labels;
    this.config.data = this.data;

    const myChart = new Chart(
      document.getElementById('myChart'),
      this.config
    );
    this.chart = myChart;
    this.setGraphData(this.tradingVolumList);
  },
  computed: {
    tradingVolumList() {
      return this.$store.state.graph.tradingVolumList;
    },
    mapState() {
      return this.$store.state.dealList.mapState;
    },
    dealList() {
      return this.$store.state.dealList.dealList;
    },
    options() {
      return this.$store.state.dealList.options;
    },
    refreshMarker() {
      return this.$store.state.dealList.refreshMarker;
    }
  },
  watch: {
    dealList(newVal, oldVal) {
      this.loading = true;
      this.setTradingVolumList();
    },
    tradingVolumList(newVal, oldVal) {
      this.setGraphData(newVal);
    },
    refreshMarker(newVal, oldVal) {
      this.setGraphData(this.tradingVolumList);
    }

  },
  methods: {
    setDate(data) {
      return (`${data.deal_year}.${data.deal_month}`)
    },
    setTradingVolumList() {
      this.$store.dispatch('graph/setTradingVolum', this.mapState);
    },
    async setGraphData(tradingVolumList) {
      const labels = [];
      this.data.datasets.splice(0)
      const dateInfo = this.options.date;
      const houseType = this.options.type;
      const date = {
        deal_year: dateInfo.min[0],
        deal_month: dateInfo.min[1]
      }

      while (dateInfo.max[0] > date.deal_year || (dateInfo.max[0] == date.deal_year && dateInfo.max[1] >= date.deal_month)) {
        labels.push(this.setDate(date))
        date.deal_month++;
        if (date.deal_month > 12) {
          date.deal_year++;
          date.deal_month = 1;
        }
      }

      for (const locationCode in tradingVolumList) {
        const volumList = tradingVolumList[locationCode];
        if (volumList.length === 0) {
          continue;
        }

        for (let i = 0; i < volumList.length;) {
          if ((dateInfo.min[0] < volumList[i].deal_year || (dateInfo.min[0] == volumList[i].deal_year && dateInfo.min[1] <= volumList[i].deal_month)) &&
            (dateInfo.max[0] > volumList[i].deal_year || (dateInfo.max[0] == volumList[i].deal_year && dateInfo.max[1] >= volumList[i].deal_month))) {
            let dong = volumList[i].dong;
            let countList = [];

            for (const date of labels) {
              if (volumList[i] && dong == volumList[i].dong && date == this.setDate(volumList[i])) {
                countList.push((houseType['오피스텔'] ? volumList[i]['오피스텔'] : 0) + (houseType['아파트'] ? volumList[i]['아파트'] : 0) + (houseType['연립다세대'] ? volumList[i]['연립다세대'] : 0));
                i++;
              } else {
                countList.push(0);
              }
            }

            this.data.datasets.push({
              label: dong,
              backgroundColor: '#2E495E00',
              borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
              data: countList
            });
          } else {
            i++;
          }
        }
      }
      this.data.labels = labels;
      this.chart.update();

      this.loading = false;
    },
    setColor() {
      return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
    }
  }
}

</script>

<style>
.loading {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100vh;
  background-color: #ffffff9a;
  text-align: center;
}
</style>