<template>
  <v-dialog max-width="480" v-model="dialogEx">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="!edit" dense color="success" v-bind="attrs" v-on="on">
        Kategória hozzáadás
      </v-btn>
      <v-btn v-else icon color="blue" v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="text-center">
          Kategória {{edit ? "módosítás" : "hozzáadás"}}
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="category.name"
              solo dense 
              required 
              label="Név" 
              :error-messages="errors.name"
              @keyup="errors.name = ''"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn width="33%" :loading="loading" color="success" rounded @click="submitForm()">
            {{edit ? "Módosít" : "Hozzáad"}}
          </v-btn>
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
  props: [
    'toedit',
    'edit'
  ],
  created() {
    if(this.edit == true) {
      this.category = Object.assign({}, this.toedit);
    }
  },
  data() {
    return {
      category: { id: '', name: ''},
      loading: false,
      dialogEx: false,
      errors: { name: '' }
    }
  },
  methods: {
    submitForm() {
      if(!this.category.name.length) {
        this.errors.name = "A név mező kitöltése kötelező!";
        return;
      }
      this.loading = true;
      if(this.edit) {
        this.updateCategory();
      } else {
        this.addCategory();
      }
    },
    addCategory() {
      axios.post(`${process.env.VUE_APP_API}/category`, {
        name: this.category.name
      })
      .then(response => {
        if(response.status == 201) {
          this.loading = false;
          this.dialogEx = false;
          this.$emit("addToCategories_", response.data);
          this.category = {id: '', name: ''};
        }
      })
      .catch(() => {
        this.loading = false;
        alert("Szerver oldali hiba.");
      });
    },
    updateCategory() {
      axios.put(`${process.env.VUE_APP_API}/category/${this.category.id}`, {
        name: this.category.name
      })
      .then(response => {
        if(response.status == 200) {
          this.loading = false;
          this.dialogEx = false;
          this.$emit("updateCategory_", response.data);
          this.category = {id: '', name: ''};
        }
      })
      .catch(() => {
        this.loading = false;
        alert("Szerver oldali hiba.");
      });
    }
  }
}
</script>
