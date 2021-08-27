<template>
  <v-container class="col-12 mx-auto text-center pa-0 pt-5" fluid>
    <AddPerson />
    <v-simple-table class="blue-grey lighten-4 mt-5" dense v-if="persons.length > 0">
      <thead class="blue-grey lighten-2">
        <tr>
          <td class="identifier">#</td>
          <td class="name">Név</td>
          <td class="email">Email</td>
          <td class="phone">Telefonszám</td>
          <td class="categories">Kategória</td>
          <td class="date">Dátum</td>
          <td class="actions">Műveletek</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in persons" :key="person.id">
          <td class="identifier">{{person.id}}</td>
          <td class="name">{{person.name}}</td>
          <td class="email">{{person.email}}</td>
          <td class="phone">{{person.phone_number}}</td>
          <td class="categories">
            <span v-for="category in person.categories" :key="category">
              {{category}}
            </span>
          </td>
          <td class="date">{{person.created_date}}</td>
          <td class="actions">
            <EditPerson :person="person"/>
            <v-btn icon color="red" @click="deletePerson(person.id)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container class="text-h6 pa-15" fluid v-if="persons.length == 0">
       A címzettek listája üres.
    </v-container>
  </v-container>
</template>

<style scoped>

thead {
  font-weight: bold;
}
.identifier {
  width: 5%;
}
.actions {
  width: 10%;
}
.name, .email, .date, .phone {
  width: 10%;
}
.categories {
  width: 40%;
}

</style>

<script>
import axios from 'axios';
import AddPerson from '@/components/AddPerson.vue';
import EditPerson from '@/components/EditPerson.vue';

export default {
  components: {
    AddPerson,
    EditPerson
  },
  data() {
    return {
      persons: [ ]
    }
  },
  created() {
    axios.get(`${process.env.VUE_APP_API}/person`)
    .then(response => this.persons = response.data)
    .catch(error => alert(error));
  },
  methods: {
    deletePerson(id) {
      axios.delete(`${process.env.VUE_APP_API}/person/${id}`)
      .then(response => {
        if(response.status == 200) {
          this.persons = this.persons.filter(p => p.id != id);
        }
      })
      .catch(error => alert(error));
    }
  }
}
</script>
