import { Direction } from '../enums/direction';
import { Gem } from '../enums/gem';
import MapItem from './map-item';
import Point from './point';

export default class GameMap {
   private items: MapItem[][] = [];
   size: number;

   constructor(size: number) {
      this.size = size;
   }

   getAll(): MapItem[] {
      return Array.prototype.concat.apply([], this.items);
   }

   swap(a: Point, b: Point): void {
      const itemA = this.getItem(a);
      const itemB = this.getItem(b);
      const temp = itemA.value;
      itemA.value = itemB.value;
      itemB.value = temp;
   }

   getMatches(source: Point[]): Point[][] {
      return source.map((x) => this.getMatchesByPoint(x));
   }

   toggleBg(list: Point[]): void {
      list.forEach((point) => this.getItem(point).toggleBgValue());
   }

   clear(list: Point[]): void {
      list.forEach((point) => this.getItem(point).clear());
   }

   complement(): MapItem[] {
      const complemented: MapItem[] = [];
      for (let i = 0; i < this.size; i++) {
         let minPos = -1;
         for (let j = 0; j < this.size; j++) {
            const current = this.items[i][this.size - j - 1];
            if (current.value !== Gem.Clear) continue;
            current.fallFrom = this.getFallFrom(current, minPos);
            if (current.fallFrom < 0) {
               minPos--;
               current.setRandomValue();
            } else {
               const fallFromPoint = this.getItem(new Point(i, current.fallFrom));
               current.value = fallFromPoint.value;
               fallFromPoint.value = Gem.Clear;
            }
            complemented.push(current);
         }
      }
      return complemented;
   }

   getFallFrom(point: Point, minPos: number): number {
      const temp = point.clone();
      do temp.shift(Direction.Top);
      while (this.isPointInBounds(temp) && this.getItem(temp).value === Gem.Clear);
      return temp.y < 0 ? minPos : temp.y;
   }

   fill(): void {
      this.items = [];
      for (let i = 0; i < this.size; i++) {
         this.items.push([]);
         for (let j = 0; j < this.size; j++) {
            this.items[i].push(new MapItem(i, j));
         }
      }

      for (let i = 0; i < this.size; i++) {
         for (let j = 0; j < this.size; j++) {
            const current = this.items[i][j];
            do current.setRandomValue();
            while (this.getMatchesByPoint(current).length !== 0);
         }
      }
   }

   getMatchesByPoint(current: Point): Point[] {
      const allowDuplicates = 1;
      const leftMatches = this.getMathcesByPointAndDirection(current, Direction.Left);
      const rightMatches = this.getMathcesByPointAndDirection(current, Direction.Right);
      const rowMatches = leftMatches.length + rightMatches.length > allowDuplicates ? leftMatches.concat(rightMatches) : [];
      const topMatches = this.getMathcesByPointAndDirection(current, Direction.Top);
      const bottomMatches = this.getMathcesByPointAndDirection(current, Direction.Bottom);
      const colMatches = topMatches.length + bottomMatches.length > allowDuplicates ? topMatches.concat(bottomMatches) : [];
      const totalMatches = rowMatches.length + colMatches.length > allowDuplicates ? rowMatches.concat(colMatches).concat(current) : [];
      return totalMatches;
   }

   getMathcesByPointAndDirection(base: Point, dir: Direction): Point[] {
      const matches: Point[] = [];
      const temp = base.clone();
      while (this.isPointInBounds(temp)) {
         temp.shift(dir);
         if (!this.match(base, temp)) break;
         matches.push(temp.clone());
      }
      return matches;
   }

   isPointInBounds(point: Point): boolean {
      return point.x >= 0 && point.y >= 0 && point.x < this.size && point.y < this.size;
   }

   match(a: Point, b: Point): boolean {
      if (!this.isPointInBounds(a)) return false;
      if (!this.isPointInBounds(b)) return false;
      const itemA = this.getItem(a);
      const itemB = this.getItem(b);
      if (itemA.value === Gem.Clear) return false;
      return itemA.value === itemB.value;
   }

   getItem(point: Point): MapItem {
      return this.items[point.x][point.y];
   }
}
