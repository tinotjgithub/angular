/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpenInventoryNearingSlaDaysComponent } from './open-inventory-nearing-sla-days.component';

describe('OpenInventoryNearingSlaDaysComponent', () => {
  let component: OpenInventoryNearingSlaDaysComponent;
  let fixture: ComponentFixture<OpenInventoryNearingSlaDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenInventoryNearingSlaDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInventoryNearingSlaDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
