<template>
  <v-card
    elevation="0"
    class="ma-4"
    height="310"
    width="310"
  >
    <div class="wheel-wrapper">
      <v-btn
        class="wheel-pointer"
        v-on:click="onClickRotate"
        :disabled="spinnerDisabled"
        elevation="0"
      >
        Spin
      </v-btn>
      <div
        class="wheel-bg"
        :class="{freeze: freeze}"
        :style="`transform: rotate(${wheelDeg}deg)`"
      >
        <div class="prize-list">
          <div
            class="prize-item-wrapper"
            v-for="(item,index) in playedEmotions"
            :key="item.id"
          >
            <div
              class="prize-item"
              :style="`transform: rotate(${(360/ prizeList.length) * index}deg)`"
            >
              <div class="prize-name">
                <v-chip
                  :id="item.name"
                  :class="{
                    'item-selected': item.selected
                  }"
                >
                  <curve-text
                    :r="5"
                    offset="50%"
                    :height=20
                    :width=70
                    :debug="false"
                  >{{ item.name }}</curve-text>
                </v-chip>
              </div>
              <div class="prize-icon ma-2">
                <img :src="emotionIcons[item.name].icon" width="50">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import CurveText from '@inotom/vue-curve-text';
import { emotionIcons } from '../main';

export default {
  name: 'SpinningWheel',

  components: {
    CurveText
  },
  props:
    [
      'playedEmotions',
      'disabled'
    ],
  data: () => ({
    freeze: false,
    rolling: false,
    wheelDeg: 0,
    prizeNumber: 8,
    // pickedItems: [],
    emotionIcons,
    emotion: null
  }),
  computed: {
    pickedItems() {
      var list = [];
      this.playedEmotions.forEach( (item, index) => {
        if (item.selected) {
          list.push(index);
        }
      });

      return list;
    },
    prizeList() {
      return this.playedEmotions;
    },
    done() {
      return (this.pickedItems.length == this.playedEmotions.length);
    },
    spinnerDisabled() {
      return (this.done || this.rolling || this.disabled);
    }
  },
  methods: {
    randomItem() {
      return Math.floor(Math.random() * this.prizeList.length);
    },
    nextResult() {
      let result = this.randomItem();
      while (this.pickedItems.includes(result)) {
        result = this.randomItem();
      }
      this.pickedItems.push(result);

      return result;
    },
    onClickRotate() {
      if (this.rolling) {
        return;
      }
      const result = this.nextResult();

      this.roll(result);
    },
    roll(result) {
      this.rolling = true;
      const { wheelDeg, prizeList } = this;
      this.wheelDeg =
        wheelDeg -
        wheelDeg % 360 +
        (this.done ? 0 : 6) * 360 +
        (360 - 360 / prizeList.length * result);
      setTimeout(() => {
        this.rolling = false;

        let item = prizeList[result];
        item.selected = true;

        // const chip = document.getElementById(item.name);
        // chip.style.backgroundColor = 'green';
        // chip.style.color = 'white';
        // chip.style.fontWeight = 'bold';

        this.$root.$emit(
          'emotion',
          item.name);
        //this.emotion = item.name;
      }, 4500);
    }
  },
  watch: {
    prizeNumber() {
      this.freeze = true;
      this.wheelDeg = 0;

      setTimeout(() => {
        this.freeze = false;
      }, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
.wheel-wrapper {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 0%;
  left: 0%;
  /* transform: translate(-50%, -50%); */
}

.wheel-pointer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* line-height: 60px; */
  z-index: 10;
  /*
  width: 60px;
  height: 60px;
  border-radius: 1000px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 60px;
  z-index: 10;
  cursor: pointer;
  */

  /*
  &::after {
    content: "";
    position: absolute;
    top: -32px;
    left: 50%;
    border-width: 0 8px 40px;
    border-style: solid;
    border-color: transparent transparent yellow;
    transform: translateX(-50%);
  }
  */
}
.wheel-bg {
  width: 100%;
  height: 100%;
  border-radius: 1000px;
  overflow: hidden;
  transition: transform 4s ease-in-out;
  background: goldenrod;

  &.freeze {
    transition: none;
    background: blue;
  }
}

.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}

.prize-item-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
}

.prize-item {
  width: 100%;
  height: 100%;
  transform-origin: bottom;

  // .prize-name {
  //   padding: 16px 0;
  // }

  .prize-icon {
  }

  // .theme--light.v-chip.item-just-selected {
  //   background: green !important;
  //   font-weight: bold;
  // }

  .theme--light.v-chip.item-selected {
    background: black;
    color: white;
  }
}

</style>
