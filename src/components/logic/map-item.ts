import { Gem } from '../enums/gem';
import Point from './point';

export default class MapItem extends Point {
   value: Gem = Gem.Clear;
   fallFrom = 0;

   setRandomValue(): void {
      const gems = this.allGems();
      const randomValue = Math.floor(Math.random() * gems.length);
      this.value = gems[randomValue];
   }

   allGems(): Gem[] {
      return Object.keys(Gem)
         .map((x) => +x)
         .filter((item) => !isNaN(item) && item !== Gem.Clear)
         .map((x) => x as Gem);
   }

   clone(): MapItem {
      const newItem = new MapItem(this.x, this.y);
      newItem.value = this.value;
      return newItem;
   }
}
