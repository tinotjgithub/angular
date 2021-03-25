import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuditRebuttalWorkflowComponent } from './enrollment-audit-rebuttal-workflow.component';

describe('EnrollmentAuditRebuttalWorkflowComponent', () => {
  let component: EnrollmentAuditRebuttalWorkflowComponent;
  let fixture: ComponentFixture<EnrollmentAuditRebuttalWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditRebuttalWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditRebuttalWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
