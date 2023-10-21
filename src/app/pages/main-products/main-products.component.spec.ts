import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProductsComponent } from './main-products.component';

describe('MainProductsComponent', () => {
  let component: MainProductsComponent;
  let fixture: ComponentFixture<MainProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainProductsComponent]
    });
    fixture = TestBed.createComponent(MainProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
