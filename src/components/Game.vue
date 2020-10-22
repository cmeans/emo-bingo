<template>
  <div>
    <v-slide-y-transition>
      <v-card-text v-show="turnActive">
        <TakeTurn :playedEmotions="availableEmotions" />
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-x-transition>
      <div v-show="!turnActive">
        <v-btn
          @click="turnActive = !turnActive"
        >
          Take your Turn
        </v-btn>
        <BingoSquare :gameState="state" />
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script>
  import TakeTurn from './TakeTurn';
  import BingoSquare from './BingoSquare';
  import { emotionsList, emotionsInfo, emotionIcons } from '../main';
  import { API, Storage /*, graphqlOperation */} from 'aws-amplify';
  import Auth from '@aws-amplify/auth';
  import { createGame, createImage } from '../graphql/mutations';
  import { listGames, listImages } from '../graphql/queries';
  import { onUpdateImage } from '../graphql/subscriptions';

  export default {
    name: 'Game',

    components: {
      TakeTurn,
      BingoSquare
    },
    created() {
      console.log("Game Component Created");
      this.init();

      this.initGameEventListeners();
      this.initGameState();
      this.initAvailableEmotions();

      // this.startImageUpdateSubscription();

      const _this = this;
      this.findActiveGameId()
        .then(() => {
          console.log(`ActiveGameId = ${_this.activeGameId}`)
        });
    },
    destroyed() {
      this.stopImageUpdateSubscription();
    },
    data() {
      return {
        username: null,
        activeGameId: 'dummy',
        turnActive: false,
        availableEmotions: [],
        state: [],
        imageUpdateSubscription: null
      }
    },
    watch: {
      username(newUserName, oldUserName) {
        try {
          if (oldUserName) {
            console.log('unsubscribing...', oldUserName)
            this.stopImageUpdateSubscription();
          }
          if (newUserName) {
            console.log('subscribing...', newUserName)
            this.startImageUpdateSubscription().then(() => {
              console.log('good now')
            })
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    },
    methods: {
      async init() {
        console.log('init')
        const owner = await Auth.currentAuthenticatedUser();
        console.log(owner);
        this.username = owner.username;
        console.log(this.username);
      },
      initGameEventListeners() {
        this.$root.$on('take-a-turn', () => {
          this.turnActive = !this.turnActive;
        });

        this.$root.$on('turn-complete', (targetEmotion, image) => {
          this.saveTurnInfo(targetEmotion, image)
            .then(() => {
              console.log('Saved turn info');
              // this.updateBoard(targetEmotion);
            })
        });
      },
      initAvailableEmotions() {
        emotionsInfo.forEach((value) => {
          this.availableEmotions.push(
            {
              selected: false,
              ...emotionIcons[value.name],
              ...value
            });
        });
      },
      stopImageUpdateSubscription() {
        console.log(`Unsubscribing from Image updates for: ${this.username}`);

        if (this.imageUpdateSubscription) {
          this.imageUpdateSubscription.unsubscribe();
          this.imageUpdateSubscription = null;
        }
      },
      async startImageUpdateSubscription() {
        console.log(`Subscribing to Image updates for: ${this.username}`);

        if (this.imageUpdateSubscription) {
          alert('Image Update Subscription already active');
          return;
        }

        this.imageUpdateSubscription =
          await API.graphql({
            query: onUpdateImage,
            variables: { owner: this.username }
          })
          .subscribe({
            next: (eventData) => {
              console.log(eventData);
              alert(eventData);
              // let todo = eventData.value.data.onCreateTodo;
              // if (this.todos.some(item => item.name === todo.name)) return; // remove duplications
              // this.todos = [...this.todos, todo];
            }
          });
          /*
          await API.graphql(
            graphqlOperation(
              onUpdateImage,
              {
                owner: this.username
              }
            )
          ).subscribe({
            next: (image) => {
              console.log('Subscription Image Update:');
              console.log(image);
            }
          });
          */
        console.log('Subscription active.', this.imageUpdateSubscription);
      },
      getRandomEmotionName() {
        return emotionsList[Math.floor(Math.random() * emotionsList.length)];
      },
      // initEmotionNames() {
      //   this.emotionNames = Array.from(emotionInfo.keys());
      // },
      initGameState() {
        this.state = new Array(24);

        let positions = [...Array(24).keys()];

        for (let i = 0; i < 3; i++) {
          for (let e = 0; e < emotionsList.length; e++) {
            const position = Math.floor(Math.random() * positions.length);
            const item = emotionsInfo.get(emotionsList[e]);
            this.state[positions[position]] = {
              i: positions[position],
              ...item
            };

            positions.splice(position, 1);
          }
        }

        this.state.splice(12, 0, {
            i: 12,
            name: 'freebie',
            emotion: 'freebie'
        });
      },
      async findActiveGameId() {
        let filter = {
          status: {
            eq: 'active' // filter status = 'active'
          }};

        const response =
          await API.graphql({ query: listGames, variables: { filter } });

        console.log(response);

        const foundGames = response.data.listGames.items;

        this.activeGameId = (foundGames.length == 0) ? this.createNewGame().id : foundGames[0].id;
        console.log('ActiveGameId is now: ' + this.activeGameId);
      },
      async createNewGame() {
        console.log('createNewGame')
        const data = {
          status: 'active'
        }

        const response = await API.graphql({ query: createGame, variables: { input: data } });

        console.log(response.data.createGame);

        return response.data.createGame;
      },
      async getUpdatedImageEntry(id) {
        let filter = {
          id: {
            eq: id
          }};

        const queryResponse =
          await API.graphql({
            query: listImages,
            variables: {
              filter
            }});

        console.log(queryResponse);
      },
      async saveTurnInfo(targetEmotion, imageFile) {

        console.log(`targetEmotion: ${targetEmotion}`);
        console.log(`image: ${imageFile}`);
        console.log(`image file name: ${imageFile.name}`);

        // this.emotion = targetEmotion;
        this.turnActive = false;
        this.availableEmotions.forEach((value) => {
          if (value.name == targetEmotion) {
            value.selected = true;
            console.log('availableEmotions Matched: ', value);
          }
        });
        // console.log(this.availableEmotions);

        // this.overlay = true;
        try {
          const data = {
            targetEmotion,
            fileName: imageFile.name,
            imageGameId: this.activeGameId
          }

          const response =
            await API.graphql({
              query: createImage,
              variables: {
                input: data
              }});

          console.log('imageEntry:');
          console.log(response);

          const s3Entry =
            await Storage.put(
              imageFile.name,
              imageFile,
              {
                level: 'public',
                metadata: {
                  'imageid': response.data.createImage.id
                }
              });

            console.log('S3 Entry:');
            console.log(s3Entry);

            setTimeout(() => {
              console.log('listImages');
              this.getUpdatedImageEntry(response.data.createImage.id);
            },
            5000)
            /*
            const owner = await Auth.currentAuthenticatedUser();

            console.log(owner.username)

            // onUpdate subscription for imageEntry.id
            const subscription =
              await API.graphql(
                graphqlOperation(
                  onUpdateImage,
                  {
                    owner: owner.username
                  }
                )
              ).subscribe({
                next: (image) => {
                  console.log('Subscription Image Update:');
                  alert(image);
                  subscription.unsubscribe();
                }
              })
            */
        }
        finally {
          // this.overlay = false;
        }
      }
    }
  }
</script>
