/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialistWorkingTimeTrendComponent } from './specialist-working-time-trend.component';

describe('SpecialistWorkingTimeTrendComponent', () => {
  let component: SpecialistWorkingTimeTrendComponent;
  let fixture: ComponentFixture<SpecialistWorkingTimeTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistWorkingTimeTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistWorkingTimeTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
