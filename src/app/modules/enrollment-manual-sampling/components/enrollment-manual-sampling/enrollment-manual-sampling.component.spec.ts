import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentManualSamplingComponent } from './enrollment-manual-sampling.component';

describe('EnrollmentManualSamplingComponent', () => {
  let component: EnrollmentManualSamplingComponent;
  let fixture: ComponentFixture<EnrollmentManualSamplingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentManualSamplingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentManualSamplingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
