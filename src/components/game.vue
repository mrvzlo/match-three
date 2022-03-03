<template>
   <canvas id="map" :style="{ width: width + 'px', height: height + 'px' }"></canvas>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import GameCore from './game-core';

export default class Game extends Vue {
   width = 300;
   height = 300;

   created() {
      const max = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
      this.width = max;
      this.height = max;
   }

   mounted() {
      const core = new GameCore();
   }
}
</script>
