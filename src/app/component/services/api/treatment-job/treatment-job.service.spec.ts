import { TestBed } from '@angular/core/testing';

import { TreatmentJobService } from './treatment-job.service';

describe('TreatmentJobService', () => {
  let service: TreatmentJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
