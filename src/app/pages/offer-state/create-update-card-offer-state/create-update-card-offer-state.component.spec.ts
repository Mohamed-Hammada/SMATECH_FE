import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCardOfferStateComponent } from './create-update-card-offer-state.component';

describe('CreateUpdateCardOfferStateComponent', () => {
  let component: CreateUpdateCardOfferStateComponent;
  let fixture: ComponentFixture<CreateUpdateCardOfferStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateCardOfferStateComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateCardOfferStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
