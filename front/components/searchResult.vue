<template>
  <div class="invisible">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="search" permanent class="searchList" id="box">

      <v-list-item class="searchTitle">
        <v-btn icon @click.stop="search = !search">
            <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-list-item-title>John Leider</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense v-if="!search">
        <v-list-item v-for="item in items" :key="item.title" link class="searchResult">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
</div>


</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Home', icon: 'mdi-home-city' },
          { title: 'My Account', icon: 'mdi-account' },
          { title: 'Users', icon: 'mdi-account-group-outline' },
        ],
        search: true,
        mini:true,
      }
    },
  }
</script>

<style>

.searchTitle{
    background-color: #ffffffaa;
}
.searchResult{
    background-color: #ffffffaa;
}
.invisible{
  background-color: #00000000;
}
#box{
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 8px;
}
</style>