import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoCheckboxGroupOption, PoDialogService, PoNotificationService, PoPageEditLiterals, PoRadioGroupOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { PoTagModule } from '@po-ui/ng-components';
import { Tracker } from '../../trackers/shared/interfaces/tracker.interface';
import { TrackersService } from '../../trackers/shared/services/trackers.service';
import { TrackerForm } from '../../trackers/shared/interfaces/tracker-form.interface';

@Component({
  selector: 'app-trackers-from-view',
  templateUrl: './trackers-from-view.component.html'
})
export class TrackersFromViewComponent implements OnInit, OnDestroy {
  trackerForm!: FormGroup;
  trackerSubscription: Subscription = new Subscription();
  isLoading = false;
  disableSubmit = false;
  operation = 'post';
  title: string = "";
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Pacotes', link: '/packages' },
      { label: 'Novo registro' }
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

  targetProperty = 'status';
  event: string = "";
  help: string = "Status do Rastreador";
  option!: PoRadioGroupOption;
  options: Array<PoRadioGroupOption> = [];
  properties: Array<string> = [];
  radioGroup: string = "radioGroup" ;
  size: string = 'Medium';

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
    this.router.navigate(['packages']);
  }

  createForm(tracker: Tracker): void {
    this.trackerForm = new FormGroup<TrackerForm>({
      filial: new FormControl(tracker.filial, { nonNullable: true }),
      code: new FormControl(tracker.code, { nonNullable: true }),
      name: new FormControl(tracker.name, { nonNullable: true, validators: [Validators.required] }),
      status: new FormControl(tracker.status, { nonNullable: true }),
      id: new FormControl(tracker.id, { nonNullable: true })
    });
  }

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
}
