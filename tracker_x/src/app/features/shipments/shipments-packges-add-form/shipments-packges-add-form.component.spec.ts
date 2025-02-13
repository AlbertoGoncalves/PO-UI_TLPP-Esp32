import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentsPackgesAddFormComponent } from './shipments-packges-add-form.component';

describe('ShipmentsPackgesAddFormComponent', () => {
  let component: ShipmentsPackgesAddFormComponent;
  let fixture: ComponentFixture<ShipmentsPackgesAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipmentsPackgesAddFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShipmentsPackgesAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
