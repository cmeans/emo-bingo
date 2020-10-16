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
        <v-card-text>
          You'll need to take a selfie exhibiting the emotion: <strong>{{ emotion }}</strong>
        </v-card-text>
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
  import { emotionInfo } from '../main';

  export default {
    name: 'CellInfo',

    components: {
    },
    props: {
      emotion: String,
      value: Boolean
    },
    data: () => ({
      emotions: emotionInfo
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
        return emotionInfo[this.emotion];
      }
    }
  }
</script>
