import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoNotificationService, PoPageAction, PoTableColumn, PoTagLiterals } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { Tracker } from './shared/interfaces/tracker.interface';
import { TrackersService } from './shared/services/trackers.service';
import { Trackers } from './shared/interfaces/trackers.interface';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-trackers',
  templateUrl: './trackers.component.html'
})
export class TrackersComponent implements OnInit, OnDestroy {
  trackers: Trackers = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  targetProperty= 'status';
  columns: Array<PoTableColumn> = [];
  now: Date = new Date;
  page = 1;
  pageSize = 10;
  isLoading = false;
  trackersSubscription: Subscription = new Subscription();
  totalTrackers = 10;
  textRemainingRecords: string = "";
  message: string = "";
  topic: string = "";
  hasNextPage = false;
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Rastreadores' }
    ]
  };
  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormTracker.bind(this) }
  ];
  poNotification: any;

  constructor(
    private trackersService: TrackersService,
    private poNotificationService: PoNotificationService,
    private router: Router,
    private mqttService: MqttService,
  ) {}

  customLiterals: PoTagLiterals = {
    remove: 'Remover itens'
  };

  ngOnDestroy(): void {
    this.trackersSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setColumns();
    this.getTrackers(1, 10);

  }

  setColumns(): void {
    this.columns = [
      { property: 'filial', label: 'Filial', visible: true },
      { property: 'code', label: 'Rastreador', type: 'link', action: (row: string) => this.goToView(row) },
      { property: 'name', label: 'Nome' },
      { property: 'status', label: 'Status', type: "columnTemplate"},
      { property: 'linkid', label: 'Dispositivo de Rastreio', type: 'icon', icons: [
        { value: 'view-linkid', icon: 'po-icon-eye', action: (tracker: Tracker) => this.goToLinkIdForm(tracker), tooltip: 'Verificar conexão' },
        { value: 'include-linkid', icon: 'po-icon-plus-circle', action: (tracker: Tracker) => this.goToViewLinkId(tracker.code), tooltip: 'Incluir dispositivo' }
      ] }
    ];
  }

  goToLinkIdForm(tracker: Tracker): void {
    // this.router.navigate(['device/new', code]);
      this.topic =  tracker.id;
      // this.message = "device: " + this.topic + " Rastreador: " + tracker.code + " Time:" + this.now.getHours() + ":" + this.now.getMinutes();
      // this.message = "D:" + this.topic + "R:" + tracker.code + "/1";
      this.message = "1";
      console.log(this.message)
      if (this.message.trim()) {
        console.log("entrou");
        this.mqttService.unsafePublish(this.topic, this.message, { qos: 1, retain: true });
        // this.poNotification.success(`Mensagem enviada: ${this.message}`);
        this.message = '';
      }
  }

  goToViewLinkId(id: string): void {
    this.router.navigate(['trackers/view-device', id]);
  }

  getTrackers(page: number, pageSize: number): void {
    this.isLoading = true;
    this.trackersSubscription = this.trackersService.get(page, pageSize).subscribe({
      next: (trackers: Trackers) => this.onSuccessTrackers(trackers),
      error: (error: any) => this.onErrorTrackers(error)
    });
  }

  onSuccessTrackers(trackers: Trackers): void {
    if (this.trackers.items.length === 0) {
      this.trackers = trackers;
      this.trackers.items = this.trackers.items.map(tracker => ({
        ...tracker,
        // status: this.formatStatus(tracker),
        status: tracker.status === "001" ? "ALOCADO"
        : tracker.status === "002" ? "DISPONIVEL"
        : tracker.status === "003" ? "EM MANUTENÇÃO"
        : tracker.status === "004" ? "DESCONTINUADO"
        : tracker.status = "NÃO MAPEADO",
        linkid: ['view-linkid', 'include-linkid']
      }));
    } else {
      this.trackers.items = this.trackers.items.concat(trackers.items);
      this.trackers.items = this.trackers.items.map(tracker => ({
        ...tracker,
        linkid: ['view-linkid', 'include-linkid']
      }));
    }

    this.hasNextPage = trackers.hasNext;
    this.totalTrackers = this.trackers.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalTrackers} de ${this.totalTrackers+trackers.remainingRecords}`
    this.isLoading = false;
  }

  onErrorTrackers(error: any): void {
    this.poNotificationService.error(error);
    this.isLoading = false;
  }

  showMore(): void {
    this.page += 1;
    this.getTrackers(this.page, 10);
  }

  goToFormTracker(): void {
    this.router.navigate(['trackers/new']);
  }

  goToView(id: string): void {
    this.router.navigate(['trackers/edit', id]);
  }
}
