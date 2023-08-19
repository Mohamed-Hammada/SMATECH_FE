import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesComponent } from './company.component';

describe('CompanyComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesComponent]
    });
    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
