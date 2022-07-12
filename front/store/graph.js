export const state = () => ({
    tradingVolumList: {},
})

export const mutations = {
    setTradingVolum(state, payload) {
        //delete state.tradingVolumList;
        state.tradingVolumList = payload;
        console.log("***", state.tradingVolumList);
    }
}

export const actions = {
    async setTradingVolum({ commit }, payload) {
        await this.$axios.post('http://127.0.0.1:7000/traingVolum', {
            mapState: payload
        })
            .then(async (res) => {
                commit('setTradingVolum', res.data.data)
            })
            .catch((error) => {
                console.error(error);
            })
    }
}