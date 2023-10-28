import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechStateCardDetailsComponent } from './tech-state-card-details.component';

describe('TechStateCardDetailsComponent', () => {
  let component: TechStateCardDetailsComponent;
  let fixture: ComponentFixture<TechStateCardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechStateCardDetailsComponent]
    });
    fixture = TestBed.createComponent(TechStateCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
