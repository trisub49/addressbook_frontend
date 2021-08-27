<template>
  <v-dialog max-width="480">
    <template v-slot:activator="{ on, attrs }">
      <v-btn rounded dense color="success" v-bind="attrs" v-on="on">
        Kategória hozzáadása
        <v-icon> mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="text-center">
          Kategória hozzáadás
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="categoryName"
              solo dense 
              required 
              label="Név" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn width="33%" color="success" rounded @click="submitForm()">Hozzáadás</v-btn>
          <v-spacer />
          <v-btn width="33%" color="primary" rounded @click="dialog.value = false">Vissza</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categoryName: ''
    }
  },
  methods: {
    submitForm() {
      axios.post(`${process.env.VUE_APP_API}/category`, {
        name: this.categoryName
      })
      .then(response => {
        if(response.status == 200) {
          window.location.reload();
        }
      });
    }
  }
}
</script>
