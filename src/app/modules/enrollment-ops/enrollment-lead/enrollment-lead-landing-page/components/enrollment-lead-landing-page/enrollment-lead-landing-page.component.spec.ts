import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentLeadLandingPageComponent } from './enrollment-lead-landing-page.component';

describe('EnrollmentLeadLandingPageComponent', () => {
  let component: EnrollmentLeadLandingPageComponent;
  let fixture: ComponentFixture<EnrollmentLeadLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentLeadLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentLeadLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
