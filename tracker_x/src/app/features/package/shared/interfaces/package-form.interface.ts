import { FormControl } from "@angular/forms";

export interface PackageForm {
  filial: FormControl<string>;
  code: FormControl<string>;
  status: FormControl<string>;
  name: FormControl<string>;
  tipo: FormControl<string>;
  tracker: FormControl<string>;
  shipment: FormControl<string>;
  data: FormControl<string>;
}
