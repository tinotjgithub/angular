import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentManualPrioritizationComponent } from './enrollment-manual-prioritization.component';

describe('EnrollmentManualPrioritizationComponent', () => {
  let component: EnrollmentManualPrioritizationComponent;
  let fixture: ComponentFixture<EnrollmentManualPrioritizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentManualPrioritizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentManualPrioritizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
