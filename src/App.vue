<style lang="scss">
@import '@/assets/core.scss';
</style>

<template>
   <game />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Game from './components/game.vue';

@Options({
   components: { Game },
})
export default class App extends Vue {}
</script>
