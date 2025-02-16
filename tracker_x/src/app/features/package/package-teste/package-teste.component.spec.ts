import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTesteComponent } from './package-teste.component';

describe('PackageTesteComponent', () => {
  let component: PackageTesteComponent;
  let fixture: ComponentFixture<PackageTesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackageTesteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageTesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
