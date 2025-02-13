import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ExpeditionRoutingModule } from './expedition-routing.module';
import { ExpeditionComponent } from './expedition.component';
import { ExpeditionShipmentComponent } from './expedition-shipment/expedition-shipment.component';



@NgModule({
  declarations: [ExpeditionComponent, ExpeditionShipmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ExpeditionRoutingModule,
    FormsModule
  ]
})
export class ExpeditionModule { }
