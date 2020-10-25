<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="290"
    >
    <v-card>
      <v-card-title class="headline">
        Game Over
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click.stop="show = false"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MessageDialog',

  props: {
    value: Boolean,
    message: String
  },
  data: () => {
    return {}
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
         this.$emit('input', value)
      }
    }
  }
}
</script>
