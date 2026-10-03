import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalComponent } from './chemical.component';

describe('ChemicalComponent', () => {
  let component: ChemicalComponent;
  let fixture: ComponentFixture<ChemicalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChemicalComponent]
    });
    fixture = TestBed.createComponent(ChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
