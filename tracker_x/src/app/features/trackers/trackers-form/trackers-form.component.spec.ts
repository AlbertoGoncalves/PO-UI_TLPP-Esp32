import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackersFormComponent } from './trackers-form.component';

describe('TrackersFormComponent', () => {
  let component: TrackersFormComponent;
  let fixture: ComponentFixture<TrackersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackersFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
