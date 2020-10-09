<template>
  <div>
  <v-card
    outlined
    elevation="6"
    class="pa-2 float-left"
    >
    <v-card-title>
      <v-icon>
        mdi-new-box
      </v-icon>
      New Entry
    </v-card-title>
    <div>
      <v-form
        ref="form"
        v-model="isFormValid"
      >
        <v-container
          fluid
          style="border: 1px solid black"
        >
          <v-row>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                :rules="[v => !!v || 'Item is required']"
                v-model="name"
                label="Entry Name"
                prepend-icon="mdi-tag-text"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-file-input
                required
                show-size
                :rules="[v => (!!v && v != [] && v != '') || 'Item is required']"
                @change="doPreviewImage"
                v-model="imageFile"
                prepend-icon="mdi-camera"
                label="Emotional Selfie"
                accept="image/*.png,image/*.jpg"
                capture="user"
              >
              </v-file-input>
            </v-col>
          </v-row>
        </v-container>
        <v-overlay :value="overlay">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>
        <v-card-actions>
          <v-btn
            :disabled="!isFormValid && !overlay"
            v-on:click="saveEntry">
            <v-icon>
              mdi-check-bold
            </v-icon>
            Submit to Rekognition
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </v-card>
      <v-card
        class="float-left">
        <v-card-title>
          <v-icon>
            mdi-mirror
          </v-icon>
          Preview
        </v-card-title>
        <v-card-text>
          <v-img
            :src="getPreviewImageUrl"
            width="50%"
            scale="1"
          >
          </v-img>
        </v-card-text>
      </v-card>
  </div>
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
      imageFile: [],
      previewImage: ''
    }),
    computed: {
      getPreviewImageUrl() {
        return this.previewImage;
      }
    },
    methods: {
      clearFields() {
        this.$refs.form.reset();
      },
      entriesChanged() {
        this.$root.$emit('entries-changed');
      },
      doPreviewImage(file) {
        if (this.previewImage) {
          URL.revokeObjectURL(this.previewImage) // free memory
        }
        if (file === undefined) {
          this.previewImage = null;
        } else {
          this.previewImage = URL.createObjectURL(file);
        }
      },
      async saveEntry() {
        if (!this.isFormValid) return;

        this.overlay = true;
        try {
          const file = this.imageFile; //e.target.files[0];
          const image = file.name;
          await Storage.put(file.name, file);

          const data = {
            name: this.name,
            image
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
