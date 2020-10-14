<template>
  <v-card
    outline
    elevation="2"
    class=""
  >
    <v-card-title>
      Click the spinner to see which emotion you must present.
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" lg="4" class="text-center">
            <h2>
              Take your spin
            </h2>
            <SpinningWheel :items="items" :disabled="!!emotion"/>
          </v-col>
          <v-col cols="12" lg="4" class="text-center">
            <h2>
              Take your shot
            </h2>
            <v-file-input
              required
              show-size
              :rules="[v => (!!v && v != [] && v != '') || 'Item is required']"
              @change="doPreviewImage"
              vmodel="imageFile"
              prepend-icon="mdi-camera"
              label="Emotional Selfie"
              accept="image/*.png,image/*.jpg"
              capture="user"
              text-align="middle"
            >
            </v-file-input>
          </v-col>
          <v-col cols="12" lg="4" class="text-center">
            <h2>
              Preview your shot
            </h2>
            <v-img
              src="getPreviewImageUrl"
              width="100%"
              scale="1"
            >
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn :disabled="!emotion">Submit Your "{{ emotion }}" Selfie for Analysis &amp; Verification</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import SpinningWheel from './SpinningWheel';

  export default {
    name: 'TakeTurn',

    components: {
      SpinningWheel
    },
    props: [
      'items'
    ],
    data: () => ({
      emotion: ''
    }),
    mounted() {
      this.$root.$on('emotion', (text) => {
        this.emotion = text;
      });
    }
  }
</script>
<style scoped>
  .selfie {
    background-image: url('/images/selfie.png');
  }
</style>
