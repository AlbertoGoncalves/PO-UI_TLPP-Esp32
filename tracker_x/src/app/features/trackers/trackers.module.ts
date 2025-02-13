import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TrackersFormComponent } from './trackers-form/trackers-form.component';
import { TrackersRoutingModule } from './trackers-routing.module';
import { TrackersComponent } from './trackers.component';
import { TrackerDeviceFormComponent } from './tracker-device-form/tracker-device-form.component';

@NgModule({
  declarations: [TrackersComponent, TrackersFormComponent, TrackerDeviceFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    TrackersRoutingModule,
    ReactiveFormsModule
  ]
})
export class TrackersModule { }
