import DrawingService from './drawing/drawing.service';
import GameMap from './logic/game-map';
import Point from './logic/point';
import { CanvasSize, CellMargin, CellOuterSize, MatrixSize } from './constants';
import { Direction } from './enums/direction';
import Score from './logic/score';

export default class GameEvents {
   private readonly drawingService: DrawingService;

   lock = false;
   matrix: GameMap;
   focused: Point | null = null;
   started = false;
   stoped = false;

   constructor(private readonly boundaries: number, private readonly score: Score) {
      this.matrix = new GameMap(MatrixSize);
      this.drawingService = new DrawingService();
      this.matrix.fill();
      this.drawingService.drawAll(this.matrix.getAll());

      const gemsCanvas = document.getElementById('gems') as HTMLElement;
      gemsCanvas.addEventListener('pointerdown', (e: any) => this.pick(this.getPointFromClick(e)));
      gemsCanvas.addEventListener('pointermove', (e: any) => this.move(this.getPointFromClick(e)));
      document.addEventListener('pointerup', () => this.cancel());
   }

   getPointFromClick(event: any): Point {
      return new Point(event.offsetX, event.offsetY);
   }

   pick(point: Point) {
      if (this.lock || this.stoped) return;
      this.focused = this.getCoordinates(point);
   }

   async move(point: Point) {
      if (this.focused === null) return;
      const temp = this.getCoordinates(point);
      if (temp === null) return;
      const first = this.focused.clone();
      const second = this.getSecondPoint(first, temp);
      if (second === null) return;
      this.focused = null;
      if (!this.started) {
         this.score.timerStart();
         this.started = true;
      }

      this.lock = true;
      await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      this.matrix.swap(this.matrix.getItem(first), this.matrix.getItem(second));
      const matches = this.matrix.getMatches([first, second]);
      const hasMatch = matches.some((x) => x.length > 0);
      if (hasMatch) {
         await this.delete(matches);
      } else {
         await this.drawingService.swap(this.matrix.getItem(first), this.matrix.getItem(second));
         this.matrix.swap(first, second);
      }
      this.check();
      this.lock = false;
   }

   check() {
      const remaining = this.matrix.getAll().filter((x) => x.bgValue);
      if (remaining.length > 0) return;
      this.score.timerEnd();
      this.score.complete();
      this.stoped = true;
   }

   async delete(matches: Point[][]) {
      while (matches.length > 0) {
         matches = matches.filter((x) => x.length > 0);
         matches.forEach((x) => this.score.scoreMatches(x));
         const total = ([] as Point[]).concat.apply([], matches);
         const mapItems = total.map((x) => this.matrix.getItem(x));
         this.score.completeCells(mapItems.filter((x) => x.bgValue).length);
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
      const posX = (offset.x * CanvasSize) / this.boundaries - CellMargin;
      const posY = (offset.y * CanvasSize) / this.boundaries - CellMargin;
      const cellX = posX / CellOuterSize;
      const cellY = posY / CellOuterSize;
      if (cellX < 0 || cellY < 0 || cellX >= MatrixSize || cellY >= MatrixSize) return null;
      return new Point(Math.floor(cellX), Math.floor(cellY));
   }
}
