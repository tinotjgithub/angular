/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditSamplingByBenifitPlanComponent } from './audit-sampling-by-benifit-plan.component';

describe('AuditSamplingByBenifitPlanComponent', () => {
  let component: AuditSamplingByBenifitPlanComponent;
  let fixture: ComponentFixture<AuditSamplingByBenifitPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSamplingByBenifitPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByBenifitPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
