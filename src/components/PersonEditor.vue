<template>
  <v-dialog max-width="480" v-model="dialogEx">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="getCategorieNames()" v-if="edit == true" icon color="blue" v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn @click="getCategorieNames()" v-else color="success" v-bind="attrs" v-on="on">
        Címzett hozzáadás
      </v-btn>
    </template>
    <template>
      <v-card>
        <v-card-title class="text-center">
         Címzett {{ edit ? "módosítása" : 'hozzáadása'}}
        </v-card-title>
        <v-card-text>
          <v-form class="col-12">
            <v-text-field 
              v-model="loadedPerson.name"
              outlined dense 
              required 
              label="Név" 
              :error-messages="errors.name"
              @keyup="errors.name = ''"
            />
            <v-text-field 
              v-model="loadedPerson.email"
              outlined dense 
              required 
              label="Email cím" 
              :error-messages="errors.email"
              @keyup="errors.email = ''"
            />
            <v-text-field 
              v-model="loadedPerson.phone_number"
              outlined dense 
              required 
              label="Telefonszám" 
              :error-messages="errors.phone_number"
              hint="Formátum: 36xx1112222"
              @keyup="errors.phone_number = ''"
            />
            <v-row>
              <v-col>
                <v-select
                  :disabled="!categoryNames.length"
                  label="Kategória hozzáadás" 
                  :items="categoryNames" 
                  v-model="nextCategory" 
                  outlined dense
                  :error-messages="errors.categories"
                  :append-icon="nextCategory.length ? 'mdi-plus' : ''"
                  @click:append="addCategory()"
                  @click="errors.categories = ''"
                >
                </v-select>
              </v-col>
              <v-col>
              </v-col>
            </v-row>
            <span v-if="!categoryNames.length" class="blue--text">
              Jelenleg nem tudsz címzettet hozzáadni, mert nincs kategória létrehozva.
            </span>
            <span v-for="category in loadedPerson.categories" :key="category.id" class="categoryblock">
              {{category.name}}
              <v-btn icon @click="deleteCategory(category)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </span>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn width="33%" :loading="loading" color="success" rounded @click="submitForm()" :disabled="!categoryNames.length">
            {{ edit == true ? "Módosít" : 'Hozzáad'}}
          </v-btn>
          <v-spacer />
          <v-btn width="33%" color="primary" rounded @click="dialogEx = false">Vissza</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

.categoryblock {
  background-color: white;
  font-weight: bold;
  padding: 10px;
  margin: 5px;
  border: 0.5px solid lightgray;
  border-radius: 10px 10px;
}

</style>

<script>
import axios from 'axios';

export default {
  props: [ 'person', 'availableCategories', 'edit' ],
  
  data() {
    return {
      nextCategory: '',

      loadedPerson: {
        name: '',
        email: '',
        phone_number: '',
        created_date: '',
        categories: [ ]
      },

      errors: {
        name: '',
        email: '',
        phone_number: '',
        categories: ''
      },

      categories: [],

      loading: false,
      dialogEx: false,
      categoryNames: []
    }
  },
  created() {
    if(this.edit == true) {
      this.loadedPerson = Object.assign({}, this.person);
    }
  },
  methods: {
    submitForm() {
      if(this.loadedPerson.name.length && this.loadedPerson.email.length && this.loadedPerson.categories.length) {
        this.loading = true;
        if(this.edit == true) {
          this.updatePerson();
        } else {
          this.createPerson();
        }
      } else {
        if(!this.loadedPerson.name.length) { this.errors.name = 'A név mező kitöltése kötelező!' }
        if(!this.loadedPerson.email.length) { this.errors.email = 'Az email mező kitöltése kötelező!' }
        if(!this.loadedPerson.categories.length) { this.errors.categories = 'Minimum 1 kategória megadása kötelező!' }
      }
    },
    createPerson() {
      axios.post(`${process.env.VUE_APP_API}/person`, {
        name: this.loadedPerson.name,
        email: this.loadedPerson.email,
        phone_number: this.loadedPerson.phone_number,
        created_date: this.loadedPerson.created_date,
        categories: this.getCategoryIds()
      })
      .then(response => {
        if(response.status == 201) {
          this.loading = false;
          this.dialogEx = false;
          this.loadedPerson.id = response.data.id;
          this.loadedPerson.created_date = response.data.created_date;         
          this.$emit("addToPeople_", this.loadedPerson);
          this.loadedPerson = {
            name: '',
            email: '',
            phone_number: '',
            created_date: '',
            categories: [ ]
          };
        }
      })
      .catch(error => {
        this.loading = false;
        if(error.response.data == "email error") {
          this.errors.email = "Az email cím nem megfelelő!"
        } else if(error.response.data == "email taken") {
          this.errors.email = "Az email cím már foglalt!"
        } else if(error.response.data == "phone number error") {
          this.errors.phone_number = "A telefonszám formátuma nem megfelelő!";
        } else {
          this.loading = false;
          alert("Szerver oldali hiba.");
        }
      });
    },
    updatePerson() {
      axios.put(`${process.env.VUE_APP_API}/person/${this.loadedPerson.id}`, {
        name: this.loadedPerson.name,
        email: this.loadedPerson.email,
        phone_number: this.loadedPerson.phone_number,
        categories: this.getCategoryIds()
      })
      .then(response => {
        if(response.status == 200) {
          this.loading = false;
          this.dialogEx = false;
          this.$emit("updatePerson_", this.loadedPerson);
          this.loadedPerson = {
            name: '',
            email: '',
            phone_number: '',
            created_date: '',
            categories: [ ]
          };
        }
      })
      .catch(() => {
        this.loading = false;
        alert("Szerver oldali hiba.");
      });
    },

    addCategory() {
      this.loadedPerson.categories.forEach(c => {
        if(c.name == this.nextCategory) {
          this.errors.categories = "Ezt a kategóriát már megadtad!";
          return;
        }
      });
      if(!this.errors.categories.length) {
        this.availableCategories.forEach(c => {
          if(c.name == this.nextCategory) {
            this.nextCategory = "";
            this.loadedPerson.categories.push(c);
            return c.id;
          }
        });
      }
    },
    deleteCategory(category) {
      this.loadedPerson.categories = this.loadedPerson.categories.filter(c => c != category);
    },
    getCategorieNames() {
      this.availableCategories.forEach(category => {
        this.categoryNames.push(category.name);
      });
    },
    getCategoryIds() {
      let array = [];
      this.loadedPerson.categories.forEach(c => array.push(c.id));
      return array;
    }
  }
}
</script>
