<template>
    <v-app>
        <no-ssr placeholder="loading...">
            <Test></Test>
        </no-ssr>
    </v-app>

</template>

<script>
    import Test from '~/components/test.vue'

    export default {
        data(){
            return{

            }
        },
        components: {
            Test
        },
        methods:{
        },
        mounted(){
            
        },
    }

</script>

<style scoped>

</style>