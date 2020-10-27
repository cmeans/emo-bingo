<template>
  <div>
    <div v-show="!turnActive">
    <div class="ma-4 d-inline float-left">
      <v-chip
        color="green"
        text-color="white"
      >
        {{ gameStatsWins }}
      </v-chip>
      &nbsp;
      <v-chip
        color="red"
        text-color="white"
      >
        {{ gameStatsLosses }}
      </v-chip>
    </div>
    <v-spacer></v-spacer>
    <div class="ma-2 mr-4 d-line text-right">
      <v-btn
        @click="startNewGame"
        v-show="['win', 'loss'].indexOf(gameState) != -1"
        class="mt-2"
      >
        Start a New Game
      </v-btn>
      <v-btn
        @click.stop="turnActive=true"
        v-show="gameState == 'active'"
        class="mt-2"
      >
        Take a Turn
      </v-btn>
    </div>
    </div>
    <TakeTurn v-show="turnActive" :playedEmotions="availableEmotions" :gameId="activeGameId" />
    <BingoSquare v-show="!turnActive" :boardState="boardState" :activeEmotion="targetEmotion" />
    <MessageDialog :title="dialogTitle" :message="dialogMessage" v-model="dialogShow" />
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
  import MessageDialog from './MessageDialog';
  import { emotionsList, emotionsInfo } from '../main';
  import { API, graphqlOperation, Storage /*, graphqlOperation */} from 'aws-amplify';
  import Auth from '@aws-amplify/auth';
  import { createGame, updateGame, createImage } from '../graphql/mutations';
  import { listGames, getImage, getStats } from '../graphql/queries';
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
      BingoSquare,
      MessageDialog
    },
    async created() {
      this.init();

      this.initGameEventListeners();
      await this.loadOrCreateGame()
        .then(() => console.log('loadOrCreated') );
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
        dialogTitle: '',
        dialogMessage: '',
        dialogShow: false,
        statusMessage: 'Nothing right now',
        freshGame: false,
        gameStatsWins: '',
        gameStatsLosses: ''
      }
    },
    watch: {
      async username(newUserName, oldUserName) {
        try {
          if (oldUserName) {
            this.stopImageUpdateSubscription();
          }
          if (newUserName) {
            await this.startImageUpdateSubscription();
          }
        } catch (ex) {
          console.log('Error subscribing:' + ex)
        }
      }
    },
    computed: {
      boardState() {
        return this.state;
      }
    },
    methods: {
      showDialog(title, message) {
        this.dialogTitle = title;
        this.dialogMessage = message;
        this.dialogShow = true;
      },
      async init() {
        const owner = await Auth.currentAuthenticatedUser();
        this.username = owner.username;
      },
      initGameEventListeners() {
        this.$root.$on(
          'turn-complete',
          async (targetEmotion, image) => {
            this.targetEmotion = targetEmotion;
            this.processTurnInfo(targetEmotion, image)
              .then(() => this.targetEmotion = '');
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

        console.log('Updated game:', response);

        if (['win', 'loss'].includes(status)) {
          await this.updateGameStats();
        }
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
      initAvailableEmotions() {
        let list = [];

        emotionsInfo.forEach((value) => {
          list.push(
            {
              selected: false,
              ...value
            });
        });

        this.availableEmotions = list;
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
          name: 'freebie'
          // emotion: 'freebie'
        });

        this.state = state;
      },
      initGameState() {
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
          const newGameResponse = await this.createNewGame();
          this.activeGameId = newGameResponse.data.createGame.id;
          this.freshGame = true;
        } else {
          const savedGame = foundGames[0];

          this.activeGameId = savedGame.id;
          this.state = JSON.parse(savedGame.state);
          this.availableEmotions = JSON.parse(savedGame.availableEmotions);
        }

        this.setStatusMessage('Ready...take a turn...');
        console.log(`GameId = ${this.activeGameId}`)
        this.gameState = 'active';

        await this.updateGameStats();
      },
      async createNewGame() {
        this.setStatusMessage('Initializing new game...');

        this.initGameState();

        const data = {
          status: 'active',
          state: JSON.stringify(this.state),
          availableEmotions: JSON.stringify(this.availableEmotions)
        };

        return await API.graphql({
          query: createGame,
          variables: { input: data }
        });
      },
      handleTurnResults(imageEntry) {
        if (imageEntry == null) {
          this.setStatusMessage('Some sort of failure...sorry, try again.');
          return;
        }

        this.setStatusMessage('Processing the results from AWS Rekognition');

        let play = PLAY.AVAILABLE;

        switch (imageEntry.detectedEmotion) {
          case 'fail':
            this.setStatusMessage('Ready...');
            this.showDialog('Error','Some sort of failure...sorry, try again.');
            return;

          case imageEntry.targetEmotion:
            console.log('emotions match:')
            if (parseFloat(imageEntry.confidence) >= this.minimumConfidenceLevel) {
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

        if (imageEntry.detectedEmotion != 'fail') {
          const confidence = parseFloat(imageEntry.confidence).toFixed(2);

          let message = `You were trying for <strong>${imageEntry.targetEmotion}</strong> with at least ${this.minimumConfidenceLevel}% confidence, `;

          switch (play) {
            case PLAY.HIT:
              message += `and you got it with ${confidence}% confidence.`;
              break;
            case PLAY.MISS:
              if (imageEntry.detectedEmotion == imageEntry.targetEmotion) {
                message += `but the selfie confidence level was too low at only ${confidence}%.`;
              } else {
                message += `but your selfie had more <strong>${imageEntry.detectedEmotion}</strong> with a confidence level of ${confidence}%.`;
              }
              break;
          }

          this.state.filter(cell => cell.name == imageEntry.targetEmotion).forEach( cell => {
            cell.play = play;
          });

          this.setStatusMessage('Ready...');
          this.showDialog('Analysis Result', message);

          // Flag the emotion as no-longer-available.
          this.updateAvailableEmotions(
            imageEntry.targetEmotion);
        }
      },
      async startNewGame() {
        this.$confetti.stop();
        await this.loadOrCreateGame();
      },
      async logGameWin() {
        this.dialogMessage += '<br/><br/><strong>And, you Won!</strong>';
        this.gameState = 'win';
        await this.saveGameState('win');

        this.$confetti.start({
          particles: [{
            type: 'image',
            url: '/images/jack-o-lantern.png',
            size: 30
          }, {
            type: 'circle'
          }, {
            type: 'rect'
          }],
          defaultColors: [
            'purple',
            'orange',
            'black'
          ]});
      },
      async logGameLoss() {
        this.dialogMessage += "<br/><br/><i>Sorry, you've lost this game, there's no way left to win!</i>";
        this.gameState = 'loss';
        await this.saveGameState('loss');
      },
      async checkGameStatus() {
        const WIN = '11111';

        let byCol, d1, d2;

        // Extract play state of each cell.
        const line = this.state.map( x => x.play );

        // Check by "rows", then by columns, then diagonally.

        // By rows.
        const text = line.map( x => '' + x == -1 ? ' ': x ).join('');
        const byRow = text.match(/.{5}/g)

        if (byRow.indexOf(WIN) != -1) {
          await this.logGameWin();
        } else {
          // Rotate cols to rows.
          let cols = [];
          for (var i=0; i < 5; i++) {
            cols = cols.concat([line[i], line[i+5], line[i+10], line[i+15], line[i+20]]);
          }

          const text2 = cols.map( x => '' + x == -1 ? ' ': x ).join('');
          byCol = text2.match(/.{5}/g)

          if (byCol.indexOf(WIN) != -1) {
            await this.logGameWin();
          } else {
            // 0,0 1,1 2,2 3,3 4,4
            d1 = []
            for (i=0; i < 5; i++) {
              d1.push(text[i*5+i]);
            }
            d1 = d1.join('');

            if (d1 == WIN) {
              await this.logGameWin();
            } else {
              // 4,0 3,1 2,2 1,3 0,4
              d2 = []
              for (i=5; i > 0; i--) {
                d2.push(text[i*5 - i]);
              }
              d2 = d2.join('');
              if (d2 == WIN) {
                await this.logGameWin();
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
          await this.logGameLoss();
        }

        if (this.gameState == 'active') {
          await this.saveGameState();
        }
      },
      async updateGameStats() {
        const response =
          await API.graphql(
            graphqlOperation(
              getStats,
              {
                id: this.username
              }));

        const stats = response.data.getStats;

        this.gameStatsWins = stats.wins == 1 ? '1 Win' : `${stats.wins} Wins`;
        this.gameStatsLosses = stats.losses == 1 ? '1 Loss' : `${stats.losses} Losses`;

        if (this.freshGame && (stats.wins + stats.losses) == 0) {
          this.$router.push({ path: '/instructions' });
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

          const imageId = response.data.createImage.id;

          console.log('Image id:', imageId);

          await Storage.put(
            imageFile.name,
            imageFile,
            {
              level: 'public',
              metadata: {
                'imageid': imageId
              }
            });

          this.setStatusMessage('Waiting for the results...');

          var wait = async (delay) => {
            return new Promise(resolve => setTimeout(resolve, delay))
          };

          var checkForUpdatedImageEntry = async () => {
            const response =
              await API.graphql(
                graphqlOperation(getImage, { id: imageId }));

            return response.data.getImage;
          };

          let imageEntry =
            await checkForUpdatedImageEntry();
          while (imageEntry.detectedEmotion == null) {
            await wait(5000);

            imageEntry =
              await checkForUpdatedImageEntry();
          }

          this.processingEntry = false;

          this.$nextTick(() => {
            this.handleTurnResults(imageEntry);

            this.checkGameStatus();
          });

          /*
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
