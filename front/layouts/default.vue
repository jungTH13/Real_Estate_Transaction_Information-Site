<template>
  <div>

    <nuxt />
  </div>
</template>

<script>

export default {
  components: {

  },
  head() {
    return {
      title: 'RETIS',
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" },
        { charset: "UTF-8" },
        { 'http-equiv': "X-UA-Compatible", content: "IE=edge" }
      ],
      script: [
        { type: "text/javascript", src: "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=optwmz6a2n&submodules=geocoder", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/chart.js" }

      ],
    }
  }
}
</script>

<style>
</style>