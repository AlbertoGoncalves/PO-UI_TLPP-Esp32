import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoCheckboxGroupOption, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoPageEditLiterals, PoRadioGroupOption } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { PoTagModule } from '@po-ui/ng-components';
import { Package } from '../shared/interfaces/package.interface';
import { PackagesService } from '../shared/services/packages-service';
import { PackageForm } from '../shared/interfaces/package-form.interface';

@Component({
  selector: 'app-package-form',
  templateUrl: './packages-form.component.html'
})
export class PackagesFormComponent implements OnInit, OnDestroy {
  @ViewChild('formShare', { static: true }) formShare!: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  email: string = '';
  isSubscribed: boolean = false;

  public readonly cancelAction: PoModalAction = {
    action: () => {
      this.modalClose();
    },
    label: 'Cancel'
  };

  public readonly shareAction: PoModalAction = {
    action: () => {
      this.share();
    },
    label: 'Share'
  };


  modalClose() {
    this.poModal.close();
    this.formShare.reset();
  }

  modalOpen() {
    this.poModal.open();
  }

  share() {
    if (this.formShare.valid) {
      this.poNotification.success(`Webpage shared successfully to: ${this.email}.`);
    } else {
      this.poNotification.error(`Email invalid.`);
    }
    this.modalClose();
  }

  private disableNotification() {
    this.isSubscribed = true;
  }

  oPackageForm!: FormGroup;
  oPackageSubscription: Subscription = new Subscription();
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
  oPackage: Package = {
    filial: '',
    code: '',
    status: '',
    name: '',
    tipo: '',
    tracker: '',
    shipment: '',
    data: ''

  };

  // helpStatus: string = "Tipo da Carga";
  helpTipo: string = "Tipo da Carga";
  option!: PoRadioGroupOption;
  options: Array<PoRadioGroupOption> = [];
  properties: Array<string> = [];
  radioGroup: string = "radioGroup";
  size: string = 'Medium';

  // Itens do po-radio-group
  public readonly radioOptions: Array<PoRadioGroupOption> = [
    { label: 'NORMAL', value: "1" },
    { label: 'FRAGIL', value: "2" },
    { label: 'PEREGOSA', value: "3" },
    { label: 'ALTO VALOR', value: "4" }
  ];

  changeEvent(event: string) {
    this.oPackageForm.value.tipo = event;

    console.log(this.oPackageForm.value)
  }

  constructor(
    private packagesService: PackagesService,
    private poNotificationService: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService,
    private poNotification: PoNotificationService,
  ) { }

  ngOnInit(): void {
    this.setOperation();
    this.setTitle();
    this.operation === 'post' ? this.createForm(this.oPackage) : this.getPackage();
  }

  ngOnDestroy(): void {
    this.oPackageSubscription.unsubscribe();
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

  createForm(oPackage: Package): void {
    this.oPackageForm = new FormGroup<PackageForm>({
      filial: new FormControl(oPackage.filial, { nonNullable: true }),
      code: new FormControl(oPackage.code, { nonNullable: true }),
      name: new FormControl(oPackage.name, { nonNullable: true, validators: [Validators.required] }),
      // tipo: new FormControl(this.formatTipo(oPackage.tipo, "IN"), { nonNullable: true }),
      status: new FormControl(oPackage.status, { nonNullable: true }),
      tipo: new FormControl(oPackage.tipo, { nonNullable: true }),
      tracker: new FormControl(oPackage.tracker, { nonNullable: true }),
      shipment: new FormControl(oPackage.tracker, { nonNullable: true }),
      data: new FormControl(oPackage.data, { nonNullable: true })
    });
  }

  getPackage(): void {
    this.isLoading = true;
    this.packagesService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (oPackage: Package) => this.onSuccessGet(oPackage),
      error: (error: any) => this.onErrorGet(error)
    });
  }

  onErrorGet(error: any): void {
    this.isLoading = false;
    this.poNotificationService.error('Falha ao retornar registro.');
  }

  onSuccessGet(oPackage: Package): void {
    this.isLoading = false;
    this.oPackage = oPackage;
    this.createForm(oPackage);
  }

  save(saveAndNew: boolean): void {
    if (this.oPackageForm.invalid) return;

    this.isLoading = true;
    this.disableSubmit = true;
    this.operation === 'post' ? this.post(saveAndNew) : this.put(saveAndNew);
  }

  post(saveAndNew: boolean): void {
    this.oPackageSubscription = this.packagesService.post(this.oPackageForm.value).subscribe({
      next: response => this.onSuccessSave(response, saveAndNew),
      error: error => this.onErrorSave(error)
    });
  }

  put(saveAndNew: boolean): void {
    console.log(this.oPackageForm.value);
    this.oPackageSubscription = this.packagesService.put(this.activatedRoute.snapshot.params['id'], this.oPackageForm.value).subscribe({
      next: response => this.onSuccessSave(response, saveAndNew),
      error: error => this.onErrorSave(error)
    });
  }

  saveOrDelete(): void {
    this.operation === 'post' ? this.save(true) : this.confirmDelete();
  }

  confirmDelete(): void {
    this.poDialogService.confirm({
      title: 'Excluir Pacote',
      message: 'Tem certeza que deseja excluir?',
      confirm: this.delete.bind(this)
    });
  }

  delete(): void {
    this.isLoading = true;
    this.disableSubmit = true;
    this.oPackageSubscription = this.packagesService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: () => this.onSuccessDelete(),
      error: () => this.onErrorDelete()
    });
  }

  onSuccessDelete(): void {
    this.router.navigate(['packages']);
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
    saveAndNew ? this.oPackageForm.reset() : this.router.navigate(['packages'])
  };
  onErrorSave(error: any): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotificationService.error('Falha ao salvar registro.');
  }
}
