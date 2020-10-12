<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="letter in 'B I N G O'.split(' ')" v-bind:key="letter">
        <BingoCell :text="letter"></BingoCell>
      </v-col>
    </v-row>
    <v-row v-for="row in [1,2,3,4,5]" v-bind:key="row">
      <v-col cols="2" v-for="col in [1,2,3,4,5]" v-bind:key="col">
          <BingoCell>
            <template v-slot:emotion>
              <v-card-text>
              <div class="d-flex justify-center">
                {{ emotion().name }}
              </div>
              <p>
                <v-img
                  contained
                  :src=emotion().icon
                />
              </p>
              </v-card-text>
            </template>
          </BingoCell>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import BingoCell from './BingoCell';

  // const EMOTIONS = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.split('|');
  //const EMOTICONS = 'emoticon-happy|emoticon-sad|emoticon-angry|emoticon-confused|emoticon-poop|emoticon-tongue|emoticon-cool|emoticon-devil';

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
