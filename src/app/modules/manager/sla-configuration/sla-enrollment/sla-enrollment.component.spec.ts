import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaEnrollmentComponent } from './sla-enrollment.component';

describe('SlaEnrollmentComponent', () => {
  let component: SlaEnrollmentComponent;
  let fixture: ComponentFixture<SlaEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
