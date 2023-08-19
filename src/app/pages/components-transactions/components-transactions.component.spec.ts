import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsTransactionsComponent } from './components-transactions.component';

describe('ComponentsTransactionsComponent', () => {
  let component: ComponentsTransactionsComponent;
  let fixture: ComponentFixture<ComponentsTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsTransactionsComponent]
    });
    fixture = TestBed.createComponent(ComponentsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
