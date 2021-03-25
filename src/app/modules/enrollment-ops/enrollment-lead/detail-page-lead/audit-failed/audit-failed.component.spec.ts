/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditFailedComponent } from './audit-failed.component';

describe('AuditFailedComponent', () => {
  let component: AuditFailedComponent;
  let fixture: ComponentFixture<AuditFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
