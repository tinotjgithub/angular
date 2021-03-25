import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductivityByTransactionComponent } from './productivity-by-transaction.component';

describe('ProductivityByTransactionComponent', () => {
  let component: ProductivityByTransactionComponent;
  let fixture: ComponentFixture<ProductivityByTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductivityByTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductivityByTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
