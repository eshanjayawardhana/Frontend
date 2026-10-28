import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentJobComponent } from './treatment-job.component';

describe('TreatmentJobComponent', () => {
  let component: TreatmentJobComponent;
  let fixture: ComponentFixture<TreatmentJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentJobComponent]
    });
    fixture = TestBed.createComponent(TreatmentJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
