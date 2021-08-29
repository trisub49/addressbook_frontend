<template>
  <v-container class="col-12 mx-auto text-center px-2 pt-5" fluid v-if="!loading">
    <PersonEditor :edit="false" :availableCategories="categories" @addToPeople_="addToPeople" />
    <v-container class="tablewrapper">
      <v-simple-table class="blue-grey lighten-4 mt-5" dense v-if="people.length > 0">
        <thead class="blue-grey lighten-2 font-weight-bold">
          <tr>
            <td class="identifier">
              #
              <v-btn color="white" icon x-small @click="reSort('id')">
                <v-icon> {{sort.id ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="name">
              Név
              <v-btn color="white" icon x-small @click="reSort('name')">
                <v-icon> {{sort.name ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="email">
              Email
              <v-btn color="white" icon x-small @click="reSort('email')">
                <v-icon> {{sort.email ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="phone">
              Telefon
              <v-btn color="white" icon x-small @click="reSort('phone_number')">
                <v-icon> {{sort.phone_number ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="categories">
              Kategória
              <v-btn color="white" icon x-small @click="reSort('categories')">
                <v-icon> {{sort.categories ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="date">
              Dátum
              <v-btn color="white" icon x-small @click="reSort('created_date')">
                <v-icon> {{sort.created_date ? 'mdi-chevron-down' : 'mdi-chevron-up'}} </v-icon>
              </v-btn>
            </td>
            <td class="actions">Műveletek</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in people" :key="person.id" v-show="person.page == page">
            <td class="identifier">{{person.id}}</td>
            <td class="name" :key="person.name">{{person.name}}</td>
            <td class="email">{{person.email}}</td>
            <td class="phone">
              {{person.phone_number.length ? person.phone_number : "Nincs megadva"}}
            </td>
            <td class="categories">
              <span v-for="category in person.categories" :key="category.id">
              {{category.name}}
              </span>
              <span v-if="!person.categories.length" class="red--text">
                Besorolatlan
              </span>
            </td>
            <td class="date">{{person.created_date}}</td>
            <td class="actions">
              <PersonEditor :edit="true" :person="person" :availableCategories="categories" @updatePerson_="updatePerson" />
              <v-btn icon color="red" @click="deletePerson(person.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-container>
    <v-pagination :length="countPages" v-model="page" v-if="countPages > 1">
    </v-pagination>
  </v-container>
  <v-container v-else class="col-12 mx-auto text-center px-2 pt-15" fluid>
    <v-progress-circular indeterminate />
  </v-container>
</template>

<style scoped>
.tablewrapper {
  height: 450px;
}

.identifier {
  width: 10%;
}
.actions {
  width: 5%;
}
.name, .email, .date, .phone {
  width: 15%;
}
.categories {
  width: auto;
}
.date {
  text-align: right;
}
td {
  text-align: left;
}
tr > td:last-child {
  text-align: right;
}

</style>

<script>
import axios from 'axios';
import PersonEditor from '@/components/PersonEditor.vue';

export default {
  components: {
    PersonEditor
  },
  data() {
    return {
      loading: false,
      page: 1,
      people: [ ],
      categories: [ ],
      sort: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        categories: true,
        created_date: true,
      }
    }
  },
  created() {
    this.fetchInfo();
  },
  methods: {
    fetchInfo() { // címzettek és kategóriák betöltése
      this.loading = true;
      axios.get(`${process.env.VUE_APP_API}/person`)
      .then(response => {
        this.refreshPeople(response.data);
      });

      this.categories = [];
      axios.get(`${process.env.VUE_APP_API}/category`)
        .then(response => {
          this.categories = response.data;
          this.loading = false;
        })
        .catch(error => alert(error)
      );
      
    }, 
    deletePerson(id) {
      axios.delete(`${process.env.VUE_APP_API}/person/${id}`)
      .then(response => {
        if(response.status == 200) {
          this.people = this.people.filter(p => p.id != id);
        }
      })
      .catch(error => console.log(error));
    },
    dynamicSort(property) { // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
      this.sort[property] = !this.sort[property];
      var sortOrder = this.sort[property] ? 1 : -1;
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    },
    reSort(toSort) {
      this.people.sort(this.dynamicSort(toSort));
      this.refreshPeople(this.people);
    },
    addToPeople(person) {
      this.people.push(person);
      this.refreshPeople(this.people);
      console.log(this.people);
    },
    updatePerson(person) {
      this.people.forEach(p => {
        if(p.id == person.id) {
          for (let [key, value] of Object.entries(person)) {
            this.$set(p, key, value);
          }
          return;
        }
      })
    },
    refreshPeople(copy) { // a re-rendereléshez szükséges
      this.people = [];
      copy.forEach(person => {
        person.page = this.people.length / 5;
        person.page = Math.floor(person.page + 1);
        this.people.push(person);
      });
    }
  },
  computed: {
    countPages() {
      return this.people.length % 5 == 0 ? (this.people.length / 5) : (Math.floor(this.people.length / 5) + 1);
    }
  }
}
</script>
