import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTechStateComponent } from './create-update-tech-state.component';

describe('CreateUpdateTechStateComponent', () => {
  let component: CreateUpdateTechStateComponent;
  let fixture: ComponentFixture<CreateUpdateTechStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateTechStateComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateTechStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
