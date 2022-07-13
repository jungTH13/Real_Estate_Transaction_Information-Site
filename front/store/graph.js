export const state = () => ({
    tradingVolumList: {},
    amountAVGList: {},
    changeType: 0,
})

export const mutations = {
    setTradingVolum(state, payload) {
        state.tradingVolumList = payload;
    },
    setAmountAVGList(state, payload) {
        state.amountAVGList = payload;
    },
    setChangeType(state, payload) {
        state.changeType = (state.changeType + 1) % 2;
        console.log(state.changeType);
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
    },
    async setAmountAVGList({ commit }, payload) {
        await this.$axios.post('http://127.0.0.1:7000/amountAVG', {
            mapState: payload
        })
            .then(async (res) => {
                commit('setAmountAVGList', res.data.data)
            })
            .catch((error) => {
                console.error(error);
            })
    },
    async setChangeType({ commit }, payload) {
        commit('setChangeType')
    }
}