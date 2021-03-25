/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialistAuditFailedDetailPageComponent } from './specialist-audit-failed-detail-page.component';

describe('SpecialistAuditFailedDetailPageComponent', () => {
  let component: SpecialistAuditFailedDetailPageComponent;
  let fixture: ComponentFixture<SpecialistAuditFailedDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistAuditFailedDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistAuditFailedDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
