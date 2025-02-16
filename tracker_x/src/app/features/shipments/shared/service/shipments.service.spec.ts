import { TestBed } from '@angular/core/testing';

import { ShipmentsService } from './shipments.service';

describe('ShipmentService', () => {
  let service: ShipmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
