import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuditLandingPageComponent } from './enrollment-audit-landing-page.component';

describe('EnrollmentAuditLandingPageComponent', () => {
  let component: EnrollmentAuditLandingPageComponent;
  let fixture: ComponentFixture<EnrollmentAuditLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
