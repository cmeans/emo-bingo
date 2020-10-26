<template>
  <div class="instructions">
    <v-card
      class="mx-auto ma-6"
      min-width="50%"
      max-width="80%"
      elevation="6"
    >
      <v-card-title class="justify-center">
        emo-Bingo Instructions
      </v-card-title>
      <v-card-subtitle>
        almost, but not quite entirely unlike Bingo
      </v-card-subtitle>
      <v-card-text class="text-left">
        <v-list
          width="90%"
        >
          <v-list-item
            v-for="(text, index) in instructions"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title v-text="text" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-card
      class="mx-auto ma-4"
      min-width="50%"
      max-width="80%"
      elevation="6"
    >
      <v-card-title class="justify-center">
        Under-the-Hood
      </v-card-title>
      <v-card-text class="text-left">
        <v-list
          width="90%"
        >
          <v-list-item
            v-for="(text, index) in underTheHood"
            :key="index">
            <v-list-item-content>
              <v-list-item-title v-text="text" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
  const instructions = [
    "The goal, is to get five \"cells\" in a row.",
    "The row can be horizontal, vertical or diagonal.",
    "Each cell (other than the center cell) indicates an emotion.",
    "At the start of each game emotions are assigned randomly to each cell on the board.",
    "Each emotion will be present on 3 cells of the board.",
    "You win cells by taking a selfie where you are presenting (exhibiting) that emotion (you do not need to be feeling the emotion, AWS Rekognition can't actually tell how you feel).",
    "On each turn, you spin a wheel to see which emotion you must try for.",
    "You will only get each emotion, at most, once per game.",
    "Then you'll take your \"emotional\" selfie, there's a preview window, so you'll have an option to retake the image (as many times as you like).",
    "Submit the image for analysis...when we get the results back, the board will be updated.",
    "The board is updated with success or failure for your selfie to match the requested emotion with 80% or higher confidence.",
    "You'll loose the game if it's not possible to win because too many cells are lost.",
    "The center cell is a freebie (you're welcome!)"
  ];

  const underTheHood = [
    "Your selfie will be uploaded to an AWS S3 bucket.",
    "An AWS Lambda, will be triggered, which will then send your selfie to the AWS Rekognition service for analysis.",
    "Rekognition returns (amoung other things) a list of emotions detected (if any) with a confidence value (how sure it is that you're exhibiting that emotion).",
    "That information will be stored in an AWS DynamoDB table."
  ];

  export default {
    data() {
      return {
        instructions,
        underTheHood
      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-list-item__title {
    white-space: normal;
  }
</style>
