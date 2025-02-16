import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(
    private router: Router,
    private proAppConfigService: ProAppConfigService
  ) {
    this.proAppConfigService.loadAppConfig();
  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: () => this.router.navigate(['']) },
    { label: 'Rastreador', action: () => this.router.navigate(['trackers']) },
    // { label: 'Tracker Device', action: () => this.router.navigate(['trackerdevice']) },
    { label: 'Pacotes', action: () => this.router.navigate(['packages']) },
    { label: 'Carregamento', action: () => this.router.navigate(['shipments']) },
    { label: 'Expedição', action: () => this.router.navigate(['expedition']) },
    { label: 'Sair', action: () => this.closeApp() }
  ];

  closeApp(): void {
    this.proAppConfigService.callAppClose(false);
  }

}
