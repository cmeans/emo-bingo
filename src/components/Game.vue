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
          @click="startNewGame"
          v-show="gameState != 'active'"
          class="mt-2"
        >
          Start a New Game
        </v-btn>
        <v-btn
          @click="turnActive = !turnActive"
          v-show="gameState == 'active'"
          class="mt-2"
        >
          Take a Turn
        </v-btn>
        <BingoSquare :gameState="boardState" />
      </div>
    </v-slide-x-transition>
    <v-overlay :absolute="true" v-show="processingEntry == true">
      <v-progress-circular
        indeterminate
        color="primary"
        height="40%"
      />
    </v-overlay>
  </div>
</template>

<script>
  import TakeTurn from './TakeTurn';
  import BingoSquare from './BingoSquare';
  import { emotionsList, emotionsInfo } from '../main';
  import { API, Storage /*, graphqlOperation */} from 'aws-amplify';
  import Auth from '@aws-amplify/auth';
  import { createGame, createImage, /*createStats, getStats,*/ updateGame /*, updateStats */ } from '../graphql/mutations';
  import { listGames, listImages } from '../graphql/queries';
  import { onUpdateImage } from '../graphql/subscriptions';

  const PLAY = {
    AVAILABLE: -1,
    MISS: 0,
    HIT: 1
  };

  export default {
    name: 'Game',

    components: {
      TakeTurn,
      BingoSquare
    },
    async created() {
      console.log("Game Component Created");
      this.init();

      this.initGameEventListeners();
      await this.loadOrCreateGame();
    },
    destroyed() {
      this.stopImageUpdateSubscription();
    },
    data() {
      return {
        username: null,
        activeGameId: 'dummy',
        targetEmotion: null,
        turnActive: false,
        gameState: 'active',
        availableEmotions: [],
        state: [],
        imageUpdateSubscription: null,
        minimumConfidenceLevel: 80.0,
        processingEntry: false,
        statusMessage: 'Nothing right now'
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
              console.log('Subscribed.')
            })
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    },
    computed: {
      boardState() {
        return this.state;
      }
    },
    methods: {
      async init() {
        const owner = await Auth.currentAuthenticatedUser();
        this.username = owner.username;
      },
      initGameEventListeners() {
        this.$root.$on('take-a-turn', () => {
          this.turnActive = !this.turnActive;
        });

        this.$root.$on('turn-complete', async (targetEmotion, image) => {
          this.processTurnInfo(targetEmotion, image);
        });
      },
      initAvailableEmotions() {
        emotionsInfo.forEach((value) => {
          this.availableEmotions.push(
            {
              selected: false,
              ...value
            });
        });
      },
      setStatusMessage(text) {
        this.$root.$emit('status-message', text);
      },
      stopImageUpdateSubscription() {
        console.log(`Unsubscribing from Image updates for: ${this.username}`);

        if (this.imageUpdateSubscription) {
          this.imageUpdateSubscription.unsubscribe();
          this.imageUpdateSubscription = null;
        }
      },
      async saveGameState(status) {
        const data = {
          id: this.activeGameId,
          status: typeof status !== undefined ? status : 'active',
          state: JSON.stringify(this.state),
          availableEmotions: JSON.stringify(this.availableEmotions)
        };

        const conditions = {
          id: {
            eq: this.activeGameId
          }
        };

        const response =
          await API.graphql({
            query: updateGame,
            variables: {
              input: data,
              conditions
            }});

        console.log('updated game:', response)
      },
      async startImageUpdateSubscription() {
        console.log(`Subscribing to Image updates for: ${this.username}`);

        if (this.imageUpdateSubscription) {
          alert('Image Update Subscription already active');
          return;
        }

        this.imageUpdateSubscription =
          API.graphql({
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
      updateAvailableEmotions(emotion) {
        this.availableEmotions.forEach((value) => {
          if (value.name == emotion) {
            value.selected = true;
          }
        });
      },
      initBoardState() {
        let state = new Array(24);

        let positions = [...Array(24).keys()];

        for (let i = 0; i < 3; i++) {
          for (let e = 0; e < emotionsList.length; e++) {
            const position = Math.floor(Math.random() * positions.length);
            const item = emotionsInfo.get(emotionsList[e]);
            state[positions[position]] = {
              play: PLAY.AVAILABLE,
              ...item
            };

            positions.splice(position, 1);
          }
        }

        state.splice(12, 0, {
          play: PLAY.HIT,
          name: 'freebie',
          emotion: 'freebie'
        });

        // Set unique key/ids.
        // state.forEach((item, index) => { item['id'] = `${item.name}-${index}-${item.play}` });

        this.state = state;
      },
      initGameState() {
        console.log('initGameState')
        this.initAvailableEmotions();
        this.initBoardState();
      },
      async loadOrCreateGame() {
        this.setStatusMessage('Looking for your game...');

        let filter = {
          status: {
            eq: 'active'
          }
        };

        const response =
          await API.graphql({ query: listGames, variables: { filter } });

        const foundGames = response.data.listGames.items;

        if (foundGames.length == 0) {
          this.activeGameId = this.createNewGame().id
        } else {
          const savedGame = foundGames[0];

          this.activeGameId = savedGame.id;
          this.state = JSON.parse(savedGame.state);
          this.availableEmotions = JSON.parse(savedGame.availableEmotions);
        }

        this.setStatusMessage('Ready...take a turn...');
      },
      async createNewGame() {
        this.setStatusMessage('Initializing new game...');

        this.initGameState();

        const data = {
          status: 'active',
          state: JSON.stringify(this.state),
          availableEmotions: JSON.stringify(this.availableEmotions)
        };

        const response = await API.graphql({ query: createGame, variables: { input: data } });

        this.setStatusMessage('Ready...take a turn...');
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

        return queryResponse.data.listImages.items;
      },
      processTurnResults(imageEntries) {
        this.setStatusMessage('Processing the results from AWS Rekognition');

        console.log('processTurnResults:', imageEntries);

        if (imageEntries.length > 0) {
          const entry = imageEntries[0];

          let play = PLAY.AVAILABLE;

          switch (entry.detectedEmotion) {
            case 'fail':
              this.setStatusMessage('Some sort of failure...sorry, try again.')
              break;

            case entry.targetEmotion:
              console.log('emotions match:')
              if (parseFloat(entry.confidence) >= this.minimumConfidenceLevel) {
                // It's a hit!
                play = PLAY.HIT;
              } else {
                play = PLAY.MISS;
              }
              break;

            default:
              // It's a miss!
              play = PLAY.MISS;
          }

          if (entry.detectedEmotion != 'fail') {
            const confidence = parseFloat(entry.confidence).toFixed(2);

            switch (play) {
              case PLAY.HIT:
                this.setStatusMessage(`You got it! <strong>${entry.targetEmotion}</strong> with ${confidence}% confidence.`);
                break;
              case PLAY.MISS:
                if (entry.detectedEmotion == entry.targetEmotion) {
                  this.setStatusMessage(`Sorry your '${entry.detectedEmotion}' selfie confidence level was too low.`);
                } else {
                  this.setStatusMessage(`Sorry your selfie had more '${entry.detectedEmotion}' with ${confidence}% confidence.`);
                }
                break;
            }

            this.state.filter(cell => cell.name == entry.targetEmotion).forEach( cell => {
              cell.play = play;
            });

            // Flag the emotion as no-longer-available.
            this.updateAvailableEmotions(
              entry.targetEmotion);
          } else {
            this.setStatusMessage('Sorry, some sort of problem processing your image, try again');
            setTimeout(() => {
              this.setStatusMessage('');
            },
            10000)
          }
        } else {
          this.setStatusMessage('Some sort of failure...sorry, try again.')
        }

        this.processingEntry = false;

        this.saveGameState();

        this.$nextTick(() => {
          this.checkGameOver();
        });
      },
      async startNewGame() {
        await this.loadOrCreateGame();
      },
      logGameWin() {
        this.gameState = 'win';
        this.saveGameState('win');
        this.setStatusMessage('You Won!');
      },
      logGameLoss() {
        this.gameState = 'loss';
        this.saveGameState('loss');
        this.setStatusMessage('You Loose!  No way to win...please try again!')
      },
      checkGameOver() {
        const WIN = '11111';

        let byCol, d1, d2;

        // Extract play state of each cell.
        const line = this.state.map( x => x.play );

        // Check by "rows", then by columns, then diagonally.

        // By rows.
        const text = line.map( x => '' + x == -1 ? ' ': x ).join('');
        const byRow = text.match(/.{5}/g)

        if (byRow.indexOf(WIN) != -1) {
          // alert('Win by Row')
          this.logGameWin();
        } else {
          // Rotate cols to rows.
          let cols = [];
          for (var i=0; i < 5; i++) {
            cols = cols.concat([line[i], line[i+5], line[i+10], line[i+15], line[i+20]]);
          }

          const text2 = cols.map( x => '' + x == -1 ? ' ': x ).join('');
          byCol = text2.match(/.{5}/g)

          if (byCol.indexOf(WIN) != -1) {
            alert('Win by Col')
            this.logGameWin();
          } else {
            // 0,0 1,1 2,2 3,3 4,4
            d1 = []
            for (i=0; i < 5; i++) {
              d1.push(text[i*5+i]);
            }
            d1 = d1.join('');

            if (d1 == WIN) {
              alert('Win by diagonal 1')
              this.logGameWin();
            } else {
              // 4,0 3,1 2,2 1,3 0,4
              d2 = []
              for (i=5; i > 0; i--) {
                d2.push(text[i*5 - i]);
              }
              d2 = d2.join('');
              if (d2 == WIN) {
                alert('Win by diagonal 2')
                this.logGameWin();
              }
            }
          }
        }

        // No win...but is the game over?
        // Game is over if there's at least 1 miss in every row, col or diagonal.
        const noRowsAvailable = byRow.every(x => x.indexOf('0') != -1);
        const noColsAvailable = byCol.every(x => x.indexOf('0') != -1);
        const noDiagsAvailiable = d1.indexOf('0') != -1 && d2.indexOf('0') != -1;

        if (noRowsAvailable && noColsAvailable && noDiagsAvailiable) {
          // It's a loss.
          this.logGameLoss();
        }
      },
      async processTurnInfo(targetEmotion, imageFile) {
        this.turnActive = false;
        this.processingEntry = true;

        this.setStatusMessage('Sending your image to AWS Rekognition...');

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

          await Storage.put(
            imageFile.name,
            imageFile,
            {
              level: 'public',
              metadata: {
                'imageid': response.data.createImage.id
              }
            });

          this.setStatusMessage('Waiting for the results...');

          setTimeout(async () => {
            console.log('listImages');
            const results = await this.getUpdatedImageEntry(response.data.createImage.id);
            this.processTurnResults(results);
          },
          5000);
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
