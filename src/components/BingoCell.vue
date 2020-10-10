<template>
  <v-card class="pa-2 d-flex flex-1 align-center justify-center" height="100px" width="100px">
    <div v-resize-text="{ratio:2, minFontSize: '30px', maxFontSize: '100px', delay: 200}">{{ text }}</div>
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
