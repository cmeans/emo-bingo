<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col class="col-sm-12 col-md-3">
          <v-text-field
            label="Attempted Emotion"
          />
        </v-col>
        <v-col class="col-sm-12 col-md-3">
          <v-file-input
            label="Emo Selfie"
            accept="image/*"
            capture="user"
          />
        </v-col>
        <v-col class="col-sm-12 col-md-3">
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
