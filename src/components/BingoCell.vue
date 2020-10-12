<template>
  <v-card class="d-flex align-center justify-center" height="100px" width="100px">
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
