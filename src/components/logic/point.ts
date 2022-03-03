export default class Point {
   x: number;
   y: number;

   constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.round();
   }

   round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
   }

   clone() {
      return new Point(this.x, this.y);
   }
}
