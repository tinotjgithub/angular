/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditedCountByWorkCategoryComponent } from './audited-count-by-work-category.component';

describe('AuditedCountByWorkCategoryComponent', () => {
  let component: AuditedCountByWorkCategoryComponent;
  let fixture: ComponentFixture<AuditedCountByWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditedCountByWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditedCountByWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
