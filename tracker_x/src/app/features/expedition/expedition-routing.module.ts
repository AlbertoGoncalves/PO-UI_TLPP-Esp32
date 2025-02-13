import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MQTT_SERVICE_OPTIONS, MqttModule } from 'ngx-mqtt';
import { ExpeditionComponent } from './expedition.component';
import { ExpeditionShipmentComponent } from './expedition-shipment/expedition-shipment.component';

const routes: Routes = [
  { path: '', component: ExpeditionComponent },
  { path: 'expeditionshipment/:shipment/:opc', component: ExpeditionShipmentComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  exports: [RouterModule,
    MqttModule,
  ]
})
export class ExpeditionRoutingModule { }





