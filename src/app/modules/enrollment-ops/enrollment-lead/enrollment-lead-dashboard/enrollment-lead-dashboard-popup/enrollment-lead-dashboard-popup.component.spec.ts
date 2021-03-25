/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnrollmentLeadDashboardPopupComponent } from './enrollment-lead-dashboard-popup.component';

describe('EnrollmentLeadDashboardPopupComponent', () => {
  let component: EnrollmentLeadDashboardPopupComponent;
  let fixture: ComponentFixture<EnrollmentLeadDashboardPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentLeadDashboardPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentLeadDashboardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
