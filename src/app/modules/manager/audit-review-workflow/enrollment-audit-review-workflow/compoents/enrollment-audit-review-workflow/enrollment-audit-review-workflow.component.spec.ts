import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuditReviewWorkflowComponent } from './enrollment-audit-review-workflow.component';

describe('EnrollmentAuditReviewWorkflowComponent', () => {
  let component: EnrollmentAuditReviewWorkflowComponent;
  let fixture: ComponentFixture<EnrollmentAuditReviewWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditReviewWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditReviewWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
