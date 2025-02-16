import { Shipment } from './../shipments/shared/interfaces/shipment.interface';
import { Component, ViewChild, OnInit } from '@angular/core';
import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageAction } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Packages } from '../package/shared/interfaces/packages.interface';
import { Package } from '../package/shared/interfaces/package.interface';
import { PackagesService } from '../package/shared/services/packages-service';
import { Shipments } from '../shipments/shared/interfaces/shipments.interface';
import { ShipmentsService } from '../shipments/shared/service/shipments.service';

@Component({
  selector: 'app-expedition',
  templateUrl: './expedition.component.html',
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

export class ExpeditionComponent implements OnInit {
  opcEdit: string = '';
  isSubscribed: boolean = false;
  isLoading = false;
  packagesSubscription: Subscription = new Subscription();
  shipmentsSubscription: Subscription = new Subscription();

  packages: Packages = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }
  shipments: Shipments = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }
  listputshipment: Array<Package> = [];
  ptitle: string = "Expedição";
  shipment: string = "";
  modeShipment: string = "one";
  page = 1;
  pageSize = 5;
  totalItens = 10;
  totalShipments = 10;
  totalPackages = 10;

  textRemainingRecords: string = "";
  hasNextPage = false;

  constructor(
    private poNotification: PoNotificationService,
    private packagesService: PackagesService,
    private shipmentsService: ShipmentsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}


  public readonly actions: Array<PoPageAction> = [
    { label: 'Iniciar Carregamento', action: this.goToExpeditionShipment.bind(this) },
    // { label: 'Components', url: '/documentation' },
    // { label: 'Disable notification', action: this.disableNotification.bind(this), disabled: () => this.isSubscribed }
  ];

  goToExpeditionShipment(shipment: Shipment): void{
    console.log(shipment);
    this.router.navigate(['/expedition/expeditionshipment', shipment.code, this.modeShipment])
  };

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' },
      { label: 'Expedição', link: '/expedition' }]
  };

  ngOnDestroy(): void {
    this.packagesSubscription.unsubscribe();
  }



  ngOnInit(): void {
    // this.setInitVar();
    this.getShipments(1, 10);
  }

  // setInitVar(): void {
  //   console.log(this.activatedRoute.snapshot);
  //   this.shipment = this.activatedRoute.snapshot.params['shipment'];
  //   this.opcEdit = this.activatedRoute.snapshot.params['opc'];
  // }

  getShipments(page: number, pageSize: number): void {
    this.isLoading = true;
    this.shipmentsSubscription = this.shipmentsService.get(page, pageSize, `status eq '002'`).subscribe({
      next: (shipments: Shipments) => this.onSuccessShipments(shipments),
      error: (error: any) => this.onErrorShipments(error)
    });
  }

  onSuccessShipments(shipments: Shipments): void {
    if (this.shipments.items.length === 0) {
      this.shipments = shipments;
      this.shipments.items = this.shipments.items.map(shipment => ({
        ...shipment,
        status: shipment.status === "001" ? "PREPARACAO"
          : shipment.status === "002" ? "CARREGADO"
            : shipment.status === "003" ? "EXPEDIDO"
              : shipment.status === "004" ? "CONCLUIDO"
                : shipment.status = "NÃO MAPEADO",
      }));
    } else {
      this.shipments.items = this.shipments.items.concat(shipments.items);
      this.shipments.items = this.shipments.items.map(shipment => ({
        ...shipment,
      }));
    }

    this.hasNextPage = shipments.hasNext;
    this.totalShipments = this.shipments.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalShipments} de ${this.totalShipments + shipments.remainingRecords}`
    this.isLoading = false;
  }

  onErrorShipments(error: any): void {
    this.poNotification.error(error);
    this.isLoading = false;
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


  showMore(): void {
    this.page += 1;
    this.getShipments(this.page, 10);
  }

  changeAction(event: Event): void {
    // console.log(event);
    this.modeShipment = event.toString();
  }

}

