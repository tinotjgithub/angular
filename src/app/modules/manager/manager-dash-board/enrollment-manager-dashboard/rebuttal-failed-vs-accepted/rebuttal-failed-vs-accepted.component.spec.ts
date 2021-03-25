/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RebuttalFailedVsAcceptedComponent } from './rebuttal-failed-vs-accepted.component';

describe('RebuttalFailedVsAcceptedComponent', () => {
  let component: RebuttalFailedVsAcceptedComponent;
  let fixture: ComponentFixture<RebuttalFailedVsAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuttalFailedVsAcceptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalFailedVsAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
