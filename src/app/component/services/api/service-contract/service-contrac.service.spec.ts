import { TestBed } from '@angular/core/testing';

import { ServiceContracService } from './service-contrac.service';

describe('ServiceContracService', () => {
  let service: ServiceContracService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceContracService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
