import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentRebutReviewComponent } from './enrollment-rebut-review.component';

describe('EnrollmentRebutReviewComponent', () => {
  let component: EnrollmentRebutReviewComponent;
  let fixture: ComponentFixture<EnrollmentRebutReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentRebutReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentRebutReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
