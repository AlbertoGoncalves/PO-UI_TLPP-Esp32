import { FormControl } from "@angular/forms";

export interface TrackerForm {
  filial: FormControl<string>;
  code: FormControl<string>;
  name: FormControl<string>;
  status: FormControl<string>;
  id: FormControl<string>;
}
