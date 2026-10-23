import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PestTypeComponent } from './pest-type.component';

describe('PestTypeComponent', () => {
  let component: PestTypeComponent;
  let fixture: ComponentFixture<PestTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PestTypeComponent]
    });
    fixture = TestBed.createComponent(PestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
