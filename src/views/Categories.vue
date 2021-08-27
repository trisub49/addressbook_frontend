<template>
  <v-container class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 mx-auto text-center" fluid>
    <AddCategory />
    <v-simple-table class="mt-5 blue-grey lighten-4">
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
            <v-btn icon color="blue">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon color="red">
              <v-icon>mdi-delete-outline</v-icon
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import AddCategory from '@/components/AddCategory.vue';

export default {
  components: {
    AddCategory
  },
  data() {
    return {
      categories: [
        {id: '0', name: "elsőkat"},
        {id: '1', name: 'másodkat'}
      ]
    }
  },
  created() {
    axios.get(`${process.env.VUE_APP_API}/category`)
    .then(response => this.categories = response.data)
    .catch(error => alert(error));
  }
}

</script>
