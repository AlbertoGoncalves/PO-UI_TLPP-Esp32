import { Shipment } from "./shipment.interface";

export interface Shipments {
  items: Array<Shipment>;
  hasNext: boolean;
  remainingRecords: number;
}
