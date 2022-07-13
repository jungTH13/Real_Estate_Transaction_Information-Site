<template>
  <div class="invisible">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="search" permanent class="searchList" id="box">

      <v-list-item class="searchTitle" style="padding:0px 10px 0px 10px;">
        <v-btn icon hide-details @click.stop="search = !search">
          <v-icon hide-details>mdi-database-search-outline</v-icon>
          <div id="searchCount">
            <span style="font-size:3px;color:blue;">{{ visibleDealsIndex.length }}</span>
          </div>
        </v-btn>
        <v-list-item-title style="text-align: center;">
          <v-form @submit.prevent="searchName">
            <v-card :style="{ display: 'flex', height: '100%', alignItems: 'center', padding: '0px 0px 3px 10px' }">
              <v-text-field v-model="searchText" label="검색" hide-details :style="{ display: 'flex', alignItems: 'center' }"
                @input="onChangeText" />
            </v-card>
          </v-form>
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense v-if="!search">
        <div style="min-height: 300px; max-height: 300px; overflow:auto;" class="dealListBox" id="dealListBox">
          <v-list-item v-for="i in searchDealList" v-if="dealList[i]" :key="i" link class="searchResult">
            <v-list-item-content>
              <v-list-item-title style="font-weight:700">{{ dealList[i].name }}</v-list-item-title>
              <tr>
                <td><span style="font-size:3px;color:blue;">{{ dealList[i].house_type }} </span></td>
                <td style="position:absolute; left:70px; bottom:9px;"><span
                    style="font-size:3px;">{{ dealList[i].area }}㎡</span></td>
                <td style="position:absolute; left:170px; bottom:9px"><span
                    style="font-size:3px;">{{ amountToString(dealList[i].deal_amount) }}</span></td>
              </tr>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>


    </v-navigation-drawer>
  </div>


</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      search: true,
      mini: true,
      searchText: '',
      refresh: false,
      searchDealList: [],
    }
  },
  mounted() {
    window.addEventListener('wheel', this.onScroll);
  },
  beforeDestroy() {
    window.addEventListener('wheel', this.onScroll);
  },
  computed: {
    dealList() {
      return this.$store.state.dealList.dealList;
    },
    visibleDealsIndex() {
      return this.$store.state.dealList.visibleDealsIndex;
    },
    refreshList() {
      return this.$store.state.dealList.refreshList;
    }
  },
  watch: {
    refreshList(newVal, oldVal) {
      console.log("refreshList active")
      this.searchDealList.splice(0)
      if (!this.search) {
        let target = document.getElementById('dealListBox');
        if (target.scrollHeight == target.clientHeight) {
          this.onScroll();
        } else {
          setTimeout(this.onScroll, 100);
        }
      }
    },
    search(newVal, oldVal) {
      if (!newVal) {
        setTimeout(this.onScroll, 100);
      }
    }
  },
  methods: {
    searchName() {

    },
    async onScroll() {
      let target = document.getElementById('dealListBox');

      if (target.scrollHeight - 300 < target.clientHeight + target.scrollTop) {
        if (this.visibleDealsIndex.length > this.searchDealList.length) {
          await this.addDealList();
        }
      }
    },
    async addDealList() {
      let set = [];
      let start = this.searchDealList.length;
      let step = 100;
      let end = this.visibleDealsIndex.length;
      console.log("end", end)

      if (end < (start + step)) {
        step = end - start;
      }
      this.searchDealList = this.searchDealList.concat(this.visibleDealsIndex.slice(start, start + step));

      console.log("searchDealList:", this.searchDealList.length)
    },
    onChangeText(text) {

    },
    amountToString(amount) {
      let result = '';
      let a = parseInt(amount / 10000);
      let b = amount % 10000;
      if (a) {
        result += `${a}억`
      }
      if (b) {
        result += `${b}만`
      }
      return result
    }
  }
}
</script>

<style>
.searchTitle {
  background-color: #ffffffaa;
}

.searchResult {
  scrollbar-width: none;
  background-color: #ffffffaa;
}

.invisible {
  background-color: #00000000;
}

#searchCount {
  position: absolute;
  align-items: 'center';
  left: 1px;
  top: 20px;
  width: 35px;
}

#box {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 8px;
}

#dealListBox::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera*/
}
</style>