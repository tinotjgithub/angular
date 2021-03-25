/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditSamplingByAuditMethodComponent } from './audit-sampling-by-audit-method.component';

describe('AuditSamplingByAuditMethodComponent', () => {
  let component: AuditSamplingByAuditMethodComponent;
  let fixture: ComponentFixture<AuditSamplingByAuditMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSamplingByAuditMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByAuditMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
