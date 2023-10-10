import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechStateComponent } from './tech-state.component';

describe('TechStateComponent', () => {
  let component: TechStateComponent;
  let fixture: ComponentFixture<TechStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechStateComponent]
    });
    fixture = TestBed.createComponent(TechStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
