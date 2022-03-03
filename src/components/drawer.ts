import { CanvasSize, CellMargin, CellOuterSize, CellPadding, FPS, FrameTime, MatrixSize } from './constants';
import { Gem } from './enums/gem';
import GemDrawer from './gem-drawer';
import MapItem from './logic/map-item';
import Point from './logic/point';

export default class Drawer {
   private readonly canvas: HTMLCanvasElement;
   private readonly context: CanvasRenderingContext2D;
   private readonly gemDrawer: GemDrawer;

   constructor() {
      this.canvas = document.getElementById('map') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.gemDrawer = new GemDrawer();

      this.canvas.width = CanvasSize;
      this.canvas.height = this.canvas.width;
      this.context.setTransform(1, 0, 0, 1, 0, 0);
   }

   drawAll(list: MapItem[]) {
      list.forEach((item) => {
         this.drawCellBg(item as Point);
         this.drawMapItem(item);
      });
   }

   async swap(first: MapItem, second: MapItem) {
      const baseFirst = first.clone();
      const baseSecond = second.clone();
      const animationTime = 100;
      const frames = (FPS * animationTime) / 1000;
      for (let i = 0; i < animationTime; i += FrameTime) {
         this.drawCellBg(baseFirst);
         this.drawCellBg(baseSecond);
         second.x += (baseFirst.x - baseSecond.x) / frames;
         second.y += (baseFirst.y - baseSecond.y) / frames;
         first.x += (baseSecond.x - baseFirst.x) / frames;
         first.y += (baseSecond.y - baseFirst.y) / frames;
         this.drawMapItem(second);
         this.drawMapItem(first);
         await this.wait(FrameTime);
      }
      first.round();
      second.round();
   }

   async delete(list: MapItem[]) {
      const animationTime = 200;
      const frames = animationTime / FrameTime;
      for (let i = 0; i < frames; i++) {
         list.forEach((item) => {
            this.context.fillStyle = `rgba(255,255,255,${1 / frames})`;
            this.fillCell(item);
         });
         await this.wait(FrameTime);
      }
      list.forEach((item) => this.fillBg(item));
   }

   async fall(list: MapItem[]) {
      const maxFallTime = 1500;
      while (list.length > 0) {
         list.forEach((item) => {
            item.fallFrom++;
            const temp = item.clone();
            temp.y = item.fallFrom;
            this.fillBg(temp);
            this.drawMapItem(temp);
         });

         list = list.filter((item) => item.y > item.fallFrom);

         await this.wait(FrameTime);
      }
   }

   drawMapItem(mapItem: MapItem) {
      const absolutePoint = this.getAbsolutePosition(mapItem, CellPadding);
      this.context.beginPath();
      switch (mapItem.value) {
         case Gem.Red:
            return this.gemDrawer.drawRed(absolutePoint, this.context);
         case Gem.Green:
            return this.gemDrawer.drawGreen(absolutePoint, this.context);
         case Gem.Blue:
            return this.gemDrawer.drawBlue(absolutePoint, this.context);
         case Gem.Purple:
            return this.gemDrawer.drawPurple(absolutePoint, this.context);
         case Gem.Yellow:
            return this.gemDrawer.drawYellow(absolutePoint, this.context);
      }
   }

   drawCellBg(point: Point) {
      this.drawBorders(point);
      this.fillBg(point);
   }

   fillBg(point: Point) {
      this.context.fillStyle = '#fff';
      this.fillCell(point);
   }

   drawBorders(point: Point) {
      const absolutePoint = this.getAbsolutePosition(point);
      this.context.strokeRect(absolutePoint.x, absolutePoint.y, CellOuterSize, CellOuterSize);
   }

   fillCell(point: Point) {
      const padding = 1;
      const cellInnerSize = CellOuterSize - padding * 2;
      const absolutePoint = this.getAbsolutePosition(point, padding);
      this.context.fillRect(absolutePoint.x, absolutePoint.y, cellInnerSize, cellInnerSize);
   }

   getAbsolutePosition(point: Point, padding = 0): Point {
      const left = CellMargin + padding + CellOuterSize * point.x;
      const top = CellMargin + padding + CellOuterSize * point.y;
      return new Point(left, top);
   }

   wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
