import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableAuditChecklistComponent } from './enable-audit-checklist.component';

describe('EnableAuditChecklistComponent', () => {
  let component: EnableAuditChecklistComponent;
  let fixture: ComponentFixture<EnableAuditChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableAuditChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableAuditChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
