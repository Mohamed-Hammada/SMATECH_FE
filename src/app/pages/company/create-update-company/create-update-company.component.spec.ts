import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCompanyComponent } from './create-update-company.component';

describe('CreateUpdateCompanyComponent', () => {
  let component: CreateUpdateCompanyComponent;
  let fixture: ComponentFixture<CreateUpdateCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateCompanyComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
