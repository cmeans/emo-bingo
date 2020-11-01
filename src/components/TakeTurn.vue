<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        step="1"
      >
        Spin the Wheel
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="step > 2"
        step="2"
      >
        Take a Selfie
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          elevation="0"
          padless
          height="360px"
          width="90%"
        >
        <SpinningWheel
          :playedEmotions="emotions"
          :disabled="emotion != ''"
          :key="gameId" />
        <!-- <SpinningWheel
          :available="availableEmotions"
          :played="playedEmotions"
          :disabled="emotion != ''"
          :key="gameId"
        /> -->
        <v-card-actions>
          <v-btn
            :disabled="emotion==''"
            @click="step = 2"
          >
            Next
          </v-btn>
        </v-card-actions>
        </v-card>

      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card
          elevation="0"
          padless
          class="text-left"
          width="90%"
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
</template>

<script>
  import SpinningWheel from './SpinningWheel';

  function getDefaultData() {
    return {
      emotion: '',
      imageFile: [],
      previewImage: '',
      step: 1
    };
  }

  export default {
    name: 'TakeTurn',

    components: {
      SpinningWheel
    },
    props: [
      'playedEmotions',
      'gameId'
    ],
    data: () => getDefaultData(),
    mounted() {
      this.$root.$on(
        'emotion',
        this.setEmotion);

      this.step = 1;
      console.log('TakeTurn mounted:', this.step)
    },
    beforeDestroy() {
      this.$root.$off(
        'emotion',
        this.setEmotion);
    },
    computed: {
      // availableEmotions() {
      //   return this.emotions.filter(x => !x.selected).map( x => x.name);
      // },
      // playedEmotions() {
      //   return this.emotions.filter(x => x.selected).map( x => x.name);
      // },
      emotions() {
        let count = 0;
        var getNext = () => count++;

        let list = [];
        this.playedEmotions.forEach( item => {
          list.push({
            id: getNext(),
            ...item
          });
        });

        return list;
      },
      emotionReadable() {
        if (this.emotion == 'fear') {
          return 'fearful';
        }

        return this.emotion;
      },
      getPreviewImageUrl() {
        return this.previewImage;
      }
    },
    methods: {
      setEmotion(text) {
        this.emotion = text;
      },
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
