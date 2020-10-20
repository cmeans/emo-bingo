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
            :src="icon"
          />
        </v-card-title>
        <v-card-text v-html="message" />
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
  import { emotionIcons } from '../main';

  export default {
    name: 'CellInfo',

    props: {
      emotion: String,
      value: Boolean
    },
    data: () => ({
      icons: emotionIcons
    }),
    computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      icon() {
        if (this.emotion == null) return '';

        return this.icons[this.emotion].icon
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
