import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateComponentsComponent } from './create-update-components.component';

describe('CreateUpdateComponentsComponent', () => {
  let component: CreateUpdateComponentsComponent;
  let fixture: ComponentFixture<CreateUpdateComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateComponentsComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
