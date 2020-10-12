<template>
   <v-card
    class="ma-4"
   >
  <div class="wheel-wrapper">
    <v-btn
      class="wheel-pointer"
      v-on:click="onClickRotate"
      :disabled="spinnerDisabled"
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
          v-for="(item,index) in prizeList"
          :key="index"
        >
          <div
            class="prize-item"
            :style="`transform: rotate(${(360/ prizeList.length) * index}deg)`"
          >
            <div class="prize-name">
              <v-chip :id="item.name">
                <curve-text
                  :r="5"
                  offset="50%"
                  :height=20
                  :width=70
                  :debug="false"
                >{{ item.name }}</curve-text>
              </v-chip>
            </div>
            <div class="prize-icon">
              <img :src="item.icon" :width="item.size">
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

  export default {
    name: 'SpinningWheel',

    components: {
      CurveText
    },
    props:
      [
        'items'
      ],
    data: () => ({
      freeze: false,
      rolling: false,
      wheelDeg: 0,
      prizeNumber: 8,
      pickedItems: [],
    }),
  computed: {
    prizeList() {
      return this.items; //.slice(0, this.prizeNumber);
    },
    done() {
      return (this.pickedItems.length == this.items.length);
    },
    spinnerDisabled() {
      return (this.done || this.rolling);
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

        const name = prizeList[result].name;
        this.$emit('emotion', name);
        document.getElementById(name).style.backgroundColor = 'black';
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

<style type="text/scss" scoped>
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
  /* width: 60px;
  height: 60px;
  border-radius: 1000px;
  background: yellow;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 60px;
  z-index: 10; */
  cursor: pointer;

  /* &::after {
    content: "";
    position: absolute;
    top: -32px;
    left: 50%;
    border-width: 0 8px 40px;
    border-style: solid;
    border-color: transparent transparent yellow;
    transform: translateX(-50%);
  } */
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

  .prize-name {
    padding: 16px 0;
  }

  .prize-icon {
  }
}

</style>
