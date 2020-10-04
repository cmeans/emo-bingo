<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            label="Attempted Emotion"
          />
        </v-col>
        <v-col>
          <v-file-input
            label="Emo Selfie"
            accept="image/*"
            capture="user"
          />
        </v-col>
        <v-col>
          <v-btn>
            Submit to Rekognition
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'NewEntry',

    data: () => ({
    }),
  }
</script>
