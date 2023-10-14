import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateMarketingManagerComponent } from './create-update-marketing-manager.component';

describe('CreateUpdateMarketingManagerComponent', () => {
  let component: CreateUpdateMarketingManagerComponent;
  let fixture: ComponentFixture<CreateUpdateMarketingManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateMarketingManagerComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateMarketingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
