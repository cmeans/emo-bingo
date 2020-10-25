<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step
        :complete="e1 > 1"
        step="1"
      >
        Spin the Wheel
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="e1 > 2"
        step="2"
      >
        Take a Selfie
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class=""
          height="370px"
          width="90%"
        >
        <SpinningWheel :playedEmotions="playedEmotions" :disabled="emotion != ''"/>
        <v-card-actions>
          <v-btn
            :disabled="emotion==''"
            @click="e1 = 2"
          >
            Next
          </v-btn>
        </v-card-actions>
        </v-card>

      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card
          class="text-left mx-auto"
        >
          <v-file-input
            required
            show-size
            :rules="[v => (!!v && v != [] && v != '') || 'Whacky, I know, but we need a picture for this to work']"
            @change="doPreviewImage"
            v-model="imageFile"
            prepend-icon="mdi-camera"
            label="Emotional Selfie"
            accept="image/*.png,image/*.jpg"
            capture="camera"
            text-align="middle"
          >
          </v-file-input>
          <p>
            <strong>(Try to look {{ emotionReadable }})</strong>
          </p>

          <v-img
            v-if="previewImage"
            class="preview"
            :src="getPreviewImageUrl"
            width="200"
            scale="1"
          >
          </v-img>
          <p v-if="previewImage">
          Ready to Submit Your <strong>{{ emotionReadable }}</strong> Selfie for Analysis &amp; Verification?
          </p>
          <v-card-actions>
            <v-btn
              :disabled="!previewImage"
              @click="submitSelfie"
            >
              Submit Selfie
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

  <!--
  <v-card
    elevation="6"
    class="mx-auto"
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
            <SpinningWheel :playedEmotions="playedEmotions" :disabled="emotion != ''"/>
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
              :rules="[v => (!!v && v != [] && v != '') || 'Whacky, I know, but we need a picture for this to work']"
              @change="doPreviewImage"
              v-model="imageFile"
              prepend-icon="mdi-camera"
              label="Emotional Selfie"
              accept="image/*.png,image/*.jpg"
              capture="user"
              text-align="middle"
            >
            </v-file-input>
            <h3>
              (Try to look {{ emotionReadable }})
            </h3>
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
        <v-row>
          <v-col cols="12">
      <div class="justify-center text-center">
          <h3 v-if="previewImage">
            Ready to Submit Your <strong>{{ emotionReadable }}</strong> Selfie for Analysis &amp; Verification?
          </h3>
      </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        :disabled="!previewImage"
        @click="submitSelfie"
      >
        Submit Selfie
      </v-btn>
    </v-card-actions>
  </v-card>
  //-->
</template>

<script>
  import SpinningWheel from './SpinningWheel';

  function getDefaultData() {
    return {
      emotion: '',
      imageFile: [],
      previewImage: '',
      e1: 1
    };
  }

  export default {
    name: 'TakeTurn',

    components: {
      SpinningWheel
    },
    props: [
      'playedEmotions'
    ],
    data: () => getDefaultData(),
    mounted() {
      this.$root.$on('emotion', (text) => {
        this.emotion = text;
      });

      this.step = 1;
      console.log(this.scope)
    },
    computed: {
      emotionReadable() {
        if (this.emotion == 'fear') {
          return 'fearful';
        }

        return this.emotion;
      },
      getPreviewImageUrl() {
        return this.previewImage;
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
      },
      resetData() {
        const def = getDefaultData();
        for (const [key, value] of Object.entries(def)) {
          this.$data[key] = value;
        }
      },
      submitSelfie() {
        this.$root.$emit(
          'turn-complete',
          this.emotion,
          this.imageFile);

        this.resetData();
      }
    }
  }
</script>

<style scoped>
  .selfie {
    background-image: url('/images/selfie.png');
  }

  .preview {
    border: solid 2px purple;
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
