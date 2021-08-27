<template>
  <v-dialog max-width="480">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon color="blue" v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title class="text-center">
          Címzett szerkesztés
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="loadedPerson.name"
              outlined dense 
              required 
              label="Név" 
            />
            <v-text-field 
              v-model="loadedPerson.email"
              outlined dense 
              required 
              label="Email cím" 
            />
            <v-text-field 
              v-model="loadedPerson.phoneNumber"
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
            <span v-for="category in loadedPerson.categories" :key="category" class="categoryblock">
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
  props: [ 'person' ],
  data() {
    return {
      nextCategory: '',
      loadedPerson: this.person
    }
  },
  methods: {
    submitForm() {
      axios.put(`${process.env.VUE_APP_API}/person/${this.loadedPerson.id}`, {
        name: this.loadedPerson.name,
        email: this.loadedPerson.email,
        phoneNumber: this.loadedPerson.phoneNumber,
        categories: this.loadedPerson.categories
      })
      .then(response => {
        if(response.status == 200) {
          window.location.reload();
        }
      });
    },
    addCategory() {
      this.loadedPerson.categories.push(this.nextCategory);
      this.nextCategory = "";
    },
    deleteCategory(category) {
      this.loadedPerson.categories = this.loadedPerson.categories.filter(c => c != category);
    }
  },
}
</script>
