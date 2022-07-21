export const state = () => ({
    tradingVolumList: {},
    amountAVGList: {},
    changeType: 0,
    labelCount: 0,
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
    },
    setLabelCount(state, payload) {
        state.labelCount = payload;
    }
}

export const actions = {
    async setTradingVolum({ commit }, payload) {
        await this.$axios.post('/traingVolum', {
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
        await this.$axios.post('/amountAVG', {
            mapState: payload
        })
            .then(async (res) => {
                commit('setAmountAVGList', res.data.data)
            })
            .catch((error) => {
                console.error(error);
            })
    },
    async setTradingVolumByLocation({ commit }, payload) {
        await this.$axios.post('/locationFixed/traingVolum', {
            location: payload
        })
            .then(async (res) => {
                commit('setTradingVolum', res.data.data)
            })
            .catch((error) => {
                console.error(error);
            })
    },
    async setAmountAVGListByLocation({ commit }, payload) {
        await this.$axios.post('/locationFixed/amountAVG', {
            location: payload
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
    },
    async setLabelCount({ commit }, payload) {
        commit('setLabelCount', payload);
    }
}