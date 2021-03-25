import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStrategyComponent } from './transaction-strategy.component';

describe('TransactionStrategyComponent', () => {
  let component: TransactionStrategyComponent;
  let fixture: ComponentFixture<TransactionStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
