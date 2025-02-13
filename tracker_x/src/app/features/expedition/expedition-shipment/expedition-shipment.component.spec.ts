import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionShipmentComponent } from './expedition-shipment.component';

describe('ExpeditionShipmentComponent', () => {
  let component: ExpeditionShipmentComponent;
  let fixture: ComponentFixture<ExpeditionShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpeditionShipmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpeditionShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
