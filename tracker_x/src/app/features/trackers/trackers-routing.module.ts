import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackersFormComponent } from './trackers-form/trackers-form.component';
import { TrackersComponent } from './trackers.component';
import { TrackerDeviceFormComponent } from './tracker-device-form/tracker-device-form.component';
import { MQTT_SERVICE_OPTIONS, MqttModule } from 'ngx-mqtt';
const routes: Routes = [
  { path: '', component: TrackersComponent },
  { path: 'new', component: TrackersFormComponent },
  { path: 'edit/:id', component: TrackersFormComponent },
  { path: 'view-device/:id', component: TrackerDeviceFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  exports: [RouterModule,
    MqttModule,
  ]
})
export class TrackersRoutingModule { }
