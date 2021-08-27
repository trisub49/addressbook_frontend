<template>
  <v-container class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 mx-auto text-center" fluid>
    <AddCategory />
    <v-simple-table class="mt-5 blue-grey lighten-4" v-if="categories.length > 0">
      <thead class="blue-grey lighten-2">
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
            <EditCategory :category="category" />
            <v-btn icon color="red" @click="deleteCategory(category.id)">
              <v-icon>mdi-delete-outline</v-icon
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container class="text-h6 pa-15" fluid v-if="categories.length == 0">
       A kategória lista üres.
    </v-container>
  </v-container>
</template>

<script>
import axios from 'axios';
import AddCategory from '@/components/AddCategory.vue';
import EditCategory from '@/components/EditCategory.vue';

export default {
  components: {
    AddCategory,
    EditCategory
  },
  data() {
    return {
      categories: [ ]
    }
  },
  created() {
    axios.get(`${process.env.VUE_APP_API}/category`)
    .then(response => {
      this.categories = response.data
      console.log(response.data);
    })
    .catch(error => alert(error));
  },
  methods: {
    deleteCategory(id) {
      axios.delete(`${process.env.VUE_APP_API}/category/${id}`)
      .then(response => {
        if(response.status == 200) {
          this.categories = this.categories.filter(p => p.id != id);
        }
      })
      .catch(error => alert(error));
    }
  }
}

</script>
