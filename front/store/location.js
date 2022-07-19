export const state = () => ({
    locationTableList: [], //[[지역구명,지역동명],...]
    locationFixed: false, //고정 지역 선택시 기존 갱신 로직 pause
    selectDealLocation: [], // [지역구명,지역동명,건물명]
    selectLocationDeals: [] //selectLocation의 거래정보
})

export const mutations = {
    setLocationTableList(state, payload) {
        state.locationTableList = payload;
    },
    setLocationFixed(state, payload) {
        state.locationFixed = payload;
    },
    selectDealLocation(state, payload) {
        console.log(payload)
        state.selectDealLocation = payload;
    },
    selectLocationDeals(state, payload) {
        state.selectLocationDeals = payload;
        console.log(state.selectLocationDeals)
    }

}

export const actions = {
    async setLocationTableList({ commit }, payload) {
        await this.$axios.post('http://127.0.0.1:7000/locationFixed/searchLocationAndDong', {
            mapState: payload
        })
            .then(async (res) => {
                commit('setLocationTableList', res.data.data);
            })
            .catch((error) => {
                console.error(error);
            })

    },
    async setLocationFixed({ commit }, bool) {
        commit('setLocationFixed', bool);
    },
    selectDealLocation({ commit }, payload) {
        commit('selectDealLocation', payload);
    },
    async selectLocationDeals({ commit }, selectDealLocation) {
        await this.$axios.post('http://127.0.0.1:7000/selectDealInfo', {
            location: selectDealLocation
        })
            .then(async (res) => {
                commit('selectLocationDeals', res.data.data);
            })
            .catch((error) => {
                console.error(error);
            })

    }
}