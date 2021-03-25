/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnrollmentAuditorDashboardPopUpComponent } from './enrollment-auditor-dashboard-pop-up.component';

describe('EnrollmentAuditorDashboardPopUpComponent', () => {
  let component: EnrollmentAuditorDashboardPopUpComponent;
  let fixture: ComponentFixture<EnrollmentAuditorDashboardPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditorDashboardPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditorDashboardPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
