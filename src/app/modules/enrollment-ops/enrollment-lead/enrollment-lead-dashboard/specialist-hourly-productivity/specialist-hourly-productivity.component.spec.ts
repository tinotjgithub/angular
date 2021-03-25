/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialistHourlyProductivityComponent } from './specialist-hourly-productivity.component';

describe('SpecialistHourlyProductivityComponent', () => {
  let component: SpecialistHourlyProductivityComponent;
  let fixture: ComponentFixture<SpecialistHourlyProductivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistHourlyProductivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistHourlyProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
