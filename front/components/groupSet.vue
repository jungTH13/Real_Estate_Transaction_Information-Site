<template>
  <div class="invisible">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="search" permanent class="searchList" id="box">

      <v-list-item class="searchTitle" style="padding:0px 10px 0px 10px">
        <v-btn icon hide-details @click.stop="search = !search" >
            <v-icon hide-details>mdi-tune-variant</v-icon>
        </v-btn>
        <v-list-item-title style="text-align: center;">검색 조건 설정</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense v-if="!search">
        <v-list-item link class="searchResult">
          <v-list-item-icon>
            <v-icon>mdi-calendar-multiple-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-card flat color="transparent">
              <v-subheader class="subtitle">
                <span v-text="firstTitleName"></span>
              </v-subheader>
              <v-range-slider
                      v-model="range"
                      :max="max"
                      :min="min"
                      hide-details
                      class="align-center"
                    >
              </v-range-slider>
            </v-card>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link class="searchResult">
          <v-list-item-icon>
            <v-icon>mdi-home-city</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
              <v-row align="center" justify="space-around">
                <v-card v-for="typeName in ['오피스텔','아파트','연립다세대']" :key="typeName">
                  <v-btn class="typeBtn" v-if="options.type[typeName]" depressed color="primary" @click="changType(typeName)">
                    <span style="font-size:3px;">{{typeName}}</span>
                  </v-btn>
                  <v-btn v-if="!options.type[typeName]" depressed @click="changType(typeName)">
                    <span>{{typeName}}</span>
                  </v-btn>
                </v-card>
              </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link class="searchResult">
          <v-list-item-icon>
            <v-icon>mdi-currency-krw</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-card flat color="transparent">
              <v-subheader class="subtitle">
                <span v-text="secondTitleName"></span>
              </v-subheader>
              <v-range-slider
                      v-model="amountRange"
                      :max="amountMax"
                      :min="amountMin"
                      hide-details
                      class="align-center"
                    >
              </v-range-slider>
            </v-card>
          </v-list-item-content>
        </v-list-item>
      
      
      </v-list>

      

    </v-navigation-drawer>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        search: true,
        mini:true,

        firstTitleName:'',
        min: -60,
        max: 0,
        range: [-12, 0],
        date:{
          min:[new Date().getFullYear(),new Date().getMonth()+1,-1,0],
          max:[new Date().getFullYear(),new Date().getMonth()+1,0,0]
        },

        secondTitleName:'',
        amountMin:1,
        amountMax:1000,
        amountRange:[1,1000],
        amountScale:1000
        
      }
    },
    mounted(){
      this.setDate(this.range);
      this.amountMax=this.options.AMOUNTMAX/this.amountScale;
      this.amountRange[1]=this.options.AMOUNTMAX/this.amountScale;
      this.setAmount(this.amountRange,this.amountScale);
      console.log(this.amountRange);
    },
    computed:{
        options(){
            return this.$store.state.dealList.options;
        }
    },
    watch:{
      range(newVal,oldVal){
          this.setDate(newVal);
      },
      amountRange(newVal,oldVal){
        this.setAmount(newVal,this.amountScale);
      }
    },
    methods:{
      setAmount(amount,scale){
        amount=[amount[0]*scale,amount[1]*scale];
        this.$store.dispatch('dealList/setAmount',amount)
        if(amount[1]==this.options.AMOUNTMAX){
          this.secondTitleName=`${this.amountToString(amount[0])} ~ `
        }else{
        this.secondTitleName=`${this.amountToString(amount[0])} ~ ${this.amountToString(amount[1])}`
        }
      },
      amountToString(amount){
            let result='';
            let a =parseInt(amount/10000);
            let b = amount%10000;
            if(a){
                result+=`${a}억`
            }
            if(b){
              result+=`${b}만`
            }
            return result
      },
      changType(typeName){
        this.$store.dispatch('dealList/changeType',typeName);
      },
      setDate(range){
        let min = range[0];
        
        this.date.min[2]=(parseInt(min/12))
        if(1>(min%12+this.date.min[1])){
          this.date.min[2]--;
          this.date.min[3]=12+(min%12);
        }else{
          this.date.min[3]=min%12;
        }

        let max = range[1];
        
        this.date.max[2]=(parseInt(max/12))
        if(1>(max%12+this.date.max[1])){
          this.date.max[2]--;
          this.date.max[3]=12+(max%12);
        }else{
          this.date.max[3]=max%12;
        }
        this.$store.dispatch('dealList/setDate',{
          min:[this.date.min[0]+this.date.min[2],this.date.min[1]+this.date.min[3]],
          max:[this.date.max[0]+this.date.max[2],this.date.max[1]+this.date.max[3]]
        });
        this.firstTitleName=`${this.date.min[0]+this.date.min[2]}년 ${this.date.min[1]+this.date.min[3]}월~${this.date.max[0]+this.date.max[2]}년 ${this.date.max[1]+this.date.max[3]}월`
      }
    }
  }
</script>

<style>
.searchTitle{
    background-color: #ffffffaa;
}
.searchResult{
    background-color: #ffffffaa;
}
.subtitle{
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.invisible{
  background-color: #00000000;
}
#box{
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 8px;
}
</style>