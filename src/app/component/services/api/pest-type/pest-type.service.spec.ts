import { TestBed } from '@angular/core/testing';

import { PestTypeService } from './pest-type.service';

describe('PestTypeService', () => {
  let service: PestTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PestTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
