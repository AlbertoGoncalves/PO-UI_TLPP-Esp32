import { Component, ViewChild, OnInit } from '@angular/core';
import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageAction } from '@po-ui/ng-components';
import { PoTableColumn } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Packages } from '../../package/shared/interfaces/packages.interface';
import { Subscription } from 'rxjs';
import { PackagesService } from '../../package/shared/services/packages-service';
import { Package } from '../../package/shared/interfaces/package.interface';

@Component({
  selector: 'app-shipments-packges-add-form',
  templateUrl: './shipments-packges-add-form.component.html',
  styles: [
    `
      .sample-widget-text-subtitle {
        font-family: NunitoSans;
        font-size: 14px;
        text-align: center;
        color: #9da7a9;
      }
    `
  ],
})

export class ShipmentsPackgesAddFormComponent implements OnInit {

  columns: Array<PoTableColumn> = [];
  email: string = '';
  opcEdit: string = '';
  isSubscribed: boolean = false;
  isLoading = false;
  packagesSubscription: Subscription = new Subscription();

  packages: Packages = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }
  listputshipment: Array<Package> = [];
  ptitle: string = "Itens Carregamento";
  shipment: string = "";
  page = 1;
  pageSize = 10;
  totalItens = 0;

  totalPackages = 10;
  textRemainingRecords: string = "";
  hasNextPage = false;

  constructor(
    private poNotification: PoNotificationService,
    private packagesService: PackagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  public readonly actions: Array<PoPageAction> = [
    { label: 'Salvar', action: this.saveputpackages.bind(this) },
    { label: 'Cancelar', action: this.cancel.bind(this), icon: 'ph ph-share' },
    // { label: 'Components', url: '/documentation' },
    // { label: 'Disable notification', action: this.disableNotification.bind(this), disabled: () => this.isSubscribed }
  ];

  cancel(): void {
    this.router.navigate(['shipments']);
  }

  saveputpackages(): void{
    var shipment = this.shipment;
    var status = '';
    this.isLoading = true;
    // console.log(this.listputshipment);

    if (this.opcEdit == 'alter') {
      shipment = ''
      status = '001'
    }else{
      status = '002'
    }

    const simplifiedArray = this.listputshipment.map(item => ({
      filial: item.filial,
      code: item.code,
      status: status,
      // name: item.name,
      // tipo: item.tipo,
      // tracker: item.tracker,
      shipment: shipment
    }));
    console.log(simplifiedArray);
    this.packagesSubscription = this.packagesService.putInTracker(simplifiedArray).subscribe({
      next: response => this.onSuccessSave(response, false),
      error: error => this.onErrorSave(error)
    });

  };

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' },
      { label: 'Carregamento', link: '/shipments' },
      { label: 'Itens Carregamento' }]
  };

  alterPtitle(){
    if (this.opcEdit == 'alter') {
      this.ptitle = `Remover itens Carregamento: ${this.shipment}`;
    }else{
      this.ptitle = `Incluir itens Carregamento: ${this.shipment}`;
    }
  }

  ngOnDestroy(): void {
    this.packagesSubscription.unsubscribe();
  }



  ngOnInit(): void {
    this.setInitVar();
    this.setColumns();
    this.alterPtitle();
    this.getPackages(1, 10);
  }

  setInitVar(): void {
    console.log(this.activatedRoute.snapshot);
    this.shipment = this.activatedRoute.snapshot.params['shipment'];
    this.opcEdit = this.activatedRoute.snapshot.params['opc'];
  }

  setColumns(): void {
    this.columns = [
      { property: 'filial', label: 'Filial', visible: false },
      { property: 'code', label: 'Pacote'},
      { property: 'name', label: 'Nome' },
      { property: 'tipo', label: 'Tipo', type: "columnTemplate"},
      { property: 'status', label: 'Status', type: "columnTemplate"},
      { property: 'tracker', label: 'Rastreador'},
      { property: 'shipment', label: 'Carregamento'}
    ];
  }

  getPackages(page: number, pageSize: number): void {
    this.isLoading = true;
    if (this.opcEdit  == 'alter') {
      this.packagesSubscription = this.packagesService.get(page, pageSize, `shipment eq '${this.shipment}'`).subscribe({
        next: (packages: Packages) => this.onSuccessPackages(packages),
        error: (error: any) => this.onErrorPackages(error)
      });
    }else{
      this.packagesSubscription = this.packagesService.get(page, pageSize, `shipment ne '${this.shipment}' and status eq '001' `).subscribe({
        next: (packages: Packages) => this.onSuccessPackages(packages),
        error: (error: any) => this.onErrorPackages(error)
      });
    }

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
      }));
    } else {
      this.packages.items = this.packages.items.concat(packages.items);
      this.packages.items = this.packages.items.map(oPackage => ({
        ...oPackage
      }));
    }

    this.hasNextPage = packages.hasNext;
    this.totalPackages = this.packages.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalPackages} de ${this.totalPackages+packages.remainingRecords}`
    this.isLoading = false;
  }


  changeEvent(event: string, row: Package) {
    switch (event) {
      case 'p-selected':
        this.totalItens++;
         this.listputshipment.push(row);
        break;
      case 'p-unselected':
        this.totalItens--;
        const indice = this.listputshipment.findIndex(obj => obj.code === row.code);
        this.listputshipment.splice(indice, 1); // Remove o objeto encontrado
        break;
      case 'p-all-selected':
        this.totalItens = this.packages.items.length;
        break;
      case 'p-all-unselected':
        this.totalItens = 0;
        this.listputshipment = [];
        break;
      default:
        break;
    }

    console.log(event);
    console.log(row);
    console.log(this.listputshipment);
  }


  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    this.poNotification.success(`Registro inserido com sucesso: ${response.code}`);
    this.router.navigate(['shipments']);
  };


  onErrorSave(error: any): void {
    this.isLoading = false;
    this.poNotification.error('Falha ao salvar registro.');
  }


  onErrorPackages(error: any): void {
    this.poNotification.error(error);
    this.isLoading = false;
  }


  showMore(): void {
    this.page += 1;
    this.getPackages(this.page, 10);
  }


  private disableNotification() {
    this.isSubscribed = true;
  }
}
