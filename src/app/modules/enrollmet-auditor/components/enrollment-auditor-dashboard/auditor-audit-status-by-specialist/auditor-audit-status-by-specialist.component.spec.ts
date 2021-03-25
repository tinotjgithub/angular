/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditorAuditStatusBySpecialistComponent } from './auditor-audit-status-by-specialist.component';

describe('AuditorAuditStatusBySpecialistComponent', () => {
  let component: AuditorAuditStatusBySpecialistComponent;
  let fixture: ComponentFixture<AuditorAuditStatusBySpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorAuditStatusBySpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditStatusBySpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
