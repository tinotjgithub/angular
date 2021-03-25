import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCountByTransactionComponent } from './request-count-by-transaction.component';

describe('RequestCountByTransactionComponent', () => {
  let component: RequestCountByTransactionComponent;
  let fixture: ComponentFixture<RequestCountByTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCountByTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCountByTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
