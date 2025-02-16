import { TestBed } from '@angular/core/testing';

import { PackageTesteService } from './package-teste.service';

describe('PackageTesteService', () => {
  let service: PackageTesteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageTesteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
