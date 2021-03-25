import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentLeadMyTeamStatusDetailComponent } from './enrollment-lead-my-team-status-detail.component';

describe('EnrollmentLeadMyTeamStatusDetailComponent', () => {
  let component: EnrollmentLeadMyTeamStatusDetailComponent;
  let fixture: ComponentFixture<EnrollmentLeadMyTeamStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentLeadMyTeamStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentLeadMyTeamStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
