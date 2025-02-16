import { NgModule } from '@angular/core';
import { PackagesComponent } from './packages.component';
import { RouterModule, Routes } from '@angular/router';
import { MQTT_SERVICE_OPTIONS, MqttModule } from 'ngx-mqtt';
import { PackagesFormComponent } from './packages-form/packages-form.component';
import { TrackersFromViewComponent } from './trackers-from-view/trackers-from-view.component';
const routes: Routes = [
  { path: '', component: PackagesComponent },
  { path: 'new', component: PackagesFormComponent },
  { path: 'view/:id', component: TrackersFromViewComponent },
  { path: 'edit/:id', component: PackagesFormComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule,
  ]
})
export class PackagesRoutingModule { }
