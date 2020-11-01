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
        {{ $moment(item.createdAt).format('ddd Do hh:mma') }}
      </template>
      <template v-slot:item.duration="{ item }">
        {{ $moment.duration($moment(item.updatedAt).diff($moment(item.createdAt))).humanize() }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          large
          @click.stop="deleteGame(item)"
        >
          mdi-delete
        </v-icon>
      </template>
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
        <v-card-title class="headline justify-center">
          Deleting All<br/>Game Data<br/>and Images
        </v-card-title>
        <v-card-text>
          FYI:  Your wins & losses will not be impacted.  If you want those gone as well, please
          <a href="https://enova.slack.com/team/UG04ESDDK">Slack</a> or <a href='#' onclick='window.open("mailto:Chris Means<cmeans@enova.com>?subject=Delete emo-bingo stats&body=Please provide your emo-bingo User Name or email address.");return false'>email</a> me directly.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click.stop="show=false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click.stop="deleteAll(); show=false"
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
import { deleteGame, deleteImage } from '../graphql/mutations';

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
        text: 'Duration', align: 'end', value: 'duration'
      },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
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
    async deleteAll() {
      // Iterate through items.
      console.log("Deleting all games...")
      this.items.forEach(
        async (game) => {
          await this.deleteGame(game);
        });

      this.items = [];
    },
    async deleteGame(game) {
      const response =
        await API.graphql(
          graphqlOperation(
            getGame,
            {
              id: game.id
            }));

      const gameImages =
        response.data.getGame.images.items;

      gameImages.forEach(
        async (image) => {
          await this.deleteGameImage(image.id);
        });

      // Delete game record.
      console.log('Game entry delete:')
      await API.graphql(
        graphqlOperation(
          deleteGame,
          {
            input: { id: game.id }
          }))
        .then ( (result) => {
          console.log(result);
        })
        .catch( (err) => {
          console.log(err);
        });

      const index = this.items.indexOf(game);
      this.items.splice(index, 1)
    },
    async deleteGameImage(id) {
      // Delete image record (delete trigger Lambda will take care of S3 object).
      console.log('Image reference & data delete:')
      await API.graphql(
        graphqlOperation(
          deleteImage,
          {
              input: { id }
          }))
        .then ( (result) => {
          console.log(result);
        })
        .catch( (err) => {
          console.log(err);
        });
    },
    getColor(status) {
      return this.statusColors[status];
    }
  }
}
</script>
