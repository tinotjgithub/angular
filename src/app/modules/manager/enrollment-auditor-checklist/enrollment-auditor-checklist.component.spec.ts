import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuditorChecklistComponent } from './enrollment-auditor-checklist.component';

describe('EnrollmentAuditorChecklistComponent', () => {
  let component: EnrollmentAuditorChecklistComponent;
  let fixture: ComponentFixture<EnrollmentAuditorChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAuditorChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAuditorChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
