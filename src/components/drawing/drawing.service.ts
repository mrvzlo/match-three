import { CanvasSize, CellInnerSize, CellMargin, CellOuterSize, CellPadding, FPS, FrameTime, MatrixSize } from '../constants';
import { Direction } from '../enums/direction';
import { Gem } from '../enums/gem';
import GemDrawingService from './gem-drawing.service';
import MapItem from '../logic/map-item';
import Point from '../logic/point';

export default class DrawingService {
   private readonly gemsContext: CanvasRenderingContext2D;
   private readonly bgContext: CanvasRenderingContext2D;
   private readonly gemDrawer: GemDrawingService;

   constructor() {
      const gemsCanvas = document.getElementById('gems') as HTMLCanvasElement;
      this.gemsContext = gemsCanvas.getContext('2d') as CanvasRenderingContext2D;
      const bgCanvas = document.getElementById('back') as HTMLCanvasElement;
      this.bgContext = bgCanvas.getContext('2d') as CanvasRenderingContext2D;
      this.gemDrawer = new GemDrawingService();

      gemsCanvas.width = CanvasSize;
      gemsCanvas.height = CanvasSize;
      bgCanvas.width = CanvasSize;
      bgCanvas.height = CanvasSize;
      this.gemsContext.setTransform(1, 0, 0, 1, 0, 0);
      this.bgContext.setTransform(1, 0, 0, 1, 0, 0);
   }

   drawAll(list: MapItem[]) {
      list.forEach((item) => {
         this.drawBorders(item);
         this.clearCell(item);
         this.drawMapItem(item);
      });
   }

   async swap(first: MapItem, second: MapItem) {
      const baseFirst = first.clone();
      const baseSecond = second.clone();
      const tempFirst = first.clone();
      const tempSecond = second.clone();

      const animationTime = 100;
      const frames = (FPS * animationTime) / 1000;
      for (let i = 0; i < animationTime; i += FrameTime) {
         this.clearCell(baseFirst);
         this.clearCell(baseSecond);
         tempSecond.shift(Direction.Right, (baseFirst.x - baseSecond.x) / frames);
         tempSecond.shift(Direction.Bottom, (baseFirst.y - baseSecond.y) / frames);
         tempFirst.shift(Direction.Right, (baseSecond.x - baseFirst.x) / frames);
         tempFirst.shift(Direction.Bottom, (baseSecond.y - baseFirst.y) / frames);
         this.drawMapItem(tempSecond);
         this.drawMapItem(tempFirst);
         await this.wait(FrameTime);
      }
   }

   async delete(list: MapItem[]) {
      const animationTime = 150;
      const frames = animationTime / FrameTime;
      list.forEach((item) => this.fillBg(item));
      for (let i = 0; i < frames; i++) {
         list.forEach((item) => this.drawErrosion(item, i / frames));
         await this.wait(FrameTime);
      }
   }

   async fall(list: MapItem[]) {
      while (list.length > 0) {
         list.forEach((item) => {
            item.fallFrom += 0.5;
            const temp = item.clone();
            temp.setY(item.fallFrom);
            if (temp.y < 0) return;
            this.clearCell(temp);
            this.drawMapItem(temp);
         });

         list = list.filter((item) => item.y > item.fallFrom);
         await this.wait(FrameTime);
      }
   }

   drawMapItem(mapItem: MapItem) {
      const absolutePoint = this.getAbsolutePosition(mapItem, CellPadding);
      switch (mapItem.value) {
         case Gem.Red:
            return this.gemDrawer.drawRed(absolutePoint, this.gemsContext);
         case Gem.Green:
            return this.gemDrawer.drawGreen(absolutePoint, this.gemsContext);
         case Gem.Blue:
            return this.gemDrawer.drawBlue(absolutePoint, this.gemsContext);
         case Gem.Purple:
            return this.gemDrawer.drawPurple(absolutePoint, this.gemsContext);
         case Gem.Yellow:
            return this.gemDrawer.drawYellow(absolutePoint, this.gemsContext);
      }
   }

   clearCell(point: Point) {
      const borderWidth = 1;
      const absolutePoint = this.getAbsolutePosition(point, -borderWidth);
      this.gemsContext.clearRect(absolutePoint.x, absolutePoint.y, CellOuterSize + borderWidth * 2, CellOuterSize + borderWidth * 2);
   }

   drawErrosion(point: Point, percent: number) {
      const padding = ((1 - percent) * CellInnerSize) / 2;
      const absolutePoint = this.getAbsolutePosition(point, padding);
      const cellInnerSize = CellOuterSize - padding * 2;
      this.gemsContext.clearRect(absolutePoint.x, absolutePoint.y, cellInnerSize, cellInnerSize);
   }

   private fillBg(point: MapItem) {
      this.bgContext.fillStyle = !point.bgValue ? '#eec' : '#fff';
      this.fillCell(point);
   }

   private drawBorders(point: Point) {
      this.bgContext.lineWidth = 1;
      this.bgContext.strokeStyle = '#aaa';
      const absolutePoint = this.getAbsolutePosition(point);
      this.bgContext.strokeRect(absolutePoint.x, absolutePoint.y, CellOuterSize, CellOuterSize);
   }

   private fillCell(point: Point) {
      const borderWidth = 1;
      const cellInnerSize = CellOuterSize - borderWidth * 2;
      const absolutePoint = this.getAbsolutePosition(point, borderWidth);
      this.bgContext.fillRect(absolutePoint.x, absolutePoint.y, cellInnerSize, cellInnerSize);
   }

   private getAbsolutePosition(point: Point, padding = 0): Point {
      const left = CellMargin + padding + CellOuterSize * point.x;
      const top = CellMargin + padding + CellOuterSize * point.y;
      return new Point(left, top);
   }

   private wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
