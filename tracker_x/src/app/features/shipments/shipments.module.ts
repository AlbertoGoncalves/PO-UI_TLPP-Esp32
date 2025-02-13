import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ShipmentsRoutingModule } from './shipments-routing.module';
import { ShipmentsFormComponent } from './shipments-form/shipments-form.component';
import { ShipmentsComponent } from './shipments.component';
import { ShipmentsPackgesAddFormComponent } from './shipments-packges-add-form/shipments-packges-add-form.component';


@NgModule({
  declarations: [ShipmentsComponent, ShipmentsFormComponent, ShipmentsPackgesAddFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ShipmentsRoutingModule,
    FormsModule
  ]
})
export class ShipmentsModule { }
