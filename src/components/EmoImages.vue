<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
      >
        <v-btn-toggle
          v-model="imageSize"
          mandatory
        >
          <v-btn :value="2">
            Small
          </v-btn>
          <v-btn :value="3">
            Medium
          </v-btn>
          <v-btn :value="6">
            Large
          </v-btn>
          <v-btn :value="12">
            Whopping!
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="entry in entries"
        :key="entry.id"
        class="d-flex child-flex"
        :cols="imageSize"
      >
        <v-badge
          bordered
          icon="mdi-lock"
          overlap
        >
          <v-img
            :src="entry.imageUrl"
            :lazy-src="entry.imageUrl"
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
            <v-chip
              class="ma-2"
              @click="removeEntry(entry)"
              bottom
            >
              {{ entry.name }}
              <v-icon right>
                mdi-delete
              </v-icon>
            </v-chip>
          </v-img>
        </v-badge>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { API, Storage } from 'aws-amplify';
  import { listEntrys } from '../graphql/queries';
  import { deleteEntry } from '../graphql/mutations';

  export default {
    name: 'EmoImages',

    data: () => ({
      imageSize: 300,
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
        const apiData = await API.graphql({ query: listEntrys});
        const entriesFromAPI = apiData.data.listEntrys.items;

      console.log(entriesFromAPI)
        await Promise.all(entriesFromAPI.map(async entry => {
          if (entry.image) {
            const imageUrl = await Storage.get(entry.image);
            entry.imageUrl = imageUrl;

            const img = await Storage.get(entry.image, { maxkeys: 4 }  , false)
            console.log(img)
            // const tagging = await Storage.getTagging(entry.image);
            // console.log(tagging);
          }
          return entry;
        }));

        this.setEntries(entriesFromAPI);
      },
      setEntries(list) {
        this.entries = list;
      },
      async removeEntry(entry) {
        console.log("Deleting:", entry);

        const newEntries = this.entries.filter(note => note.id !== entry.id);
        this.setEntries(newEntries);

        await API.graphql({ query: deleteEntry, variables: { input: { id: entry.id }}});

        console.log("Removing file:", entry.image)
        Storage.remove(entry.image)
          .then(result => console.log(result))
          .catch(err => console.log(err));
      }
    }
  }
</script>
