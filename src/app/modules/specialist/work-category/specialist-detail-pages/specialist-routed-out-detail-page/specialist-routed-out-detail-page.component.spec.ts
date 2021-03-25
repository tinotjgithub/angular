/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialistRoutedOutDetailPageComponent } from './specialist-routed-out-detail-page.component';

describe('SpecialistRoutedOutDetailPageComponent', () => {
  let component: SpecialistRoutedOutDetailPageComponent;
  let fixture: ComponentFixture<SpecialistRoutedOutDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialistRoutedOutDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistRoutedOutDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
