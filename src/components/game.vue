<template>
   <div id="main">
      <div class="title">
         <div>Score: {{ score.total }}</div>
         <div>{{ score.info }}</div>
         <div>Time: {{ formatTime() }}</div>
      </div>
      <div id="canvases">
         <canvas id="back" :style="{ width: width + 'px', height: height + 'px' }"></canvas>
         <canvas id="gems" :style="{ width: width + 'px', height: height + 'px' }"></canvas>
      </div>
   </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import GameEvents from './game-events';
import Score from './logic/score';

export default class Game extends Vue {
   width = 300;
   height = 300;
   score = new Score();

   mounted() {
      const parent = document.getElementById('canvases') as HTMLElement;
      const max = Math.min(parent.offsetHeight, parent.offsetWidth);
      this.width = max;
      this.height = max;
      const core = new GameEvents(max, this.score);
   }

   formatTime() {
      const min = Math.floor(this.score.time / 600);
      const sec = Math.floor(this.score.time / 10) % 60;
      return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
   }
}
</script>
