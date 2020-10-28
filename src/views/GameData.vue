<template>
  <div class="data">
    <v-card
      class="mx-auto ma-4"
      min-width="50%"
      max-width="80%"
      elevation="6"
    >
      <v-card-title class="justify-center">
        Game Data
      </v-card-title>
      <v-card-text>
        <PastGames />
      </v-card-text>
    </v-card>
  </div>
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
