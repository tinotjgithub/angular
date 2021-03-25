/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditSummaryByAuditStatusComponent } from './audit-summary-by-audit-status.component';

describe('AuditSummaryByAuditStatusComponent', () => {
  let component: AuditSummaryByAuditStatusComponent;
  let fixture: ComponentFixture<AuditSummaryByAuditStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSummaryByAuditStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSummaryByAuditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
