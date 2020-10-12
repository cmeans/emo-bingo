<template>
  <v-card class="ma-2">
    <div v-resize-text="{ratio:2, minFontSize: '40px', maxFontSize: '200px', delay: 200}">
      {{ text }}
    </div>
    <slot name="emotion"></slot>
  </v-card>
</template>

<script>
  import ResizeText from 'vue-resize-text';

  export default {
    directives: {
      ResizeText
    },
    name: 'BingoCell',
    props: [
      'text'
    ],
    data: () => ({
    })
  }
</script>
