<template>
  <v-card>
  <v-form ref="form" v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            :rules="[v => !!v || 'Item is required']"
            v-model="name"
            label="Attempted Emotion"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-file-input
            :rules="[v => (!!v || v != [] || v != '') || 'Item is required']"
            v-model="imageFile"
            label="Emo Selfie"
            accept="image/*"
            capture="environment"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            :disabled="!isFormValid && !overlay"
            v-on:click="saveEntry">
            Submit to Rekognition
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-form>
  </v-card>
</template>

<script>
  import { API, Storage } from 'aws-amplify';
  import { createEntry } from '../graphql/mutations';

  export default {
    name: 'NewEntry',

    data: () => ({
      isFormValid: false,
      overlay: false,
      name: '',
      imageFile: []
    }),
    methods: {
      clearFields() {
        this.$refs.form.reset();
      },
      entriesChanged() {
        this.$root.$emit('entries-changed');
      },
      async saveEntry() {
        if (!this.isFormValid) return;

        this.overlay = true;
        try {
          const file = this.imageFile; //e.target.files[0];
          const image = file.name;
          await Storage.put(file.name, file);

          console.log("file:", file);
          console.log("image:", image);
          const imageFileName = file.name.match(/\/(.*)$/);
          console.log(imageFileName)
          const data = {
            name: this.name,
            image: image,
            imageFileName
          }
          await API.graphql({ query: createEntry, variables: { input: data } });
          this.clearFields();
          this.entriesChanged();
        }
        finally {
          this.overlay = false;
        }
      }
    }
  }
</script>
