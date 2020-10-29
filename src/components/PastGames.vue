<template>
  <v-card>
    <v-card-title>
    </v-card-title>
    <v-card-actions>
      <v-btn
        text
        @click.stop="show=true"
      >
        Delete All Game Data and Images
      </v-btn>
    </v-card-actions>
    <v-data-table
      dense
      show-expand
      mobile-breakpoint="sm"
      :headers="headers"
      :items="items"
      :search="search"
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
          dense
          show-expand
          mobile-breakpoint="sm"
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
              contained
              :eager=true
              class="ma-1"
              :src="item.imageUrl"
              style="width: 100px; height:100px"
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
        Regardless I expect my AWS account to be reset (wiped) EOD Friday, so you can
        expect them to be deleted at that time.  If they are not, I will delete the
        AWS S3 bucket manually.
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
    username: '',
    headers: [
      {
        text: 'State',
        align: 'center',
        filterable: true,
        value: 'status'
      },
      {
        text: 'Started',
        align: 'start',
        filterable: false,
        value: 'createdAt'
      },
      {
        text: 'Duration',
        align: 'end',
        filterable: false,
        value: 'duration'
      // },
      // {
      //   text: 'Full Name',
      //   value: 'full_name'
      }
    ],
    imageHeaders: [{
        text: 'Requested',
        align: 'start',
        filterable: false,
        value: 'targetEmotion'
      }, {
        text: 'Detected',
        align: 'start',
        filterable: false,
        value: 'detectedEmotion'
      }, {
        text: 'Confidence',
        align: 'end',
        filterable: false,
        value: 'confidence'
      }, {
        text: 'Selfie/Image',
        filterable: false,
        value: 'image'
      }],
    items: [],
    gameImageItems: [],
    search: null,
    statusColors: {
      active: 'blue',
      win: 'green',
      loss: 'red'
    },
    expanded: []
  }),
  async created() {
    //await this.init();
    this.items = await this.getGames();
    //console.log(this.items);
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

      items.forEach (
        async (item) => {
          if (item.confidence) {
            item.confidence =
              parseFloat(item.confidence).toFixed(2);
          }
          item.imageUrl =
            await this.getImageUrl(item.fileName)
        }
      );

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
