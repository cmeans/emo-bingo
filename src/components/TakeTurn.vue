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
              <transition name="bounce">
                <h2>
                  1. Take a spin
                </h2>
              </transition>
            <SpinningWheel :items="items" :disabled="emotion != ''"/>
          </v-col>
          <v-col cols="12" lg="4" class="text-center" v-show="emotion">
              <transition name="bounce">
                <h2 v-show="emotion != ''">
                  2. Take a selfie
                </h2>
              </transition>
            <v-file-input
              required
              show-size
              :rules="[v => (!!v && v != [] && v != '') || 'Item is required']"
              @change="doPreviewImage"
              v-model="imageFile"
              prepend-icon="mdi-camera"
              label="Emotional Selfie"
              accept="image/*.png,image/*.jpg"
              capture="user"
              text-align="middle"
            >
            </v-file-input>
          </v-col>
          <v-col cols="12" lg="4" class="text-center" v-show="previewImage">
            <h2 class="mb-4">
              3. Preview your selfie
            </h2>
            <v-img
              class="preview"
              :src="getPreviewImageUrl"
              width="100%"
              scale="1"
            >
            </v-img>
          </v-col>
        </v-row>
      </v-container>
      <div class="justify-center text-center">
        <transition name="bounce">
          <h3 v-if="previewImage">
            Ready to Submit Your {{ emotion }} Selfie for Analysis &amp; Verification?
          </h3>
        </transition>
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn :disabled="!previewImage">Submit Selfie</v-btn>
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
      emotion: '',
      imageFile: [],
      previewImage: '',
      showBounce: false,
      step3: ''
    }),
    computed: {
      getPreviewImageUrl() {
        return this.previewImage;
      },
      showBounce() {
        return true;
      },
      step2() {
        if (this.emotion != '') {
          return 'bounce';
        }

        return '';
      }
    },
    methods: {
      doPreviewImage(file) {
        if (this.previewImage) {
          URL.revokeObjectURL(this.previewImage) // free memory
        }
        if (file === undefined) {
          this.previewImage = null;
        } else {
          this.previewImage = URL.createObjectURL(file);
        }
      }
    },
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

  .preview {
    border: solid 1px blue;
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

</style>
