/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditorAuditSamplingWorkCategoryComponent } from './auditor-audit-sampling-work-category.component';

describe('AuditorAuditSamplingWorkCategoryComponent', () => {
  let component: AuditorAuditSamplingWorkCategoryComponent;
  let fixture: ComponentFixture<AuditorAuditSamplingWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorAuditSamplingWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditSamplingWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
