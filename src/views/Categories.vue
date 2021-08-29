<template>
  <v-container class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto text-center px-10 pt-5" v-if="!loading" fluid>
    <CategoryEditor :edit="false" @addToCategories_="addToCategories" />
    <v-simple-table class="mt-5 blue-grey lighten-4 table" v-if="categories.length > 0">
      <thead class="blue-grey lighten-2 font-weight-bold">
        <tr>
          <td>#</td>
          <td>Kategória név</td>
          <td>Műveletek</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{category.id}}</td>
          <td>{{category.name}}</td>
          <td>
            <CategoryEditor :edit="true" :toedit="category" @updateCategory_="updateCategory" />
            <v-btn icon color="red" @click="deleteCategory(category.id)">
              <v-icon>mdi-delete-outline</v-icon
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
  <v-container v-else class="col-12 mx-auto text-center px-2 pt-15" fluid>
    <v-progress-circular indeterminate />
  </v-container>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
td {
  text-align: left;
}
tr > td:last-child {
  text-align: right;
}
.table {
  font-family: 'Roboto', sans-serif;
}
</style>

<script>
import axios from 'axios';
import CategoryEditor from '@/components/CategoryEditor.vue';

export default {
  components: {
    CategoryEditor
  },
  data() {
    return {
      categories: [ ],
      loading: false
    }
  },
  created() {
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      this.loading = true;
      this.categories = [];
      axios.get(`${process.env.VUE_APP_API}/category`)
        .then(response => {
          this.categories = response.data;
          this.loading = false;
        })
        .catch(error => alert(error)
      );
    },
    deleteCategory(id) {
      axios.delete(`${process.env.VUE_APP_API}/category/${id}`)
      .then(response => {
        if(response.status == 200) {
          this.categories = this.categories.filter(p => p.id != id);
        }
      })
      .catch(error => alert(error));
    },
    addToCategories(category) {
      this.categories.push(category);
      this.refreshCategories(this.categories);
      console.log(this.category);
    },
    updateCategory(category) {
      this.categories.forEach(c => {
        if(c.id == category.id) {
          for (let [key, value] of Object.entries(category)) {
            this.$set(c, key, value);
          }
          return;
        }
      })
    },
    refreshCategories(copy) { // a re-rendereléshez szükséges
      this.categories = [];
      copy.forEach(category => {
        this.categories.push(category);
      });
    }
  }
}

</script>
