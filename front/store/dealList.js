export const state = () => ({
    dealList: [],
    mapState: null,
    options:{
      date:{
        min:[new Date().getFullYear(),new Date().getMonth()+1,-1,0],
        max:[new Date().getFullYear(),new Date().getMonth()+1,0,0]
      },
      type: {
        '오피스텔':true,
        '아파트':true,
        '연립다세대':true,
      },
      amount:[0,1000000],//1=>1만원
      AMOUNTMAX:500000,
    },
    refreshMarker:true,
  });
  
  export const mutations = {
    setDeals(state,payload) {
      state.dealList.splice(0);
      state.dealList=payload;
    },
    setMapState(state,payload){
        state.mapState=payload;
    },
    setDate(state,date){
      state.options.date.min=date.min;
      state.options.date.max=date.max;
      state.options=state.options;

      state.refreshMarker=!state.refreshMarker;
    },
    changeType(state,typeName){
      state.options.type[typeName]=!state.options.type[typeName];
      state.options=state.options;

      state.refreshMarker=!state.refreshMarker;
    },
    setAmount(state,amount){
      state.options.amount=amount;
      state.refreshMarker=!state.refreshMarker;
    }
    
  };

  export const actions = {
    setDeals({commit},payload){
        this.$axios.post('http://127.0.0.1:7000/deal',{
            mapState:payload
        })
        .then(async (res)=>{
            commit('setDeals',res.data.data);
            commit('setMapState',payload);
        })
        .catch((error)=>{
            console.error(error);
        })
    },
    setMapState({commit},payload){
        commit('setMapState',payload);
    },
    setDate({commit},payload){
      commit('setDate',payload);
    },
    changeType({commit},payload){
      commit('changeType',payload);
    },
    setAmount({commit},payload){
      commit('setAmount',payload);
    }
  }