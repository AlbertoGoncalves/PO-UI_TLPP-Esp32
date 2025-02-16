import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoCheckboxGroupOption, PoDialogService, PoPageAction, PoTableColumn} from '@po-ui/ng-components';
import { PoNotificationService, PoPageEditLiterals, PoRadioGroupOption } from '@po-ui/ng-components';
import { PoTagModule, PoCalendarMode } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { Shipment } from '../shared/interfaces/shipment.interface';
import { ShipmentForm } from '../shared/interfaces/shipment-form.interface';
import { ShipmentsService } from '../shared/service/shipments.service';
import { Packages } from '../../package/shared/interfaces/packages.interface';
import { PackagesService } from '../../package/shared/services/packages-service';

@Component({
  selector: 'app-shipments-form',
  templateUrl: './shipments-form.component.html'
})
export class ShipmentsFormComponent  implements OnInit, OnDestroy {
  shipmentForm!: FormGroup;
  shipmentSubscription: Subscription = new Subscription();
  isLoading = false;
  disableSubmit = false;
  operation = 'post';
  title: string = "";
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Carregamento', link: '/shipments' },
      { label: 'Novo registro' }
    ]
  };
  customLiterals: PoPageEditLiterals = {
    saveNew: 'Salvar e Novo'
  };

  shipment: Shipment = {
    filial: '',
    code: '',
    status: '001',
    dtini: '',
    dtexpe: '',
    dtcheg: '',
    destin: ''
  };

  help: string = "Status do Carregamento";
  option!: PoRadioGroupOption;
  options: Array<PoRadioGroupOption> = [];
  properties: Array<string> = [];
  radioGroup: string = "radioGroup";
  size: string = 'Medium';

  calendar: any;
  locale: string = 'pt';
  maxDate!: string | Date;
  minDate!: string | Date;
  // minDate!: string | Date;
  mode = PoCalendarMode.Range;

  packages: Packages = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  targetTipo = 'tipo';
  targetStatus = 'status';
  targetAddlinkid = 'add-linkid';
  columns: Array<PoTableColumn> = [];
  page = 1;
  pageSize = 10;
  packagesSubscription: Subscription = new Subscription();
  totalPackages = 10;
  textRemainingRecords: string = "";
  hasNextPage = false;

  // Itens do po-radio-group
  public readonly radioOptions: Array<PoRadioGroupOption> = [
    { label: 'PREPARACAO', value: "001" },
    { label: 'CARREGADO', value: "002" },
    { label: 'EXPEDIDO', value: "003" },
    { label: 'CONCLUIDO', value: "004" }
  ];

  // <!-- <po-page-edit [p-title]="title" (p-cancel)="cancel()" (p-save)="save(false)" (p-save-new)=""
  // [p-disable-submit]="disableSubmit" [p-literals]="customLiterals" [p-breadcrumb]="breadcrumb"> -->

  constructor(
    private shipmentsService: ShipmentsService,
    private poNotification: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService,
    private packagesService: PackagesService,
  ) { }

  ngOnInit(): void {
    this.restore();
    this.setOperation();
    this.setTitle();
    this.operation === 'post' ? this.createForm(this.shipment) : this.getShipment();
    this.setColumns();
    // this.getPackages(1, 10);
  }

  public actions: Array<PoPageAction> = [
    { label: 'Salvar', action: this.save.bind(this, false) },
    { label: 'Salvar e Novo', action: this.saveOrDelete.bind(this), icon: 'ph ph-share' },
    { label: 'Cancelar', action: this.cancel.bind(this), icon: 'ph ph-share' }
  ];

  editItems(): void {
    this.router.navigate(['shipments/add_packges', this.shipment.code ,'alter' ] );
  }


  ngOnDestroy(): void {
    this.shipmentSubscription.unsubscribe();
  }

  setTitle(): void {
    if (this.operation === 'post') {
      this.title = 'Novo registro';
    } else {
      this.title = 'Alterar registro';
      this.actions = [
        { label: 'Salvar', action: this.save.bind(this, false) },
        { label: 'Remover Itens', action: this.editItems.bind(this) },
        { label: 'Excluir', action: this.saveOrDelete.bind(this)},
        { label: 'Cancelar', action: this.cancel.bind(this), icon: 'ph ph-share' },

      ];
    }
  }

  setOperation(): void {
    // console.log(this.activatedRoute.snapshot.params['id']);
    this.operation = this.activatedRoute.snapshot.params['id'] ? 'put' : 'post';
  }

  setColumns(): void {
    this.columns = [
      { property: 'filial', label: 'Filial', visible: true },
      { property: 'code', label: 'Pacote', type: 'link'},
      // { property: 'code', label: 'Pacote', type: 'link', action: (row: string) => this.goToView(row) },
      { property: 'name', label: 'Nome' },
      { property: 'tipo', label: 'Tipo', type: "columnTemplate" },
      { property: 'status', label: 'Status', type: "columnTemplate" },
      { property: 'tracker', label: 'Rastreador', type: 'link'},
      // { property: 'tracker', label: 'Rastreador', type: 'link', action: (row: string) => this.goToLinkTrackerFrom(row) },
      { property: 'shipment', label: 'Carregamento' },
      // {
      //   property: 'trackerAction', label: 'Dispositivo de Rastreio', type: 'icon', icons: [
      //     { value: 'view-linkid', icon: 'po-icon-eye', action: (oPackage: Package) => this.goToLinkIdForm(oPackage), tooltip: 'Verificar conexão' },
      //     // { value: 'add-linkid', icon: 'ph ph-map-pin-plus', action: this.modalOpen.bind(this), tooltip: 'Add Rastreador' }
      //     { value: 'add-linkid', icon: 'ph ph-map-pin-plus', action: (row: any) => this.modalOpen(row), tooltip: 'Add Rastreador' }
      //   ]
      // }
    ];
  }

  getPackages(page: number, pageSize: number): void {
    this.isLoading = true;
    console.log(this.shipment);
    this.packagesSubscription = this.packagesService.get(page, pageSize, `shipment eq '${this.shipment.code}'`).subscribe({
      next: (packages: Packages) => this.onSuccessPackages(packages),
      error: (error: any) => this.onErrorPackages(error)
    });
  }

  onSuccessPackages(packages: Packages): void {
    if (this.packages.items.length === 0) {
      this.packages = packages;
      this.packages.items = this.packages.items.map(oPackage => ({
        ...oPackage,
        tipo: oPackage.tipo === "1" ? 'NORMAL'
          : oPackage.tipo === "2" ? 'FRAGIL'
            : oPackage.tipo === "3" ? 'PEREGOSA'
              : oPackage.tipo === "4" ? 'ALTO VALOR'
                : oPackage.tipo = "NÃO MAPEADO",
        status: oPackage.status === "001" ? 'PREPARACAO'
          : oPackage.status === "002" ? 'CARREGADO'
            : oPackage.status === "003" ? 'EXPEDIDO'
              : oPackage.status === "004" ? 'CONCLUIDO'
                : oPackage.status = "NÃO MAPEADO",
        trackerAction: ['view-linkid', 'add-linkid']
      }));
    } else {
      this.packages.items = this.packages.items.concat(packages.items);
      this.packages.items = this.packages.items.map(oPackage => ({
        ...oPackage,
        linkid: ['view-linkid', 'add-linkid']
      }));
    }

    this.hasNextPage = packages.hasNext;
    this.totalPackages = this.packages.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalPackages} de ${this.totalPackages + packages.remainingRecords}`
    this.isLoading = false;
  }

  onErrorPackages(error: any): void {
    this.poNotification.error(error);
    this.isLoading = false;
  }

  showMore(): void {
    this.page += 1;
    this.getPackages(this.page, 10);
  }

  changeEventDtIni(event: string) {
    // this.minDate = event;
    this.shipmentForm.value.dtini = event;
    console.log(this.shipmentForm.value)
  }

  changeEventDtCheg(event: string) {
    // this.maxDate = event;
    this.shipmentForm.value.dtcheg = event;
    console.log(this.shipmentForm.value)
  }

  restore() {
    // this.calendar = undefined;
    this.maxDate = "";
    this.minDate = "";
  }

  changeEvent(event: string) {
    console.log(event)
    this.shipmentForm.value.tipo = event;

    console.log(this.shipmentForm.value)
  }



  cancel(): void {
    this.router.navigate(['shipments']);
  }

  createForm(shipment: Shipment): void {
    this.shipmentForm = new FormGroup<ShipmentForm>({
      filial: new FormControl(shipment.filial, { nonNullable: true }),
      code: new FormControl(shipment.code, { nonNullable: true }),
      // status: new FormControl(this.formatStatus(shipment.status, "IN"), { nonNullable: true }),
      status: new FormControl(shipment.status, { nonNullable: true }),
      dtini: new FormControl(shipment.dtini, { nonNullable: true }),
      dtexpe: new FormControl(shipment.dtexpe, { nonNullable: true }),
      dtcheg: new FormControl(shipment.dtcheg, { nonNullable: true }),
      destin: new FormControl(shipment.destin, { nonNullable: true }),
    });
  }

  getShipment(): void {
    this.isLoading = true;
    this.shipmentsService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (shipment: Shipment) => {
        this.onSuccessGet(shipment);
        this.setColumns();
        this.getPackages(1, 10);
      },
      error: (error: any) => this.onErrorGet(error)
    });
  }

  onErrorGet(error: any): void {
    this.isLoading = false;
    this.poNotification.error('Falha ao retornar registro.');
  }

  onSuccessGet(shipment: Shipment): void {
    this.isLoading = false;
    this.shipment = shipment;
    console.log(shipment);
    this.createForm(shipment);
  }

  save(saveAndNew: boolean): void {
    if (this.shipmentForm.invalid) return;

    this.isLoading = true;
    this.disableSubmit = true;
    this.operation === 'post' ? this.post(saveAndNew) : this.put(saveAndNew);
  }

  post(saveAndNew: boolean): void {
    this.shipmentSubscription = this.shipmentsService.post(this.shipmentForm.value).subscribe({
      next: response => this.onSuccessSave(response, saveAndNew),
      error: error => this.onErrorSave(error)
    });
  }

  put(saveAndNew: boolean): void {
    console.log(this.shipmentForm.value);
    this.shipmentSubscription = this.shipmentsService.put(this.activatedRoute.snapshot.params['id'], this.shipmentForm.value).subscribe({
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
    this.shipmentSubscription = this.shipmentsService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: () => this.onSuccessDelete(),
      error: () => this.onErrorDelete()
    });
  }

  onSuccessDelete(): void {
    this.router.navigate(['shipments']);
    this.poNotification.success('Registro excluído com sucesso.');
  }

  onErrorDelete(): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotification.error('Falha ao excluir registro.');
  }

  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotification.success(`Registro inserido com sucesso: ${response.code}`);
    saveAndNew ? this.shipmentForm.reset() : this.router.navigate(['shipments'])
  };
  onErrorSave(error: any): void {
    this.isLoading = false;
    this.disableSubmit = false;
    this.poNotification.error('Falha ao salvar registro.');
  }

}
