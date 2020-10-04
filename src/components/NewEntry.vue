<template>
  <v-form ref="form" v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col class="col-md-12 col-lg-3">
          <v-text-field
            :rules="[v => !!v || 'Item is required']"
            v-model="name"
            label="Attempted Emotion"
          />
        </v-col>
        <v-col class="col-md-12 col-lg-3">
          <v-file-input
            :rules="[v => !!v || 'Item is required']"
            v-model="image"
            label="Emo Selfie"
            accept="image/*"
            capture="user"
          />
        </v-col>
        <v-col class="col-md-12 col-lg-3">
          <v-btn
            :disabled="!isFormValid"
            v-on:click="saveEntry">
            Submit to Rekognition
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  import { API } from 'aws-amplify';
  import { createEntry } from '../graphql/mutations';

  export default {
    name: 'NewEntry',

    data: () => ({
      isFormValid: false,
      name: '',
      image: []
    }),
    computed: {
      isValid() {
        return true;
      }
    },
    methods: {
      clearFields() {
        this.$refs.form.reset();
      },
      entriesChanged() {
        this.$root.$emit('entries-changed');
      },
      async saveEntry() {
        if (!this.isFormValid) return;

        const data = {
          name: this.name,
          image: this.image
        }
        await API.graphql({ query: createEntry, variables: { input: data } });
        this.clearFields();
        this.entriesChanged();
      }
    }
  }
</script>
