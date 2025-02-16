import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoPageEditLiterals, PoRadioGroupOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { Tracker } from '../shared/interfaces/tracker.interface';
import { TrackersService } from '../shared/services/trackers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackerForm } from '../shared/interfaces/tracker-form.interface';

@Component({
  selector: 'app-tracker-device-form',
  templateUrl: './tracker-device-form.component.html',
})
export class TrackerDeviceFormComponent {
  trackerForm!: FormGroup;
  trackerSubscription: Subscription = new Subscription();
  isLoading = false;
  disableSubmit = false;
  operation = 'post';
  title: string = "";
  targetProperty = 'status';
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Rastreadores', link: '/trackers' },
      { label: 'Vinculação de dispositivo ou rastreador' }
    ]
  };
  customLiterals: PoPageEditLiterals = {
    saveNew: 'Salvar e Novo'
  };
  tracker: Tracker = {
    filial: '',
    code: '',
    name: '',
    status: '',
    id: ''
  };

  event: string = "";
  help: string = "Status";
  option!: PoRadioGroupOption;
  options: Array<PoRadioGroupOption> = [];
  properties: Array<string> = [];
  radioGroup: string = "radioGroup" ;
  size: string = "1";

  // Itens do po-radio-group
public readonly radioOptions: Array<PoRadioGroupOption> = [
  { label: 'DISPONIVEL', value: "002" },
  { label: 'EM MANUTENÇÃO', value: "003" }
];

changeEvent(event: string) {
  this.event = event;
  this.trackerForm.value.status = event;

  console.log(this.trackerForm.value)
}

  constructor(
    private trackersService: TrackersService,
    private poNotificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService
  ) { }

  ngOnInit(): void {
    this.setOperation();
    this.setTitle();
    this.operation === 'post' ? this.createForm(this.tracker) : this.getTracker();
  }

  ngOnDestroy(): void {
    this.trackerSubscription.unsubscribe();
  }

  setTitle(): void {
    if (this.operation === 'post') {
      this.title = 'Novo registro';
    } else {
      this.title = 'Alterar registro';
      this.customLiterals.saveNew = 'Excluir';
    }
    this.breadcrumb.items[2].label = this.title;
  }

  setOperation(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.operation = this.activatedRoute.snapshot.params['id'] ? 'put' : 'post';
  }

  cancel(): void {
    this.router.navigate(['trackers']);
  }

  createForm(tracker: Tracker): void {
    this.trackerForm = new FormGroup<TrackerForm>({
      filial: new FormControl(tracker.filial, { nonNullable: true }),
      code: new FormControl(tracker.code, { nonNullable: true }),
      name: new FormControl(tracker.name, { nonNullable: true, validators: [Validators.required] }),
      // status: new FormControl(this.formatStatus(tracker.status,"IN"), { nonNullable: true }),
      status: new FormControl(tracker.status, { nonNullable: true }),
      id: new FormControl(tracker.id, { nonNullable: true })
    });
  }

  // formatStatus(o: string, opc: String): string {
  //   if (opc === "IN") {
  //   switch (o) {
  //     case '001': return 'ALOCADO';
  //     case '002': return 'DISPONIVEL';
  //     case '003': return 'EM MANUTENÇÃO';
  //     case '004': return 'DESCONTINUADO';
  //     default: return 'NÃO MAPEADO';
  //   };
  //   }else{
  //     switch (o) {
  //       case 'ALOCADO': return '001';
  //       case 'DISPONIVEL': return '002';
  //       case 'EM MANUTENÇÃO': return '003';
  //       case 'DESCONTINUADO': return '004';
  //       default: return 'NÃO MAPEADO';
  //     };
  //   }
  //   return ""
  // }

  getTracker(): void {
    this.isLoading = true;
    this.trackersService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (tracker: Tracker) => this.onSuccessGet(tracker),
      error: (error: any) => this.onErrorGet(error)
    });
  }

  onErrorGet(error: any): void {
    this.isLoading = false;
    this.poNotificationService.error('Falha ao retornar registro.');
  }

  onSuccessGet(tracker: Tracker): void {
    this.isLoading = false;
    this.tracker = tracker;
    this.createForm(tracker);
  }

  save(saveAndNew: boolean): void {
    if (this.trackerForm.invalid) return;

    this.isLoading = true;
    this.disableSubmit = true;
    this.operation === 'post' ? this.post(saveAndNew) : this.put(saveAndNew);
  }

  post(saveAndNew: boolean): void {
    this.trackerSubscription = this.trackersService.post(this.trackerForm.value).subscribe({
      next: response => this.onSuccessSave(response, saveAndNew),
      error: error => this.onErrorSave(error)
    });
  }

  put(saveAndNew: boolean): void {
    console.log(this.trackerForm.value);
    this.trackerSubscription = this.trackersService.put(this.activatedRoute.snapshot.params['id'], this.trackerForm.value).subscribe({
      next: response => this.onSuccessSave(response, saveAndNew),
      error: error => this.onErrorSave(error)
    });
  }

  saveOrDelete(): void {
    this.operation === 'post' ? this.save(true) : this.confirmDelete();
  }

  confirmDelete(): void {
    this.poDialogService.confirm({
      title: 'Excluir tutor',
      message: 'Tem certeza que deseja excluir?',
      confirm: this.delete.bind(this)
    });
  }

  delete(): void {
    this.isLoading = true;
    this.disableSubmit = true;
    this.trackerSubscription = this.trackersService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: () => this.onSuccessDelete(),
      error: () => this.onErrorDelete()
    });
  }

  onSuccessDelete(): void {
    this.router.navigate(['trackers']);
    this.poNotificationService.success('Registro excluído com sucesso.');
  }

  onErrorDelete(): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotificationService.error('Falha ao excluir registro.');
  }

  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotificationService.success(`Registro inserido com sucesso: ${response.code}`);
    saveAndNew ? this.trackerForm.reset() : this.router.navigate(['trackers'])
  };
  onErrorSave(error: any): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotificationService.error('Falha ao salvar registro.');
  }
}
