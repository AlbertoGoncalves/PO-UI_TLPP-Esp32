import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerDeviceFormComponent } from './tracker-device-form.component';

describe('TrackerDeviceFormComponent', () => {
  let component: TrackerDeviceFormComponent;
  let fixture: ComponentFixture<TrackerDeviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackerDeviceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackerDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
