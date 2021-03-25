import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmemtManualAssignmentComponent } from './enrollmemt-manual-assignment.component';

describe('EnrollmemtManualAssignmentComponent', () => {
  let component: EnrollmemtManualAssignmentComponent;
  let fixture: ComponentFixture<EnrollmemtManualAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmemtManualAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmemtManualAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
