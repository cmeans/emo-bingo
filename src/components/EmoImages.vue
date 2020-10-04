<template>
  <v-container>
    <v-row>
      <v-col
        v-for="entry in entries"
        :key="entry.id"
        class="d-flex child-flex"
        cols="2"
      >
        <v-badge
          bordered
          icon="mdi-lock"
          overlap
        >
          <div>{{ entry.name }}</div>
          <v-img
            :src="entry.image"
            :lazy-src="entry.image"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-badge>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { API } from 'aws-amplify';
  import { listEntrys } from '../graphql/queries';

  export default {
    name: 'EmoImages',

    data: () => ({
      entries: []
    }),
    mounted() {
      this.fetchEntries();

      this.$root.$on('entries-changed', () => {
        this.fetchEntries();
      });
    },
    methods: {
      async fetchEntries() {
        const apiData = await API.graphql({ query: listEntrys });
        this.setEntries(apiData.data.listEntrys.items);
      },
      setEntries(list) {
        this.entries = list;
      }
    }
  }
</script>
