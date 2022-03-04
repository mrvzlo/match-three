import DrawingService from './drawing/drawing.service';
import GameMap from './logic/game-map';
import Point from './logic/point';
import { CanvasSize, CellMargin, CellOuterSize, MatrixSize } from './constants';
import { Direction } from './enums/direction';

export default class GameCore {
   private readonly drawingService: DrawingService;
   private readonly boundaries: DOMRect;

   lock = false;
   matrix: GameMap;
   focused: Point | null = null;

   constructor() {
      this.matrix = new GameMap(MatrixSize);
      this.drawingService = new DrawingService();
      this.matrix.fill();
      this.drawingService.drawAll(this.matrix.getAll());

      const gemsCanvas = document.getElementById('gems') as HTMLElement;
      this.boundaries = gemsCanvas.getBoundingClientRect();
      gemsCanvas.addEventListener('mousedown', (e: any) => this.pick(new Point(e.offsetX, e.offsetY)));
      gemsCanvas.addEventListener('touchstart', (e: any) => this.pick(this.getPointFromToches(e)));
      gemsCanvas.addEventListener('mousemove', (e: any) => this.move(new Point(e.offsetX, e.offsetY)));
      gemsCanvas.addEventListener('touchmove', (e: any) => this.move(this.getPointFromToches(e)));
      document.addEventListener('mouseup', () => this.cancel());
      document.addEventListener('touchend', () => this.cancel());
   }

   getPointFromToches(event: any): Point {
      const firstTouch = event.touches[0];
      const parent = firstTouch.target;
      const left = (window.innerWidth - parent.offsetWidth) / 2;
      const top = (window.innerHeight - parent.offsetHeight) / 2;
      const x = firstTouch.pageX - left;
      const y = firstTouch.pageY - top;
      return new Point(x, y);
   }

   pick(point: Point) {
      if (this.lock) return;
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

      this.lock = true;
      await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      this.matrix.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      const matches = this.matrix.getMatches([first, second]);
      if (matches.length === 0) {
         await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
         this.matrix.swap(first, second);
      } else {
         await this.delete(matches);
      }
      this.lock = false;
   }

   async delete(matches: Point[]) {
      while (matches.length > 0) {
         const mapItems = matches.map((x) => this.matrix.getItem(x));
         this.matrix.toggleBg(mapItems);
         await this.drawingService.delete(mapItems);
         this.matrix.clear(mapItems);
         const complemented = this.matrix.complement();
         matches = this.matrix.getMatches(complemented);
         await this.drawingService.fall(complemented);
      }
   }

   getSecondPoint(from: Point, to: Point): Point | null {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      if (dx === 0 && dy === 0) return null;

      const second = from.clone();
      const direction = dx < 0 ? Direction.Left : dx > 0 ? Direction.Right : dy < 0 ? Direction.Top : Direction.Bottom;
      second.shift(direction);
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
