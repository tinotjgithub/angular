/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnrollmentAuditSummaryByAuditorComponent } from './enrollment-audit-summary-by-auditor.component';

describe('EnrollmentAuditSummaryByAuditorComponent', () => {
  let component: EnrollmentAuditSummaryByAuditorComponent;
  let fixture: ComponentFixture<EnrollmentAuditSummaryByAuditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditSummaryByAuditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditSummaryByAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
