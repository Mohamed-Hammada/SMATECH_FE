import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechStateCardsComponent } from './tech-state-cards.component';

describe('TechStateCardsComponent', () => {
  let component: TechStateCardsComponent;
  let fixture: ComponentFixture<TechStateCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechStateCardsComponent]
    });
    fixture = TestBed.createComponent(TechStateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
