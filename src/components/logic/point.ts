import { Direction } from '../enums/direction';

export default class Point {
   private _x: number;
   private _y: number;

   get x(): number {
      return this._x;
   }

   get y(): number {
      return this._y;
   }

   constructor(x: number, y: number) {
      this._x = x;
      this._y = y;
   }

   clone() {
      return new Point(this.x, this.y);
   }

   shift(dir: Direction, value = 1) {
      switch (dir) {
         case Direction.Left:
            this._x -= value;
            return;
         case Direction.Right:
            this._x += value;
            return;
         case Direction.Top:
            this._y -= value;
            return;
         case Direction.Bottom:
            this._y += value;
            return;
      }
   }

   setY(value: number) {
      this._y = value;
   }
}
