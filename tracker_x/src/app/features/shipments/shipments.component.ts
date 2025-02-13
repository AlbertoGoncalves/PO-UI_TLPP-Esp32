import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoNotificationService, PoPageAction, PoTableColumn, PoTagLiterals } from '@po-ui/ng-components';
import { delay, Subscription } from 'rxjs';
import { Shipment } from './shared/interfaces/shipment.interface';
import { Shipments } from './shared/interfaces/shipments.interface';
import { ShipmentsService } from './shared/service/shipments.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipments.component.html'
})
export class ShipmentsComponent implements OnInit, OnDestroy {

  targetProperty = 'status';
  columns: Array<PoTableColumn> = [];
  now: Date = new Date;
  page = 1;
  pageSize = 10;
  isLoading = false;
  shipmentsSubscription: Subscription = new Subscription();
  shipmentPutSubscription: Subscription = new Subscription();
  totalShipments = 10;
  textRemainingRecords: string = "";
  hasNextPage = false;

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Carregamentos' }
    ]
  };

  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormShipment.bind(this) }
  ];

  shipments: Shipments = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  constructor(
    private shipmentsService: ShipmentsService,
    private poNotification: PoNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  customLiterals: PoTagLiterals = {
    remove: 'Remover itens'
  };

  ngOnDestroy(): void {
    this.shipmentsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setColumns();
    this.getShipments(1, 10);

  }

  setColumns(): void {
    this.columns = [
      { property: 'filial', label: 'Filial', visible: true },
      { property: 'code', label: 'Carregamento', type: 'link', action: (row: string) => this.goToView(row) },
      { property: 'status', label: 'Status', type: "columnTemplate" },
      { property: 'destin', label: 'Destino', type: "string" },
      { property: 'dtini', label: 'Dt. Inicial', type: "date" },
      { property: 'dtexpe', label: 'Dt. Expedição', type: "date" },
      { property: 'dtcheg', label: 'Dt. Chegada', type: "date" },
      {
        property: 'linkid', label: 'Itens Carregamento', type: 'icon', icons: [
          { value: 'view-linkid', icon: 'po-icon-pallet-partial', action: (shipment: Shipment) => this.goToAddPackgesForm(shipment), tooltip: 'Incluir itens carregamento' },
          { value: 'view-linkid1', icon: 'ph ph-truck-trailer', action: (shipment: Shipment) => this.goToExpedPackges(shipment), tooltip: 'Enviar ordem de carregamento' },
        ]
      }
    ];
  }

  goToExpedPackges(shipment: Shipment): void {
    console.log(shipment);
    shipment.status = '002';
    this.isLoading = true;
    delay(100);
    this.shipmentPutSubscription = this.shipmentsService.put(shipment.code, shipment).subscribe({
      next: response => this.onSuccessSave(response, false),
      error: error => this.onErrorSave(error)
    });
  }


  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    // this.disableSubmit = false;
    this.poNotification.success(`Registro inserido com sucesso: ${response.code}`);
    this.router.navigate(['/expedition'])
  };
  onErrorSave(error: any): void {
    this.isLoading = false;
    // this.disableSubmit = false;
    this.poNotification.error('Falha ao salvar registro.');
  }


  goToAddPackgesForm(shipment: Shipment): void {
    this.router.navigate(['shipments/add_packges', shipment.code, 'add']);
  }

  getShipments(page: number, pageSize: number): void {
    this.isLoading = true;
    this.shipmentsSubscription = this.shipmentsService.get(page, pageSize).subscribe({
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
          : shipment.status === "002" ? "LIBERADO"
            : shipment.status === "003" ? "EXPEDIDO"
              : shipment.status === "004" ? "CONCLUIDO"
                : shipment.status = "NÃO MAPEADO",
        linkid: ['view-linkid', 'view-linkid1']
      }));
    } else {
      this.shipments.items = this.shipments.items.concat(shipments.items);
      this.shipments.items = this.shipments.items.map(shipment => ({
        ...shipment,
        linkid: ['view-linkid', 'view-linkid1']
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

  showMore(): void {
    this.page += 1;
    this.getShipments(this.page, 10);
  }

  goToFormShipment(): void {
    this.router.navigate(['shipments/new']);
  }

  goToView(id: string): void {
    this.router.navigate(['shipments/edit', id]);
  }
}
