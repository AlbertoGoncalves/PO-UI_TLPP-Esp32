import { Package } from "./package.interface";

export interface Packages {
  items: Array<Package>;
  hasNext: boolean;
  remainingRecords: number;
}
