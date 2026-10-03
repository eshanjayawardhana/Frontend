import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSiteComponent } from './customer-site.component';

describe('CustomerSiteComponent', () => {
  let component: CustomerSiteComponent;
  let fixture: ComponentFixture<CustomerSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerSiteComponent]
    });
    fixture = TestBed.createComponent(CustomerSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
