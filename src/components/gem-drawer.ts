import { CellInnerSize, CellPadding } from './constants';
import Point from './logic/point';

export default class GemDrawer {
   drawRed(basePoint: Point, context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = `#a25b5b`;
      context.moveTo(basePoint.x + 4, basePoint.y + 5);
      context.lineTo(basePoint.x + CellInnerSize - 4, basePoint.y + 5);
      context.lineTo(basePoint.x + CellInnerSize / 2, basePoint.y + CellInnerSize);
      context.fill();
   }

   drawGreen(basePoint: Point, context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = `#3c8347`;
      const radius = CellInnerSize / 4;
      context.moveTo(basePoint.x + radius, basePoint.y);
      context.lineTo(basePoint.x + CellInnerSize - radius, basePoint.y);
      context.lineTo(basePoint.x + CellInnerSize, basePoint.y + radius);
      context.lineTo(basePoint.x + CellInnerSize, basePoint.y + CellInnerSize - radius);
      context.lineTo(basePoint.x + CellInnerSize - radius, basePoint.y + CellInnerSize);
      context.lineTo(basePoint.x + radius, basePoint.y + CellInnerSize);
      context.lineTo(basePoint.x, basePoint.y + CellInnerSize - radius);
      context.lineTo(basePoint.x, basePoint.y + radius);
      context.fill();
   }

   drawBlue(basePoint: Point, context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = `#355a9a`;
      const radius = CellInnerSize / 5;
      context.moveTo(basePoint.x + CellInnerSize / 2, basePoint.y);
      context.lineTo(basePoint.x + CellInnerSize - 10, basePoint.y + radius);
      context.lineTo(basePoint.x + CellInnerSize - 10, basePoint.y + CellInnerSize - radius);
      context.lineTo(basePoint.x + CellInnerSize / 2, basePoint.y + CellInnerSize);
      context.lineTo(basePoint.x + 10, basePoint.y + CellInnerSize - radius);
      context.lineTo(basePoint.x + 10, basePoint.y + radius);
      context.fill();
   }

   drawPurple(basePoint: Point, context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = `#6e3b7a`;
      const radius = CellInnerSize / 5;
      context.moveTo(basePoint.x + CellInnerSize / 2, basePoint.y);
      context.lineTo(basePoint.x + CellInnerSize - 5, basePoint.y + radius + CellInnerSize / 7);
      context.lineTo(basePoint.x + CellInnerSize - radius, basePoint.y + CellInnerSize - 3);
      context.lineTo(basePoint.x + radius, basePoint.y + CellInnerSize - 3);
      context.lineTo(basePoint.x + 5, basePoint.y + radius + CellInnerSize / 7);
      context.fill();
   }

   drawYellow(basePoint: Point, context: CanvasRenderingContext2D) {
      context.beginPath();
      context.fillStyle = `#e8cb8e`;
      context.moveTo(basePoint.x + CellInnerSize / 2, basePoint.y);
      context.lineTo(basePoint.x + CellInnerSize, basePoint.y + CellInnerSize / 2);
      context.lineTo(basePoint.x + CellInnerSize / 2, basePoint.y + CellInnerSize);
      context.lineTo(basePoint.x, basePoint.y + CellInnerSize / 2);
      context.fill();
   }
}
