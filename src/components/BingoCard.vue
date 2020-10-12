<template>
  <v-card
    outlined
    elevation="2"
    class="d-flex"
  >
    <v-container>
      <v-row>
        <v-col cols="2" v-for="letter in 'B I N G O'.split(' ')" v-bind:key="letter">
          <BingoCell :text="letter"></BingoCell>
        </v-col>
      </v-row>
      <div class="d-flex">
        <v-flex flex-col v-for="row in [1,2,3,4,5]" :key="row">
          <v-flex
            auto
            v-for="col in [1,2,3,4,5]"
            :key="col"
          >
            <BingoCell>
              <template v-slot:emotion>
                <v-card-text>
                  <div align="center">
                    <div>
                    {{ emotion().name }}
                  </div>
                  <v-img
                    :src=emotion().icon
                    :width="width"
                  />
                  </div>
                </v-card-text>
              </template>
            </BingoCell>
          </v-flex>
        </v-flex>
      </div>
      <!-- <v-row v-for="row in [1,2,3,4,5]" v-bind:key="row">
        <v-col cols="1" v-for="col in [1,2,3,4,5]" v-bind:key="col">
        <v-flex auto v-for="col in [1,2,3,4,5]" :key="col">
          <BingoCell>
              <template v-slot:emotion>
                <v-card-text>
                  <div class="d-none d-md-flex justify-center">
                    {{ emotion().name }}
                  </div>
                  <v-img
                    contained
                    :src=emotion().icon
                    width="100%"
                  />
                </v-card-text>
              </template>
            </BingoCell>
        </v-flex>
      </v-row> -->
    </v-container>
  </v-card>
</template>

<script>
  import BingoCell from './BingoCell';

  export default {
    name: 'BingoCard',

    components: {
      BingoCell
    },
    props: [
      'items'
    ],
    data: () => ({

    }),
    computed: {
      width() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return 40;
        }

        return 100;
      }
    },
    methods: {
      getRandomItem() {
        return this.items[Math.floor(Math.random() * this.items.length)];
      },
      emotion() {
        return this.getRandomItem();
      }
    }
  }
</script>
