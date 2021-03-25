/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClaimsAuditRebuttalWorkflowComponent } from './claims-audit-rebuttal-workflow.component';

describe('ClaimsAuditRebuttalWorkflowComponent', () => {
  let component: ClaimsAuditRebuttalWorkflowComponent;
  let fixture: ComponentFixture<ClaimsAuditRebuttalWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsAuditRebuttalWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAuditRebuttalWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
