import { TestBed } from '@angular/core/testing';

import { CustomerSiteService } from './customer-site.service';

describe('CustomerSiteService', () => {
  let service: CustomerSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
