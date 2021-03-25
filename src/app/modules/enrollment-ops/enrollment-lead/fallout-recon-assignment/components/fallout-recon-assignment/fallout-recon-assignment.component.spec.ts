import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FalloutReconAssignmentComponent } from './fallout-recon-assignment.component';

describe('FalloutReconAssignmentComponent', () => {
  let component: FalloutReconAssignmentComponent;
  let fixture: ComponentFixture<FalloutReconAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FalloutReconAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FalloutReconAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
