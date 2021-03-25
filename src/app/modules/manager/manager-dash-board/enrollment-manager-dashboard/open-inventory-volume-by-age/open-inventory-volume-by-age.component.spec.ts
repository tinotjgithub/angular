/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpenInventoryVolumeByAgeComponent } from './open-inventory-volume-by-age.component';

describe('OpenInventoryVolumeByAgeComponent', () => {
  let component: OpenInventoryVolumeByAgeComponent;
  let fixture: ComponentFixture<OpenInventoryVolumeByAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenInventoryVolumeByAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInventoryVolumeByAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
