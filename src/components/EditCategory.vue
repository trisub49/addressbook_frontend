<template>
  <v-dialog max-width="480" v-model="dialogEx">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon color="blue" v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="text-center">
          Kategória szerkesztése
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="loadedCategory.name"
              outlined dense 
              required 
              label="Név" 
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loading" width="33%" color="success" rounded @click="submitForm()">Módosítás</v-btn>
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
  props: [ 'category' ],
  data() {
    return {
      nextCategory: '',
      fakeCat: this.category,
      loadedCategory: Object.assign({}, this.category),
      loading: false,
      dialogEx: false,
    }
  },
  methods: {
    submitForm() {
      this.loading = true;
      axios.put(`${process.env.VUE_APP_API}/category/${this.loadedCategory.id}`, {
        name: this.loadedCategory.name
      })
      .then(response => {
        if(response.status == 200) {
          console.log(response.data);
          this.loading = false;
          this.dialogEx = false;
        }
      });
    }
  },
}
</script>
