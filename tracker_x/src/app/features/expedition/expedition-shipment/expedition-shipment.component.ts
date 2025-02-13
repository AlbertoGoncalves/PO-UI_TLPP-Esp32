import { Shipment } from './../../shipments/shared/interfaces/shipment.interface';
import { Package } from './../../package/shared/interfaces/package.interface';
import { Component, ViewChild, OnInit } from '@angular/core';
import { PoBreadcrumb } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageAction } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Packages } from '../../package/shared/interfaces/packages.interface';
import { PackagesService } from '../../package/shared/services/packages-service';
import { ShipmentsService } from '../../shipments/shared/service/shipments.service';
import { MqttService } from 'ngx-mqtt';
import { TrackersService } from '../../trackers/shared/services/trackers.service';
import { Tracker } from '../../trackers/shared/interfaces/tracker.interface';


@Component({
  selector: 'app-expedition-shipment',
  templateUrl: './expedition-shipment.component.html',
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


export class ExpeditionShipmentComponent implements OnInit {
  opcEdit: string = '';
  isSubscribed: boolean = false;
  isLoading = false;
  packagesSubscription: Subscription = new Subscription();
  shipmentPutSubscription: Subscription = new Subscription();

  packages: Packages = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }
  oPackage: Package = {
    code: '',
    name: '',
    status: '',
    filial: '',
    tipo: '',
    tracker: '',
    shipment: '',
    data: ''
  }
  listputshipment: Array<Package> = [];
  ptitle: string = "Expedição";
  shipment: string = "";
  oShipment: Shipment = {
    filial: '',
    code: '',
    status: '',
    dtini: '',
    dtexpe: '',
    dtcheg: '',
    destin: ''
  };
  page = 1;
  pageSize = 5;
  totalItens = 10;
  totalPackage = 10;

  codRead: string = "";
  textRemainingRecords: string = "";
  hasNextPage = false;

  constructor(
    private poNotification: PoNotificationService,
    private packagesService: PackagesService,
    private router: Router,
    private shipmentsService: ShipmentsService,
    private activatedRoute: ActivatedRoute,
    private mqttService: MqttService,
    private trackersService: TrackersService,
  ) {}

  saveputpackages(code: string): void{
    var status = '003';
    this.isLoading = true;

    // console.log(simplifiedArray);
    if (code == this.oPackage.code) {
      this.oPackage.status = status;
      console.log(this.oPackage);
      this.packagesSubscription = this.packagesService.put(this.oPackage.code,this.oPackage).subscribe({
        next: response =>this.onSuccessSave(response, false),
        error: error => this.onErrorSave(error)
      });
    }else{
      this.poNotification.information(`Pacote incorreto favor apontar pacote: ${this.packages.items[0].code}`);
    }
  };

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' },
      { label: 'Expedição', link: '/expedition' },
      { label: 'Instrução de Carregamento', link: '/expedition/expeditionshipment' }]
  };

  cancel(): void {
    this.router.navigate(['expedition']);
  }

  ngOnDestroy(): void {
    this.packagesSubscription.unsubscribe();
    this.shipmentPutSubscription.unsubscribe();
  }



  ngOnInit(): void {
    this.setInitVar();
    this.getPackage(1, 10);
    this.getShipment();
  }


  setInitVar(): void {
    console.log(this.activatedRoute.snapshot);
    this.shipment = this.activatedRoute.snapshot.params['shipment'];
    this.opcEdit = this.activatedRoute.snapshot.params['opc'];
    this.ptitle = `Instrução de Carregamento ${this.shipment}`;
  }

  getPackage(page: number, pageSize: number): void {
    this.isLoading = true;
    this.packagesSubscription = this.packagesService.get(page, pageSize, `shipment eq '${this.shipment}' and status eq '002'`).subscribe({
      next: (packages: Packages) => this.onSuccessPackage(packages),
      error: (error: any) => this.onErrorPackage(error)
    });
  }

  getShipment(): void {
    this.isLoading = true;
    this.shipmentsService.getById(this.shipment).subscribe({
      next: (shipment: Shipment) => {
        this.oShipment = shipment;
      },
      error: (error: any) => this.onErrorSave(error)
    });
  }

  goToExpedPackges(): void {
    if (this.oShipment.code != '') {
      this.oShipment.status = '003'
      this.isLoading = true;
      this.shipmentPutSubscription = this.shipmentsService.put(this.oShipment.code, this.oShipment).subscribe({
        next: response => this.onSuccessSaveEnd(response, false),
        error: error => this.onErrorSave(error)
      });
    }else{
      this.poNotification.error('Falha ao alterar status carregamento para EXPEDIDO.')
    }

  }

  getTracker(tracker: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.trackersService.getById(tracker).subscribe({
        next: (tracker: Tracker) => resolve(tracker.id),
        error: (error: any) => {
          this.onErrorSave(error);
          reject(error);
        }
      });
    });
  }


  async goToLinkIdForm(tracker: string, message: string): Promise<void> {
    try {
      const topic = await this.getTracker(tracker);
      console.log(`tracker: ${tracker}`);
      console.log(`topic: ${topic}`);
      console.log(`message: "${message}"`);
      console.log();

      if (message.trim()) {
        console.log("entrou");
        this.mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
        message = '';
      }
    } catch (error) {
      console.error("Erro ao obter o tracker:", error);
    }
  }



  onSuccessPackage(packages: Packages): void {
    if (packages.items.length === 0) {
      this.poNotification.information(`Não há pacotes pendentes expedição`);
      this.cancel()
    }
    if (this.packages.items.length === 0) {
      this.packages = packages;
      this.packages.items = this.packages.items.map(oPackage => ({
        ...oPackage,
      }));
      this.oPackage = this.packages.items.shift() as Package;
    } else {
      this.packages.items = this.packages.items.concat(packages.items);
      this.packages.items = this.packages.items.map(oPackage => ({
        ...oPackage,
      }));
    }

    for (const index in this.packages.items) {
      console.log(`Index ${index}: ${this.packages.items[index].tracker}`);
      this.goToLinkIdForm(this.packages.items[index].tracker,"1");
    }

    // console.log(this.packages.items.length);
    this.hasNextPage = packages.hasNext;
    this.totalPackage = this.packages.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalPackage} de ${this.totalPackage + packages.remainingRecords}`
    this.isLoading = false;
  }


  onErrorPackage(error: any): void {
    this.poNotification.error(error);
    this.isLoading = false;
  }

  onSuccessSaveEnd(response: any, saveAndNew: boolean): void {
    this.isLoading = false;
    this.poNotification.success(`Expedição realizada com sucesso: ${response.code}`);
    this.router.navigate(['/expedition']);
    // this.loadData();
  };


  onSuccessSave(response: any, saveAndNew: boolean): void {
    this.poNotification.success(`Registro inserido com sucesso: ${response.code}`);
    console.log(this.packages.items.length);
    if (this.packages.items.length > 0) {
      this.isLoading = false;
      window.location.reload();
      }else{
      // this.poNotification.success(`Expedição de carregamento concluido com sucesso`);
      this.goToExpedPackges();
      this.isLoading = false;
    }
   };


  onErrorSave(error: any): void {
    this.isLoading = false;
    this.poNotification.error(error);
  }


  showMore(): void {
    this.page += 1;
    this.getPackage(this.page, 10);
  }

}

