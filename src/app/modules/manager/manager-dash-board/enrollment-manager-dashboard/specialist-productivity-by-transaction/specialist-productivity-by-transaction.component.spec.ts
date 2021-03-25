/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialistProductivityByTransactionComponent } from './specialist-productivity-by-transaction.component';

describe('SpecialistProductivityByTransactionComponent', () => {
  let component: SpecialistProductivityByTransactionComponent;
  let fixture: ComponentFixture<SpecialistProductivityByTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistProductivityByTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistProductivityByTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
