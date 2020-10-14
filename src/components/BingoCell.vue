<template>
  <v-card>
    <!--
    <div class="text-center letter" v-resize-text="{ratio:1.2, minFontSize: '40px', maxFontSize: '200px', delay: 200}">
//-->
    <div>
      {{ text }}
    </div>
    <slot name="emotion-entry"></slot>
  </v-card>
</template>

<script>
  //import ResizeText from 'vue-resize-text';

  export default {
    directives: {
      //ResizeText
    },
    name: 'BingoCell',
    props: [
      'text'
    ],
    data: () => ({
    })
  }
</script>
<style scoped>
  .letter {
    background-color: purple;
    color: white;
  }
</style>
