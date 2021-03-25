/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditSamplingByWorkCategoryComponent } from './audit-sampling-by-work-category.component';

describe('AuditSamplingByWorkCategoryComponent', () => {
  let component: AuditSamplingByWorkCategoryComponent;
  let fixture: ComponentFixture<AuditSamplingByWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSamplingByWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSamplingByWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
