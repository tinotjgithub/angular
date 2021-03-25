import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAutoSamplingComponent } from './enrollment-auto-sampling.component';

describe('EnrollmentAutoSamplingComponent', () => {
  let component: EnrollmentAutoSamplingComponent;
  let fixture: ComponentFixture<EnrollmentAutoSamplingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentAutoSamplingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAutoSamplingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
