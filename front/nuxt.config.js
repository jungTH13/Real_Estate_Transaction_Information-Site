module.exports = {
  head: {
    title: 'NodeBird',
  },
  modules: [
    '@nuxtjs/axios',
  ],
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  plugins: [

  ],
  vuetify: {

  },
  axios: {
    browserBaseURL: process.env.NODE_ENV === 'production' ? 'http://13.125.152.146' : 'http://127.0.0.1:7000',
    baseURL: process.env.NODE_ENV === 'production' ? 'http://13.125.152.146' : 'http://127.0.0.1:7000',
    https: false,
  },
  server: {
    port: process.env.PORT || 3000,
  }
}