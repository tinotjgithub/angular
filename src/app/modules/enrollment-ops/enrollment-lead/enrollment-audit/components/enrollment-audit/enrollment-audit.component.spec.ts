import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuditComponent } from './enrollment-audit.component';

describe('EnrollmentAuditComponent', () => {
  let component: EnrollmentAuditComponent;
  let fixture: ComponentFixture<EnrollmentAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
