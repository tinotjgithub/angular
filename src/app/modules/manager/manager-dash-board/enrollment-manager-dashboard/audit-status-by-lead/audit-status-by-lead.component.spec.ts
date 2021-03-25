/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditStatusByLeadComponent } from './audit-status-by-lead.component';

describe('AuditStatusByLeadComponent', () => {
  let component: AuditStatusByLeadComponent;
  let fixture: ComponentFixture<AuditStatusByLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditStatusByLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditStatusByLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
