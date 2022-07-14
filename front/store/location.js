export const state = () => ({
    locationTableList: [],
    locationFixed: false,
})

export const mutations = {
    setLocationTableList(state, payload) {
        state.locationTableList = payload;
    },
    setLocationFixed(state, payload) {
        state.locationFixed = payload;
    }

}

export const actions = {
    async setLocationTableList({ commit }, payload) {
        await this.$axios.post('http://127.0.0.1:7000/searchLcationAndDong', {
            mapState: payload
        })
            .then(async (res) => {
                commit('setLocationTableList', res.data.data);
            })
            .catch((error) => {
                console.error(error);
            })

    },
    async setLocationFixed({ commit }, payload) {
        commit('setLocationFixed', payload);
    },
}