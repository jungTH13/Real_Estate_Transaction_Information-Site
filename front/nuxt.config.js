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
    browserBaseURL: process.env.NODE_ENV === 'production' ? 'http://18.214.173.244' : 'http://127.0.0.1:7000',
    baseURL: process.env.NODE_ENV === 'production' ? 'http://18.214.173.244' : 'http://127.0.0.1:7000',
    https: false,
  },
  server: {
    port: process.env.PORT || 3000,
  }
}