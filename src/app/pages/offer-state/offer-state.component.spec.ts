import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStateComponent } from './offer-state.component';

describe('OfferStateComponent', () => {
  let component: OfferStateComponent;
  let fixture: ComponentFixture<OfferStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferStateComponent]
    });
    fixture = TestBed.createComponent(OfferStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
