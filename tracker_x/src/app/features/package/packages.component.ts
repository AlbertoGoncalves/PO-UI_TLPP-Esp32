import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn, PoTagLiterals } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';
import { Packages } from './shared/interfaces/packages.interface';
import { PackagesService } from './shared/services/packages-service';
import { Package } from './shared/interfaces/package.interface';
import { NgForm } from '@angular/forms';
import { Services01Service } from './shared/services/services01.service';
import {
  PoLookupColumn,
  PoLookupFilter,
  PoDynamicFormField,
  PoTableColumnSpacing
} from '@po-ui/ng-components';
import { Tracker } from '../trackers/shared/interfaces/tracker.interface';


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  providers: [Services01Service]
})
export class PackagesComponent implements OnInit, OnDestroy {


  // Modal -----------------------------------------------------------------------//
  @ViewChild('formShare', { static: true }) formShare!: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  isSubscribed: boolean = false;

  public readonly cancelAction: PoModalAction = {
    action: () => {
      this.modalClose();
    },
    label: 'Cancel'
  };

  public readonly shareAction: PoModalAction = {
    action: () => {
      this.putLinkId();
    },
    label: 'Vincular'
  };
  activatedRoute: any;


  modalClose() {
    this.poModal.close();
    this.formShare.reset();
    this.tracker = this.trackerNew;
  }

  modalOpen(rowData: any) {
    this.oPackage = rowData;
    console.log(this.oPackage);
    this.poModal.open();
  }

  putLinkId() {
    if (this.formShare.valid) {
      console.log(this.oPackage);
      this.oPackageSubscription = this.packagesService.put(this.oPackage.code, <Package>{ tracker: this.oPackage.tracker }).subscribe({
        next: response => this.onSuccessSave(response, false),
        error: error => this.onErrorSave(error)
      });

    } else {
      this.poNotification.error(`Codigo do rastreador obrigatorio`);
    }
    this.modalClose();
  }

  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    // this.disableSubmit = false;
    this.poNotification.success(`Registro inserido com sucesso: ${response.code}`);
    // saveAndNew ? this.oPackageForm.reset() : this.router.navigate(['packages'])
  };
  onErrorSave(error: any): void {
    this.isLoading = false;
    // this.disableSubmit = false;
    this.poNotification.error('Falha ao salvar registro.');
  }

  private disableNotification() {
    this.isSubscribed = true;
  }






  oPackageSubscription: Subscription = new Subscription();
  columns1: Array<PoLookupColumn> = [];
  // customLiterals1: PoLookupLiterals = {};
  trackerNew: Tracker = {
    filial: '',
    code: '',
    name: '',
    status: '',
    id: ''
  };
  tracker: Tracker = {
    filial: '',
    code: '',
    name: '',
    status: '',
    id: ''
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

  fieldFormat: Array<string> = ['code'];
  formatField: string = 'code';
  fieldLabel: string = 'code';
  fieldValue: string = 'code';
  filterService!: PoLookupFilter | string;
  help: string = 'Digite ou pesquise o codigo do rastreador disponivel';
  label: string = 'Rastreador';
  lookup: any;
  placeholder: string = 'placeholderXXX';
  fieldErrorMessage: string = 'Erro no desenvolvimento';
  advancedFilters = { filter: "status eq '003'" };
  customAdvancedFilters: Array<PoDynamicFormField> = [];
  spacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;

  setColumns1() {
    this.columns1 = [
      { property: 'filial', label: 'Filial' },
      { property: 'code', label: 'Rastreador' },
      { property: 'name', label: 'Nome' },
      { property: 'status', label: 'Status' },
      { property: 'id', label: 'LinkID' },
    ];

    // this.columnsName.forEach(column => this.columns1.push(this.columnsDefinition[column]));
  }


  public readonly typeSpacing: Array<PoTableColumnSpacing> = [
    PoTableColumnSpacing.Medium,
    PoTableColumnSpacing.Large,
    PoTableColumnSpacing.Small
  ];

  changeEvent(typeEvent: string, event: Tracker) {
    this.oPackage.tracker = event.code;
    console.log(typeEvent)
    this.tracker = event;
    console.log(this.tracker);
    console.log(`${typeEvent}-${event}`)
  }

  restore1() {
    // this.customLiterals1 = {};
    this.fieldFormat = [];
    this.formatField = '';
    this.filterService = '';
    this.lookup = undefined;
    this.placeholder = '';
    this.fieldErrorMessage = '';
  }


  // Modal -----------------------------------------------------------------------//





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
  isLoading = false;
  packagesSubscription: Subscription = new Subscription();
  totalPackages = 10;
  textRemainingRecords: string = "";
  message: string = "";
  topic: string = "";
  hasNextPage = false;
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Pacotes' }
    ]
  };
  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormPackage.bind(this) }
  ];
  // poNotification: any;

  constructor(
    private packagesService: PackagesService,
    private poNotification: PoNotificationService,
    private router: Router,
    private mqttService: MqttService,
    public services01Service: Services01Service
  ) { }

  customLiterals: PoTagLiterals = {
    remove: 'Remover itens'
  };

  ngOnDestroy(): void {
    this.packagesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setColumns();
    this.setColumns1();
    this.getPackages(1, 10);

    this.restore1();
  }

  setColumns(): void {
    this.columns = [
      { property: 'filial', label: 'Filial', visible: true },
      { property: 'code', label: 'Pacote', type: 'link', action: (row: string) => this.goToView(row) },
      { property: 'name', label: 'Nome' },
      { property: 'tipo', label: 'Tipo', type: "columnTemplate" },
      { property: 'status', label: 'Status', type: "columnTemplate" },
      { property: 'tracker', label: 'Rastreador', type: 'link', action: (row: string) => this.goToLinkTrackerFrom(row) },
      { property: 'shipment', label: 'Carregamento' },
      {
        property: 'trackerAction', label: 'Dispositivo de Rastreio', type: 'icon', icons: [
          { value: 'view-linkid', icon: 'po-icon-eye', action: (oPackage: Package) => this.goToLinkIdForm(oPackage), tooltip: 'Verificar conexão' },
          // { value: 'add-linkid', icon: 'ph ph-map-pin-plus', action: this.modalOpen.bind(this), tooltip: 'Add Rastreador' }
          { value: 'add-linkid', icon: 'ph ph-map-pin-plus', action: (row: any) => this.modalOpen(row), tooltip: 'Add Rastreador' }
        ]
      }
    ];
  }

  goToLinkIdForm(oPackage: Package): void {
    this.topic = oPackage.code;
    this.message = "1";
    console.log(this.message)
    if (this.message.trim()) {
      console.log("entrou");
      this.mqttService.unsafePublish(this.topic, this.message, { qos: 1, retain: true });
      // this.poNotification.success(`Mensagem enviada: ${this.message}`);
      this.message = '';
    }
  }

  goToLinkTrackerFrom(tracker: string): void {
    this.router.navigate(['packages/view', tracker]);
  }

  getPackages(page: number, pageSize: number): void {
    this.isLoading = true;
    this.packagesSubscription = this.packagesService.get(page, pageSize).subscribe({
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

  goToFormPackage(): void {
    this.router.navigate(['packages/new']);
  }

  goToView(id: string): void {
    this.router.navigate(['packages/edit', id]);
  }
}
