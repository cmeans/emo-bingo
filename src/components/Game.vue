<template>
  <div>
    <div v-show="!turnActive">
      <div
        class="float-left mt-1 ml-4">
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
        &nbsp;
        <v-btn
          @click="leaderBoardShow=true"
          icon
          color="primary"
        >
          <v-icon>
            mdi-clipboard-list
          </v-icon>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <div
        class="text-right mt-1 mr-4"
      >
        <v-btn
          @click="startNewGame"
          v-show="['win', 'loss'].indexOf(gameState) != -1"
        >
          New Game
        </v-btn>
        <v-btn
          @click.stop="turnActive=true"
          v-show="gameState == 'active'"
        >
          Take a Turn
        </v-btn>
      </div>
    </div>
    <TakeTurn
      v-show="turnActive"
      :playedEmotions="availableEmotions"
      :gameId="activeGameId" />
    <BingoSquare
      v-show="!turnActive"
      :boardState="boardState"
      :activeEmotion="targetEmotion" />
    <p v-show="!turnActive" class="text-center ma-4">
      {{ waysToWin }}
    </p>
    <MessageDialog :title="dialogTitle" :message="dialogMessage" v-model="dialogShow" />
    <LeaderBoard v-model="leaderBoardShow" />
    <v-overlay :absolute="true" v-show="processingEntry">
      <v-progress-circular
        indeterminate
        size="70"
        width="7"
        color="primary"
      />
    </v-overlay>
  </div>
</template>

<script>
  import TakeTurn from './TakeTurn';
  import BingoSquare from './BingoSquare';
  import MessageDialog from './MessageDialog';
  import LeaderBoard from './LeaderBoard';
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
      MessageDialog,
      LeaderBoard
    },
    async created() {
      this.init();

      this.initGameEventListeners();
      await this.loadOrCreateGame()
        .then(() => console.log('loadOrCreated') );
    },
    destroyed() {
      this.stopGameWon();
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
        gameStatsLosses: '',
        leaderBoardShow: false,
        waysToWin: '',
        gameStatus: null
      }
    },
    watch: {
      /*
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
      */
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

            await this.processTurnInfo(targetEmotion, image)
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
          await this.getGameStats();
        } else {
          this.computeGameStatus();
          this.updateWaysToWin();
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
        this.setStatusMessage('Looking for an active game...');

        let filter = {
          status: {
            eq: 'active'
          }
        };

        const response =
          await API.graphql({
            query: listGames,
            variables: {
              filter
            }});

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

          this.computeGameStatus();
          this.updateWaysToWin();
        }

        this.setStatusMessage('Ready...take a turn...');
        console.log(`GameId = ${this.activeGameId}`)
        this.gameState = 'active';

        await this.getGameStats();
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
        this.stopGameWon();
        await this.loadOrCreateGame();
      },
      async logGameWin() {
        this.dialogMessage += '<br/><br/><strong>And, you Won!</strong>';
        this.gameState = 'win';
        await this.saveGameState('win');

        this.startGameWon();
      },
      async logGameLoss() {
        this.dialogMessage += "<br/><br/><i>Sorry, you've lost this game, there's no way left to win!</i>";
        this.gameState = 'loss';

        await this.saveGameState('loss');
      },
      computeGameStatus() {
        let status = {};

        // Extract play state of each cell.
        const line = this.state.map( x => x.play );

        // Check by "rows", then by columns, then diagonally.

        // By rows.
        const text = line.map( x => '' + x == -1 ? ' ': x ).join('');
        status.byRow = text.match(/.{5}/g)

        // Rotate cols to rows.
        let cols = [];
        for (var i=0; i < 5; i++) {
          cols = cols.concat([line[i], line[i+5], line[i+10], line[i+15], line[i+20]]);
        }

        const text2 = cols.map( x => '' + x == -1 ? ' ': x ).join('');
        status.byCol = text2.match(/.{5}/g)

        // 0,0 1,1 2,2 3,3 4,4
        let d1 = []
        for (i=0; i < 5; i++) {
          d1.push(text[i*5+i]);
        }
        status.d1 = d1.join('');

        // 4,0 3,1 2,2 1,3 0,4
        let d2 = []
        for (i=5; i > 0; i--) {
          d2.push(text[i*5 - i]);
        }
        status.d2 = d2.join('');

        this.gameStatus = status;
      },
      async checkGameStatus() {
        this.computeGameStatus();

        const WIN = '11111';

        if (   this.gameStatus.byRow.indexOf(WIN) != -1
            || this.gameStatus.byCol.indexOf(WIN) != -1
            || this.gameStatus.d1 == WIN
            || this.gameStatus.d2 == WIN) {
          await this.logGameWin();
        }

        // No win...but is the game over?
        // Game is over if there's at least 1 miss in every row, col or diagonal.
        const noRowsAvailable = this.gameStatus.byRow.every(x => x.indexOf('0') != -1);
        const noColsAvailable = this.gameStatus.byCol.every(x => x.indexOf('0') != -1);
        const noDiagsAvailiable = this.gameStatus.d1.indexOf('0') != -1 && this.gameStatus.d2.indexOf('0') != -1;

        if (noRowsAvailable && noColsAvailable && noDiagsAvailiable) {
          // It's a loss.
          await this.logGameLoss();
        }

        if (this.gameState == 'active') {
          await this.saveGameState();
        } else {
          this.waysToWin = '';
        }
      },
      updateWaysToWin() {
        const rowsAvailable = this.gameStatus.byRow.filter(x => x.indexOf('0') == -1).length;
        const colsAvailable = this.gameStatus.byCol.filter(x => x.indexOf('0') == -1).length;
        const diagsAvailable = (this.gameStatus.d1.indexOf('0') == -1 ? 1 : 0) + (this.gameStatus.d2.indexOf('0') == -1 ? 1 : 0);

        let list = [];
        if (rowsAvailable > 0) {
          list.push(`${rowsAvailable} row${rowsAvailable == 1 ? '': 's'}`);
        }
        if (colsAvailable > 0) {
          list.push(`${colsAvailable} column${colsAvailable == 1 ? '': 's'}`);
        }
        if (diagsAvailable > 0) {
          list.push(`${diagsAvailable} diagonal${diagsAvailable == 1 ? '': 's'}`);
        }

        const count = rowsAvailable + colsAvailable + diagsAvailable;

        this.waysToWin = `You have ${count} way${count == 1 ? '' : 's'} remaining to win: ${list.join(', ')}`;
      },
      async getGameStats() {
        console.log('Get Game Stats');

        const response =
          await API.graphql(
            graphqlOperation(
              getStats,
              {
                id: this.username
              }));

        const stats = response.data.getStats;

        this.gameStatsWins = `${stats.wins} Win${stats.wins == 1 ? '' : 's'}`;
        this.gameStatsLosses = `${stats.losses} Loss${stats.losses == 1 ? '' : 'es'}`;

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
                graphqlOperation(
                  getImage, {
                  id: imageId
                }));

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

          this.$nextTick(
            async () => {
              this.handleTurnResults(imageEntry);

              await this.checkGameStatus();
            });
        }
        finally {
          // this.overlay = false;
        }
      },
      startGameWon() {
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

          setTimeout(
            () => this.stopGameWon(),
            20000);
      },
      stopGameWon() {
        this.$confetti.stop();
      }
    }
  }
</script>
