import { TestBed } from '@angular/core/testing';

import { Services01Service } from './services01.service';

describe('Services01Service', () => {
  let service: Services01Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Services01Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
