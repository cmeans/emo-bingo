<template>
   <v-dialog
    v-model="show"
    persistent
    max-width="290"
    >
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
        sort-by="wins"
        :sort-desc=true
      ></v-data-table>
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
   </v-dialog>
</template>

<script>
import { API } from 'aws-amplify';
import { listStatss } from '../graphql/queries';

export default {
  name: 'LeaderBoard',

  props: {
    value: Boolean,
  },
  data: () => ({
    headers: [
      {
        text: 'User',
        align: 'start',
        filterable: true,
        value: 'owner',
      },
      { text: 'Wins', value: 'wins' },
      { text: 'Losses', value: 'losses' }
    ],
    items: [],
    search: null
  }),
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    async value(newValue) {
      if (newValue) {
        this.items = await this.getItems();
      }
    }
  },
  methods: {
    async getItems() {
      const response =
        await API.graphql({ query: listStatss });

      return response.data.listStatss.items;
    }
  }
}
</script>
