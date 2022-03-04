import { CellInnerSize, CellOuterSize } from '../constants';
import Point from '../logic/point';

export default class GemDrawingService {
   drawRed(basePoint: Point, context: CanvasRenderingContext2D) {
      const path = [new Point(4, 5), new Point(CellInnerSize - 4, 5), new Point(CellInnerSize / 2, CellInnerSize)];
      context.fillStyle = `#a55`;
      this.drawPolygon(basePoint, path, context);
   }

   drawGreen(basePoint: Point, context: CanvasRenderingContext2D) {
      const radius = CellInnerSize / 4;
      const path = [
         new Point(radius, 0),
         new Point(CellInnerSize - radius, 0),
         new Point(CellInnerSize, radius),
         new Point(CellInnerSize, CellInnerSize - radius),
         new Point(CellInnerSize - radius, CellInnerSize),
         new Point(radius, CellInnerSize),
         new Point(0, CellInnerSize - radius),
         new Point(0, radius),
      ];
      context.fillStyle = `#485`;
      this.drawPolygon(basePoint, path, context);
   }

   drawBlue(basePoint: Point, context: CanvasRenderingContext2D) {
      const radius = CellInnerSize / 5;
      const path = [
         new Point(CellInnerSize / 2, 0),
         new Point(CellInnerSize - 10, radius),
         new Point(CellInnerSize - 10, CellInnerSize - radius),
         new Point(CellInnerSize / 2, CellInnerSize),
         new Point(10, CellInnerSize - radius),
         new Point(10, radius),
      ];
      context.fillStyle = `#35a`;
      this.drawPolygon(basePoint, path, context);
   }

   drawPurple(basePoint: Point, context: CanvasRenderingContext2D) {
      const radius = CellInnerSize / 5;
      const path = [
         new Point(CellInnerSize / 2, 0),
         new Point(CellInnerSize - 5, radius + CellInnerSize / 7),
         new Point(CellInnerSize - radius, CellInnerSize - 3),
         new Point(radius, CellInnerSize - 3),
         new Point(5, radius + CellInnerSize / 7),
      ];
      context.fillStyle = `#6e3b7a`;
      this.drawPolygon(basePoint, path, context);
   }

   drawYellow(basePoint: Point, context: CanvasRenderingContext2D) {
      const path = [
         new Point(CellInnerSize / 2, 0),
         new Point(CellInnerSize, CellInnerSize / 2),
         new Point(CellInnerSize / 2, CellInnerSize),
         new Point(0, CellInnerSize / 2),
      ];
      context.fillStyle = `#ec7`;
      this.drawPolygon(basePoint, path, context);
   }

   drawPolygon(basePoint: Point, path: Point[], context: CanvasRenderingContext2D) {
      this.fillPolygon(basePoint, path, context);
      context.lineWidth = 3;
      context.strokeStyle = '#333';
      context.stroke();
   }

   fillPolygon(basePoint: Point, path: Point[], context: CanvasRenderingContext2D) {
      context.beginPath();
      const list = this.applyBasePoint(basePoint, path);
      const first = list.shift() as Point;
      context.moveTo(first.x, first.y);
      list.forEach((point) => context.lineTo(point.x, point.y));
      context.lineTo(first.x, first.y);
      context.fill();
   }

   applyBasePoint(basePoint: Point, list: Point[]): Point[] {
      return list.map((item) => new Point(item.x + basePoint.x, item.y + basePoint.y));
   }
}
