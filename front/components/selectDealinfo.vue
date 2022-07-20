<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="600" hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ title }}</v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-title>{{ type }}</v-toolbar-title>
                    <v-toolbar-title>{{ location }}</v-toolbar-title>
                </v-toolbar>
                <v-card style="height:70vh;">
                    <div style="height:8px;"></div>
                    <v-card style="margin-inline: 10px;">
                        <canvas id="dealChart"></canvas>
                    </v-card>
                    <div style="height:8px;"></div>
                    <div style="height:10px margin-inline: 10px;">
                        <v-data-table style="margin-inline: 10px;" :headers="headers" :items="desserts"
                            :items-per-page="5" class="elevation-1">
                        </v-data-table>
                    </div>
                </v-card>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
//import Chart from 'chart.js';


export default {
    data() {
        return {
            dialog: false,
            title: '',
            location: '',
            type: '',
            headers: [
                { text: '거래일자', value: 'dealDate' },
                { text: '면적', value: 'area' },
                { text: '층', value: 'floor' },
                { text: '형태', value: 'type' },
                { text: '거래가격', value: 'amount' },
            ],
            desserts: [],
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            data: {
                labels: this.labels,
                datasets: [{
                    label: '',
                    backgroundColor: 'rgb(255, 0, 0,0.1)',
                    borderColor: 'rgb(255, 0, 0,0.7)',
                    data: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
                }]
            },
            config: {
                type: 'scatter',
                data: this.data,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Value'
                            },
                        }
                    }
                }
            },
            chart: null,
        }
    },
    mounted() {

    },
    computed: {
        selectDealLocation() {
            return this.$store.state.location.selectDealLocation;
        },
        selectLocationDeals() {
            return this.$store.state.location.selectLocationDeals;
        }
    },
    watch: {
        dialog(newVal, oldVal) {
            console.log('dialog:', newVal)
            console.log(this.selectDealLocation);
        },
        selectDealLocation(newVal, oldVal) {
            this.title = `${newVal[2]} `;
            this.location = `[${newVal[0]} ${newVal[1]}]`;
            this.dialog = true;
            this.$store.dispatch('location/selectLocationDeals', newVal)
        },
        selectLocationDeals(newVal, oldVal) {
            this.dataInstall(newVal);
        }
    },
    methods: {
        amountToString(amount) {
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
        creatChart() {
            console.log('update!')
            if (this.chart) {
                this.chart.update();
            } else {
                this.config.data = this.data;
                const myChart = new Chart(
                    document.getElementById('dealChart'),
                    this.config
                );
                this.chart = myChart;
            }
        },
        dataInstall(data) {
            const desserts = this.desserts; //표 정보
            const datasets = this.data.datasets //차트 정보
            const chartData = {}
            const date = new Date();
            desserts.splice(0);
            datasets.splice(0);
            for (const deal of data) {
                desserts.push({
                    dealDate: `${deal.deal_year}.${deal.deal_month}.${deal.deal_day}`,
                    area: `${deal.area}㎡`,
                    floor: `${deal.floor}`,
                    type: `${deal.house_type}`,
                    amount: this.amountToString(deal.deal_amount),
                });
                if (!chartData[`${Math.round(deal.area)}㎡`]) {
                    chartData[`${Math.round(deal.area)}㎡`] = [];
                }
                chartData[`${Math.round(deal.area)}㎡`].push({ x: (deal.deal_year - date.getFullYear()) * 12 + (deal.deal_month - (date.getMonth() + 1)), y: deal.deal_amount / 10000 });
            }
            for (const key in chartData) {
                const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
                datasets.push({
                    label: key,
                    backgroundColor: color + ', 0.75',
                    borderColor: color + ', 1',
                    data: chartData[key]
                })
            }

            this.creatChart();
        }
    }

}
</script>

<style>
</style>