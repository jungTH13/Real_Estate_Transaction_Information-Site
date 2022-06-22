<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';
export default{
  data(){
    return{
      labels:['January','February','March','April','May','June'],
      data:{
        labels: this.labels,
        datasets: [{
          label: 'dataset',
          backgroundColor: '#2E495E00',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 20, 30, 40, 50, 55],
        }]
      },
      config:{
        type: 'line',
        data: this.data,
        options: {}
      },
      chart:null,
    }
  },
  mounted(){
    this.data.labels=this.labels;
    this.config.data=this.data;

    const myChart = new Chart(
      document.getElementById('myChart'),
      this.config
    );
    this.chart=myChart;
  }
}

</script>ㄴ