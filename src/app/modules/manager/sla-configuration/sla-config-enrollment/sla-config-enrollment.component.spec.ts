import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaConfigEnrollmentComponent } from './sla-config-enrollment.component';

describe('SlaConfigEnrollmentComponent', () => {
  let component: SlaConfigEnrollmentComponent;
  let fixture: ComponentFixture<SlaConfigEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaConfigEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaConfigEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
