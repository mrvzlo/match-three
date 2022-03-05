import Point from './point';

export default class Score {
   private readonly FinishBonus = 1000;
   private readonly MatchBonuses = [1, 3, 5, 8, 13];
   private readonly CellBonus = 10;

   total = 0;
   info = '';
   time = 0;
   timerOn = false;

   scoreMatches(points: Point[]) {
      if (!points) return;
      let matchLength = points.length - 3;
      if (matchLength > this.MatchBonuses.length) matchLength = this.MatchBonuses.length - 1;
      this.total += this.MatchBonuses[matchLength];
   }

   completeCells(cells: number) {
      this.total += this.CellBonus * cells;
   }

   complete() {
      this.total += this.FinishBonus;
   }

   timerStart() {
      this.time = 5;
      this.timerOn = true;
      this.timerTick();
   }

   timerEnd() {
      this.timerOn = false;
   }

   timerTick() {
      if (!this.timerOn) return;
      this.time++;
      setTimeout(() => this.timerTick(), 100);
   }
}
