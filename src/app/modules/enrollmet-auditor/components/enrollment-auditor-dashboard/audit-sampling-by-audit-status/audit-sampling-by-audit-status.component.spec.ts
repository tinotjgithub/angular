/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditSamplingByAuditStatusComponent } from './audit-sampling-by-audit-status.component';

describe('AuditSamplingByAuditStatusComponent', () => {
  let component: AuditSamplingByAuditStatusComponent;
  let fixture: ComponentFixture<AuditSamplingByAuditStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSamplingByAuditStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByAuditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
