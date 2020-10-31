<template>
  <v-card
    elevation="6"
    width="100%"
  >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click.stop="show=true"
      >
        Delete All Game Data and Images
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-data-table
      show-expand
      mobile-breakpoint="sm"
      :headers="headers"
      :items="items"
      sort-by="createdAt"
      :sort-desc=true
      :single-expand="true"
      :expanded.sync="expanded"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getColor(item.status)"
          dark
        >
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ $moment(item.createdAt).format('ddd hh:mma') }}
      </template>
      <template v-slot:item.duration="{ item }">
        {{ $moment.duration($moment(item.updatedAt).diff($moment(item.createdAt))).humanize() }}</template>
      <template v-slot:expanded-item="{ headers }">
      <td :colspan="headers.length">
        <v-data-table
          show-expand
          mobile-breakpoint="md"
          :headers="imageHeaders"
          :items="gameImageItems"
          sort-by="createdAt"
          :sort-desc=false
          :single-expand="true"
          :hide-default-footer="true"
        >
          <template
            v-slot:item.image="{ item }"
          >
            <v-img
              contain
              class="mx-auto ma-2"
              :src="imageData[item.fileName]"
              width="100px"
              height="100px"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="purple"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td
              :colspan="headers.length"
              class="text-left"
            >
              <h2>All FaceDetails Returned by AWS Rekognition</h2>
              {{ item.faceDetails }}
            </td>
          </template>
        </v-data-table>
      </td>
      </template>
    </v-data-table>
    <v-dialog
      v-model="show"
      persistent
      max-width="290"
      >
      <v-card>
        <v-card-title class="headline">
          Delete is
          <br/>Not Yet Implemented
        </v-card-title>
        <v-card-text>
          Regardless I expect my AWS account to be reset (wiped) 2nd Friday of December, so you can
          expect them to be deleted at that time.  If they are not, I will delete the
          AWS S3 bucket manually.  You can also DM me, and I'll remove just yours specifically ASAP.
        </v-card-text>
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
  </v-card>
</template>

<script>
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { listGames, getGame } from '../graphql/queries';

export default {
  name: 'PastGames',

  props: {
    value: Boolean,
  },
  data: () => ({
    show: false,
    headers: [
      {
        text: 'State',
        align: 'center',
        value: 'status'
      },
      {
        text: 'Started',
        align: 'start',
        value: 'createdAt'
      },
      {
        text: 'Duration',
        align: 'end',
        value: 'duration'
      }],
    imageHeaders: [{
        text: 'Requested',
        align: 'start',
        value: 'targetEmotion'
      }, {
        text: 'Detected',
        align: 'start',
        value: 'detectedEmotion'
      }, {
        text: 'Confidence (%)',
        align: 'end',
        value: 'confidence'
      }, {
        text: 'Selfie / Image',
        align: 'center',
        value: 'image'
      }],
    items: [],
    gameImageItems: [],
    imageData: {},
    statusColors: {
      active: 'blue',
      win: 'green',
      loss: 'red'
    },
    expanded: []
  }),
  async created() {
    this.items = await this.getGames();
  },
  watch: {
    async expanded(newList) {
      if (newList.length > 0) {
        const id = newList[0].id;

        this.gameImageItems =
          await this.getImages(
            id);
      }
    }
  },
  methods: {
    async getGames() {
      const response =
        await API.graphql({ query: listGames });

      return response.data.listGames.items;
    },
    async getImages(id) {
      const response =
        await API.graphql(
          graphqlOperation(
            getGame,
            {
              id
            }));

      const items = response.data.getGame.images.items;

      for (let i=0; i < items.length; i++) {
        let item = items[i];
          if (item.confidence) {
            item.confidence =
              parseFloat(item.confidence).toFixed(2);
          }

          this.imageData[item.fileName] = await this.getImageUrl(item.fileName);
      }

      return items;
    },
    async getImageUrl(fileName) {
      return await Storage.get(fileName);
    },
    getColor(status) {
      return this.statusColors[status];
    }
  }
}
</script>
