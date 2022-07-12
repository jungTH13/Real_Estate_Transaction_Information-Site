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
    console.log(this.data.labels);

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
    }
  },
  watch: {
    dealList(newVal, oldVal) {
      this.loading = true;
      this.setTradingVolumList();
    },
    tradingVolumList(newVal, oldVal) {
      this.setGraphData(newVal);
    }
  },
  methods: {
    setTradingVolumList() {
      this.$store.dispatch('graph/setTradingVolum', this.mapState);
    },
    async setGraphData(tradingVolumList) {
      const labels = [];
      this.data.datasets.splice(0)
      const dateInfo = this.options.date;

      for (const locationCode in tradingVolumList) {
        const volumList = tradingVolumList[locationCode];
        if (volumList.length === 0) {
          continue;
        }

        let dong = volumList[0].dong;
        let countList = [];

        for (const data of volumList) {
          if (dong != data.dong) {
            this.data.datasets.push({
              label: dong,
              backgroundColor: '#2E495E00',
              borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
              data: countList
            });
            dong = data.dong;
            countList = [];
          }

          if ((dateInfo.min[0] < data.deal_year || (dateInfo.min[0] == data.deal_year && dateInfo.min[1] <= data.deal_month)) &&
            (dateInfo.max[0] > data.deal_year || (dateInfo.max[0] == data.deal_year && dateInfo.max[1] >= data.deal_month))) {
            if (!labels.includes(`${data.deal_year}.${data.deal_month}`)) {
              labels.push(`${data.deal_year}.${data.deal_month}`);
            }
            countList.push(data.count);
          }

          if (data == volumList[volumList.length - 1]) {
            this.data.datasets.push({
              label: dong,
              backgroundColor: '#2E495E00',
              borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
              data: countList
            });
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