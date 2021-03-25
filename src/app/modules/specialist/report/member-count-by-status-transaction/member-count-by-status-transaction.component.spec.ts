import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCountByStatusTransactionComponent } from './member-count-by-status-transaction.component';

describe('MemberCountByStatusTransactionComponent', () => {
  let component: MemberCountByStatusTransactionComponent;
  let fixture: ComponentFixture<MemberCountByStatusTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCountByStatusTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCountByStatusTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
