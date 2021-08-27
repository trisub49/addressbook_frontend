<template>
  <v-dialog max-width="480">
    <template v-slot:activator="{ on, attrs }">
      <v-btn rounded dense color="success" v-bind="attrs" v-on="on">
        Címzett hozzáadása
        <v-icon> mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="text-center">
          Címzett hozzáadás
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="name"
              outlined dense 
              required 
              label="Név" 
            />
            <v-text-field 
              v-model="email"
              outlined dense 
              required 
              label="Email cím" 
            />
            <v-text-field 
              v-model="phone_number"
              outlined dense 
              required 
              label="Telefonszám" 
            />
            <v-row>
              <v-col>
                <v-text-field 
                  v-model="nextCategory"
                  outlined dense 
                  required 
                  label="Kategória hozzáadás" 
                />
              </v-col>
              <v-col>
                <v-btn icon color="blue" @click="addCategory()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <span v-for="category in categories" :key="category" class="categoryblock">
              {{category}} 
              <v-btn icon @click="deleteCategory(category)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </span>
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

<style scoped>

.categoryblock {
  background-color: lightblue;
  padding: 10px;
  margin: 5px;
  border: 0.5px solid lightgray;
  border-radius: 10px 10px;
}

</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      phone_number: '',
      categories: [],
      nextCategory: ''
    }
  },
  methods: {
    submitForm() {
      axios.post(`${process.env.VUE_APP_API}/person`, {
        name: this.name,
        email: this.email,
        phone_number: this.phone_number,
        categories: this.categories
      })
      .then(response => {
        if(response.status == 200) {
          window.location.reload();
        }
      });
    },
    addCategory() {
      this.categories.push(this.nextCategory);
      this.nextCategory = "";
    },
    deleteCategory(category) {
      this.categories = this.categories.filter(c => c != category);
    }
  }
}
</script>
