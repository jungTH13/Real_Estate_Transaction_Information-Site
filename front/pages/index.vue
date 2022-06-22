<template>
    <v-app>
        <div class="searchbox">
            <div class="funcBox" >
                <SearchResult></SearchResult>
            </div>
            <div class="funcBox">
                <GroupSet></GroupSet>
            </div>
        </div>

        <div class="grafBox">
            <Graph></Graph>
        </div>
        
        <nav class="navBar">
            <v-toolbar dark color="green">
                <v-toolbar-title >
                    <nuxt-link to="/">NodeBird</nuxt-link>
                </v-toolbar-title>
                <v-toolbar-items style="margin-left:20px">
                    <v-form @submit.prevent="searchPlace">
                        <div :style="{display: 'flex',height:'100%',alignItems:'center'}">
                            <v-text-field v-model="searchText" label="검색" hide-details prepend-icon="mdi-magnify" :style="{display: 'flex', alignItems:'center'}" @input="onChangeText" />
                        </div>
                    </v-form>
                </v-toolbar-items>
                <v-spacer />
                <v-toolbar-items>
                    <v-btn text nuxt to="/profile">
                        <div>프로필</div>
                    </v-btn>
                    <v-btn text nuxt to="/signup">
                        <div>회원가입</div>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </nav>
        <NaverMap :search="searchspot"></NaverMap>
    </v-app>

</template>

<script>
    import NaverMap from '~/components/NaverMap.vue'
    import SearchResult from '../components/searchResult.vue';
    import GroupSet from '../components/groupSet.vue';
    import Graph from '~/components/graph.vue';

    export default {
        data(){
            return{
                searchText:'',
                searchList: false,
                searchspot:'',
                geocodePoint:null,
            }
        },
        computed:{
            mapState(){
                return this.$store.state.dealList.mapState;
            },
            dealList(){
                return this.$store.state.dealList.dealList;
            }
        },
        watch:{
            dealList(newVal,oldVal){
                console.log(newVal)
            }
        },
        components: {
            NaverMap,
            SearchResult,
            GroupSet,
            Graph
        },
        methods:{
            searchPlace(){
                const keyword = this.searchText.trim();
                this.searchText=''
                console.log(keyword)
                this.searchspot=keyword;
                if(keyword.length===0){
                    return;
                }else{
                    this.searchList=true;
                }
            },
            onChangeText(text){
                
            }
        },
        mounted(){
        },
    }

</script>

<style scoped>
a{
    color: inherit;
    text-decoration: none;
}
.navBar{
    position:absolute;
    top: 0;
    left:0;
    width: 100%;
    z-index: 10000;
    background-color: #ffffffaa;
    overflow-y: auto;
}
.searchbox{
    position:absolute;
    top: 100px;
    left: 10px;
    z-index: 10000;
    background-color: #ffffff00;
    overflow-y: auto;
}
.grafBox{
    position:absolute;
    bottom: 50px;
    right: 10px;
    z-index: 10000;
    background-color: #ffffff00;
    overflow-y: auto;
}
.box{
    position:absolute;
    top: 200px;
    left: 10px;
    z-index: 10000;
    background-color: #ffffffaa;
    overflow-y: auto;
}
.funcBox{
  margin-bottom: 10px;
  margin-right: 4px;
  background-color: #00000000;
}
.invisible{
  background-color: #00000000;
}
</style>