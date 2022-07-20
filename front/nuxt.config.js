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
  server: {
    port: process.env.PORT || 3000,
  }
}