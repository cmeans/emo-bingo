<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          <v-img
            :src="emotionData.icon"
          />
        </v-card-title>
        <v-card-text v-html="message()" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="show = false"
          >
            Got It
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { EMOTION_INFO } from '../main';

  export default {
    name: 'CellInfo',

    components: {
    },
    props: {
      emotion: String,
      value: Boolean
    },
    data: () => ({
      // emotions: EMOTION_INFO
    }),
    computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      emotionData() {
        return EMOTION_INFO[this.emotion];
      },
      message() {
        if (this.emotion == 'freebie') {
          return "This is the center square...it's a <strong>freebie</strong>!";
        } else {
          return `You'll need to take a selfie exhibiting the emotion: <strong>${this.emotion}</strong>`
        }
      }
    }
  }
</script>
