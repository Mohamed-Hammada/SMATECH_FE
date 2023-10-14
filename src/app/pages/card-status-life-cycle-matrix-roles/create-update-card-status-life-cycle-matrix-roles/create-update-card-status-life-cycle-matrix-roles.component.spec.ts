import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCardStatusLifeCycleMatrixRolesComponent } from './create-update-card-status-life-cycle-matrix-roles.component';

describe('CreateUpdateCardStatusLifeCycleMatrixRolesComponent', () => {
  let component: CreateUpdateCardStatusLifeCycleMatrixRolesComponent;
  let fixture: ComponentFixture<CreateUpdateCardStatusLifeCycleMatrixRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateCardStatusLifeCycleMatrixRolesComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateCardStatusLifeCycleMatrixRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
