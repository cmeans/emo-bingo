<template>
  <v-card>
    <v-card-title class="justify-center">
      Game Data
    </v-card-title>
    <v-card-text>
      <PastGames />
    </v-card-text>
  </v-card>
</template>

<script>
import PastGames from '@/components/PastGames.vue';

export default {
  name: 'GameData',

  components: {
    PastGames
  },
  data: () => ({
  })
}
</script>
