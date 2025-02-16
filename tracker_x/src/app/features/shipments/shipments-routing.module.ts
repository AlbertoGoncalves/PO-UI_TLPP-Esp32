import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MQTT_SERVICE_OPTIONS, MqttModule } from 'ngx-mqtt';
import { ShipmentsComponent } from './shipments.component';
import { ShipmentsFormComponent } from './shipments-form/shipments-form.component';
import { ShipmentsPackgesAddFormComponent } from './shipments-packges-add-form/shipments-packges-add-form.component';
const routes: Routes = [
  { path: '', component: ShipmentsComponent },
  { path: 'new', component: ShipmentsFormComponent },
  { path: 'add_packges/:shipment/:opc', component: ShipmentsPackgesAddFormComponent },
  { path: 'edit/:id', component: ShipmentsFormComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule,
  ]
})
export class ShipmentsRoutingModule { }
