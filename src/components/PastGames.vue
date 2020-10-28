<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      dense
      mobile-breakpoint="sm"
      :headers="headers"
      :items="items"
      :search="search"
      sort-by="createdAt"
      :sort-desc=true
    >
      <!-- <template v-slot:item.full_name="{ item }">{{item.createdAt - item.createdAt}}</template> -->
    </v-data-table>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click.stop="show = false"
      >
        OK
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { API } from 'aws-amplify';
import { listGames } from '../graphql/queries';

export default {
  name: 'PastGames',

  props: {
    value: Boolean,
  },
  data: () => ({
    username: '',
    headers: [
      {
        text: 'State',
        align: 'start',
        filterable: true,
        value: 'status',
      },
      {
        text: 'Started At',
        align: 'start',
        filterable: false,
        value: 'createdAt',
      },
      {
        text: 'Last Updated',
        align: 'start',
        filterable: false,
        value: 'updatedAt',
      },
      {
        text: 'Full Name',
        value: 'full_name'
      }
    ],
    items: [],
    search: null
  }),
  async created() {
    //await this.init();
    this.items = await this.getGames();
    console.log(this.items);
  },
  methods: {
    async init() {
      //const owner = await Auth.currentAuthenticatedUser();
      //this.username = owner.username;
    },
    async getGames() {
      const response =
        await API.graphql({ query: listGames });

      return response.data.listGames.items;
    }
  }
}
</script>
