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
    this.switchSetGraphData(this.changeType);
  },
  computed: {
    tradingVolumList() {
      return this.$store.state.graph.tradingVolumList;
    },
    amountAVGList() {
      return this.$store.state.graph.amountAVGList;
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
    },
    changeType() {
      return this.$store.state.graph.changeType;
    },
    locationFixed() {
      return this.$store.state.location.locationFixed;
    }
  },
  watch: {
    dealList(newVal, oldVal) {
      this.loading = true;
      this.switchSetGraphData(this.changeType);
    },
    tradingVolumList(newVal, oldVal) {
      this.setGraphData(newVal);
    },
    amountAVGList(newVal, oldVal) {
      this.setGraphData(newVal);
    },
    refreshMarker(newVal, oldVal) {
      if (this.changeType === 0) {
        this.setGraphData(this.tradingVolumList);
      }
      if (this.changeType === 1) {
        this.setGraphData(this.amountAVGList);
      }
    },
    changeType(newVal, oldVal) {
      this.switchSetGraphData(newVal);
    }

  },
  methods: {
    switchSetGraphData(changeType) {
      if (!this.locationFixed) {
        if (changeType === 0) {
          this.setTradingVolumList();
        }
        if (changeType === 1) {
          this.setAmountAVGList();
        }
      } else {
        if (changeType === 0) {
          this.setGraphData(this.tradingVolumList);
        }
        if (changeType === 1) {
          this.setGraphData(this.amountAVGList);
        }
      }
    },
    setDate(data) {
      return (`${data.deal_year}.${data.deal_month}`)
    },
    setTradingVolumList() {
      this.$store.dispatch('graph/setTradingVolum', this.mapState);
    },
    setAmountAVGList() {
      this.$store.dispatch('graph/setAmountAVGList', this.mapState);
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
      const totalList = [];
      //changeType === 1
      const totalAmountList = [];
      const totalAreaList = [];

      while (dateInfo.max[0] > date.deal_year || (dateInfo.max[0] == date.deal_year && dateInfo.max[1] >= date.deal_month)) {
        labels.push(this.setDate(date))
        date.deal_month++;
        totalList.push(0);
        totalAmountList.push(0);
        totalAreaList.push(0);
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
            let dataList = [];

            for (const [index, date] of labels.entries()) {
              if (volumList[i] && dong == volumList[i].dong && date == this.setDate(volumList[i])) {
                //changType에 따른 시각화 데이터 처리 분기
                if (this.changeType === 0) {
                  const count = (houseType['오피스텔'] ? volumList[i]['오피스텔'] : 0) + (houseType['아파트'] ? volumList[i]['아파트'] : 0) + (houseType['연립다세대'] ? volumList[i]['연립다세대'] : 0);
                  dataList.push(count);
                  totalList[index] += count;
                }
                else if (this.changeType === 1) {
                  const amount = (houseType['오피스텔'] ? parseInt(volumList[i]['오피스텔amount']) || 0 : 0) + (houseType['아파트'] ? parseInt(volumList[i]['아파트amount']) || 0 : 0) + (houseType['연립다세대'] ? parseInt(volumList[i]['연립다세대amount']) || 0 : 0);
                  const area = (houseType['오피스텔'] ? volumList[i]['오피스텔area'] : 0) + (houseType['아파트'] ? volumList[i]['아파트area'] : 0) + (houseType['연립다세대'] ? volumList[i]['연립다세대area'] : 0);
                  totalAmountList[index] += amount;
                  totalAreaList[index] += area;
                  dataList.push(amount / area || dataList[dataList.length - 1] || 0);
                }
                i++;
              } else {
                //changType에 따른 시각화 데이터 처리 분기
                if (this.changeType === 0) {
                  dataList.push(0);
                }
                else if (this.changeType === 1) {
                  dataList.push(dataList[dataList.length - 1] || 0);
                }
              }
            }

            this.data.datasets.push({
              label: dong,
              backgroundColor: '#2E495E00',
              borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
              data: dataList
            });
          } else {
            i++;
          }
        }
      }

      //changType에 따른 시각화 데이터 처리 분기
      if (this.changeType === 1) {
        for (const [index, data] of totalList.entries()) {
          totalList[index] = totalAmountList[index] / totalAreaList[index] || totalList[index - 1] || 0;
        }
      }
      if (this.data.datasets.length > 1) {
        this.data.datasets.unshift({
          label: '전체',
          backgroundColor: '#2E495E00',
          borderDash: [5, 5],
          borderColor: `rgb(0, 0, 255)`,
          data: totalList
        });
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