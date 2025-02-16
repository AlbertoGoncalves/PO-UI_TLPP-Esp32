import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackersFromViewComponent } from './trackers-from-view.component';

describe('TrackersFromViewComponent', () => {
  let component: TrackersFromViewComponent;
  let fixture: ComponentFixture<TrackersFromViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackersFromViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackersFromViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
