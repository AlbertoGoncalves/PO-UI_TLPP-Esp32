import { FormControl } from "@angular/forms";

export interface ShipmentForm {
  filial: FormControl<string>;
  code: FormControl<string>;
  status: FormControl<string>;
  dtini: FormControl<string>;
  dtexpe: FormControl<string>;
  dtcheg: FormControl<string>;
  destin: FormControl<string>;
}
