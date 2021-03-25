/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransactionProcessedVsAuditedComponent } from './transaction-processed-vs-audited.component';

describe('TransactionProcessedVsAuditedComponent', () => {
  let component: TransactionProcessedVsAuditedComponent;
  let fixture: ComponentFixture<TransactionProcessedVsAuditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionProcessedVsAuditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionProcessedVsAuditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
