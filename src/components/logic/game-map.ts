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

   getItem(point: Point): MapItem {
      return this.items[point.x][point.y];
   }

   getAll(): MapItem[] {
      return Array.prototype.concat.apply([], this.items);
   }

   swap(a: Point, b: Point): void {
      const temp = this.items[a.x][a.y];
      this.items[a.x][a.y] = this.items[b.x][b.y];
      this.items[b.x][b.y] = temp;
   }

   getMatches(source: Point[]): Point[] {
      const comboes = source.map((x) => this.getMatchesByPoint(x));
      return Array.prototype.concat.apply([], comboes);
   }

   delete(list: Point[]): void {
      list.forEach((item) => (this.items[item.x][item.y].value = Gem.Clear));
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
      do temp.y--;
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
         switch (dir) {
            case Direction.Left:
               temp.x--;
               break;
            case Direction.Right:
               temp.x++;
               break;
            case Direction.Top:
               temp.y--;
               break;
            case Direction.Bottom:
               temp.y++;
               break;
         }
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
      if (this.items[a.x][a.y].value === Gem.Clear) return false;
      return this.items[a.x][a.y].value === this.items[b.x][b.y].value;
   }
}
