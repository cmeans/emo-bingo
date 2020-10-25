<template>
  <div class="about">
    <v-card
      class="mx-auto ma-4"
      min-width="50%"
      max-width="80%"
      elevation="6"
    >
      <v-card-title class="justify-center">
        About
      </v-card-title>
      <v-card-text>
        emo-Bingo was conceieved, designed (a bit), and developed for Enova's 7<sup>th</sup> Annual HERP DERP.
      </v-card-text>
    </v-card>
    <v-card
      class="mx-auto"
      min-width="50%"
      max-width="80%"
      elevation="6"
    >
      <v-card-title class="justify-center">
        Technologies Employed
      </v-card-title>
      <v-card-text>
        <v-btn
          class="mx-4 ma-2"
          x-large
          v-for="item in items"
          :key="item.title"
          :href="item.url"
          target="_blank"
        >
          <v-img
            contain
            :alt="item.title"
            :title="item.title"
            :src="item.icon"
            width="64"
          >
          </v-img>
          {{ item.title }}
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  const path = '/images/technology/';
  const items = [
    {
      icon: `${path}aws-amplify3.png`,
      title: 'AWS Amplify',
      url: 'https://aws.amazon.com/amplify',
    },
    {
      icon: `${path}aws-cognito.png`,
      title: 'AWS Cognito',
      url: 'https://aws.amazon.com/cognito'
    },
    {
      icon: `${path}aws-appsync.png`,
      title: 'AWS AppSync',
      url: 'https://aws.amazon.com/appsync'
    },
    {
      icon: `${path}aws-graphql.png`,
      title: 'AWS GraphQL',
      url: 'https://aws.amazon.com/graphql'
    },
    {
      icon: `${path}aws-dynamodb.png`,
      title: 'AWS DynamoDB',
      url: 'https://aws.amazon.com/dynamodb'
    },
    {
      icon: `${path}aws-lambda.png`,
      title: 'AWS Lambda',
      url: 'https://aws.amazon.com/lambda'
    },
    {
      icon: `${path}aws-s3.png`,
      title: 'AWS S3',
      url: 'https://aws.amazon.com/s3'
    },
    {
      icon: `${path}aws-rekognition.png`,
      title: 'AWS Rekognition',
      url: 'https://aws.amazon.com/rekognition'
    },
    {
      icon: `${path}aws-cloudformation.png`,
      title: 'Cloudformation',
      url: 'https://aws.amazon.com/cloudformation'
    },
    {
      icon: `${path}vue.png`,
      title: 'Vue.js',
      url: 'https://vuejs.org'
    },
    {
      icon: `${path}vuetify.png`,
      title: 'Vuetify',
      url: 'https://vuetifyjs.com/'
    }
  ];

  export default {
    data() {
      return {
        items
      }
    }
  }
</script>
