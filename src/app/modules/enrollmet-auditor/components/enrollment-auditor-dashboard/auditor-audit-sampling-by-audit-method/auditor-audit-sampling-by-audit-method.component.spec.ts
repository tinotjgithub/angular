/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditorAuditSamplingByAuditMethodComponent } from './auditor-audit-sampling-by-audit-method.component';

describe('AuditorAuditSamplingByAuditMethodComponent', () => {
  let component: AuditorAuditSamplingByAuditMethodComponent;
  let fixture: ComponentFixture<AuditorAuditSamplingByAuditMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorAuditSamplingByAuditMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditSamplingByAuditMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
