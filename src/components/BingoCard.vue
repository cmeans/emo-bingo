<template>
  <v-card
    outlined
    elevation="2"
  >
    <v-container>
      <v-layout nowrap>
        <v-flex xs2 v-for="letter in 'B I N G O'.split(' ')" v-bind:key="letter">
          <BingoCell :text="letter"></BingoCell>
        </v-flex>
      </v-layout>
      <!-- <v-row>
        <v-col cols="2" v-for="letter in 'B I N G O'.split(' ')" v-bind:key="letter">
          <BingoCell :text="letter"></BingoCell>
        </v-col>
      </v-row> -->
      <v-layout nowrap>
        <v-flex xs1 v-for="row in [1,2,3,4,5]" :key="row">
          <v-flex auto v-for="col in [1,2,3,4,5]" :key="col" v-bind:style="{ width: size }">
            <BingoCell>
              <template v-slot:emotion>
                <v-card-text>
                  <div align="center">
                    <div class="d-none d-md-flex justify-center">
                      {{ emotion().name }}
                    </div>
                    <v-img
                      scale="1"
                      :src=lastEmotion.icon
                    />
                  </div>
                </v-card-text>
              </template>
            </BingoCell>
          </v-flex>
          <br />
        </v-flex>
      </v-layout>
      <!-- <div class="d-flex">
        <v-flex row v-for="row in [1,2,3,4,5]" :key="row">
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
                      :src=lastEmotion.icon
                      :width="width"
                    />
                  </div>
                </v-card-text>
              </template>
            </BingoCell>
          </v-flex>
        </v-flex>
      </div> -->
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
      lastEmotion: null
    }),
    computed: {
      size() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return '40px';
        }

        return '80px';
      }
    },
    methods: {
      getRandomItem() {
        return this.items[Math.floor(Math.random() * this.items.length)];
      },
      emotion() {
        this.lastEmotion = this.getRandomItem();
        return this.lastEmotion;
      }
    }
  }
</script>
