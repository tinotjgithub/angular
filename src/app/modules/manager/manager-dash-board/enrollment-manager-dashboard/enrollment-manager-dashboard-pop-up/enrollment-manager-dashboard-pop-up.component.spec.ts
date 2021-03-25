/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnrollmentManagerDashboardPopUpComponent } from './enrollment-manager-dashboard-pop-up.component';

describe('EnrollmentManagerDashboardPopUpComponent', () => {
  let component: EnrollmentManagerDashboardPopUpComponent;
  let fixture: ComponentFixture<EnrollmentManagerDashboardPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentManagerDashboardPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentManagerDashboardPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
