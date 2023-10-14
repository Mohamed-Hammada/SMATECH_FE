import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStatusLifeCycleMatrixRolesComponent } from './card-status-life-cycle-matrix-roles.component';

describe('CardStatusLifeCycleMatrixRolesComponent', () => {
  let component: CardStatusLifeCycleMatrixRolesComponent;
  let fixture: ComponentFixture<CardStatusLifeCycleMatrixRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardStatusLifeCycleMatrixRolesComponent]
    });
    fixture = TestBed.createComponent(CardStatusLifeCycleMatrixRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
