import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRebuttalComponent } from './audit-rebuttal.component';

describe('AuditRebuttalComponent', () => {
  let component: AuditRebuttalComponent;
  let fixture: ComponentFixture<AuditRebuttalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditRebuttalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRebuttalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
