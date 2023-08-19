import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateComponentTransactionComponent } from './create-update-component-transaction.component';

describe('CreateUpdateComponentTransactionComponent', () => {
  let component: CreateUpdateComponentTransactionComponent;
  let fixture: ComponentFixture<CreateUpdateComponentTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateComponentTransactionComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateComponentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
