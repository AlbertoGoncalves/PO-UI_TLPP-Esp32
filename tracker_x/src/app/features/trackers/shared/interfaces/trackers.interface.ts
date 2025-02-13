import { Tracker } from "./tracker.interface";

export interface Trackers {
  items: Array<Tracker>;
  hasNext: boolean;
  remainingRecords: number;
}
