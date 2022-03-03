import Drawer from './drawer';
import GameMap from './logic/game-map';
import Point from './logic/point';
import { CanvasSize, CellMargin, CellOuterSize, MatrixSize } from './constants';
import MapItem from './logic/map-item';

export default class GameCore {
   private readonly drawingService: Drawer;
   private readonly boundaries: DOMRect;

   matrix: GameMap;
   focused: Point | null = null;

   constructor() {
      this.matrix = new GameMap(MatrixSize);
      this.drawingService = new Drawer();
      this.matrix.fill();
      this.drawingService.drawAll(this.matrix.getAll());

      const map = document.getElementById('map') as HTMLElement;
      this.boundaries = map.getBoundingClientRect();
      map.addEventListener('mousedown', (e: any) => this.pick(new Point(e.offsetX, e.offsetY)));
      map.addEventListener('touchstart', (e: any) => {
         const first = e.touches[0];
         const x = first.pageX - first.target.offsetLeft;
         const y = first.pageY - first.target.offsetTop;
         this.pick(new Point(x, y));
      });

      document.addEventListener('mouseup', () => this.cancel());
      document.addEventListener('touchend', () => this.cancel());
      map.addEventListener('mousemove', (e: any) => {
         const point = new Point(e.offsetX, e.offsetY);
         this.move(point);
      });
      map.addEventListener('touchmove', (e: any) => {
         const first = e.touches[0];
         const x = first.pageX - first.target.offsetLeft;
         const y = first.pageY - first.target.offsetTop;
         this.move(new Point(x, y));
      });
   }

   pick(point: Point) {
      this.focused = this.getCoordinates(point);
      if (this.focused === null) return;
      this.drawingService.drawMapItem(this.matrix.getItem(this.focused));
   }

   async move(point: Point) {
      if (this.focused === null) return;
      const temp = this.getCoordinates(point);
      if (temp === null) return;
      const first = this.focused.clone();
      const second = this.getSecondPoint(first, temp);
      if (second === null) return;
      this.focused = null;

      await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      this.matrix.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      const matches = this.matrix.getMatches([first, second]);
      if (matches.length === 0) {
         await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
         this.matrix.swap(first, second);
         return;
      }

      await this.delete(matches);
   }

   async delete(matches: Point[]) {
      while (matches.length > 0) {
         const mapItems = matches.map((x) => this.matrix.getItem(x));
         await this.drawingService.delete(mapItems);
         this.matrix.delete(matches);
         const complemented = this.matrix.complement();
         await this.drawingService.fall(complemented);
         matches = this.matrix.getMatches(complemented);
      }
   }

   getSecondPoint(from: Point, to: Point): Point | null {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      if (dx === 0 && dy === 0) return null;

      const second = from.clone();
      if (dx < 0) second.x--;
      else if (dx > 0) second.x++;
      else if (dy < 0) second.y--;
      else if (dy > 0) second.y++;
      return second;
   }

   cancel(): void {
      if (this.focused === null) return;
      this.drawingService.drawMapItem(this.matrix.getItem(this.focused));
      this.focused = null;
   }

   getCoordinates(offset: Point): Point | null {
      const posX = ((offset.x - CellMargin) * CanvasSize) / this.boundaries.width;
      const posY = ((offset.y - CellMargin) * CanvasSize) / this.boundaries.height;
      const cellX = posX / CellOuterSize;
      const cellY = posY / CellOuterSize;
      if (cellX < 0 || cellY < 0 || cellX >= MatrixSize || cellY >= MatrixSize) return null;

      return new Point(Math.floor(cellX), Math.floor(cellY));
   }
}
