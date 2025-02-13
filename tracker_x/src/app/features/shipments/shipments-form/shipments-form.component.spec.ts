import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentsFormComponent } from './shipments-form.component';

describe('ShipmentsFormComponent', () => {
  let component: ShipmentsFormComponent;
  let fixture: ComponentFixture<ShipmentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipmentsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShipmentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
