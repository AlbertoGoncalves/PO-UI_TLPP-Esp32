import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PackagesComponent } from './packages.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesFormComponent } from './packages-form/packages-form.component';
import { TrackersFromViewComponent } from './trackers-from-view/trackers-from-view.component';
import { PackageTesteComponent } from './package-teste/package-teste.component';



@NgModule({
  declarations: [PackagesComponent, PackagesFormComponent, TrackersFromViewComponent, PackageTesteComponent],
  imports: [
    CommonModule,
    SharedModule,
    PackagesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PackagesModule { }
