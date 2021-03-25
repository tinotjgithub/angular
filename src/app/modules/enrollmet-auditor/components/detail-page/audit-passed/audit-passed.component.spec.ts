import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPassedComponent } from './audit-passed.component';

describe('AuditPassedComponent', () => {
  let component: AuditPassedComponent;
  let fixture: ComponentFixture<AuditPassedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPassedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPassedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
