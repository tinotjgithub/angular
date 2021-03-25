/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpenInventoryAgeWorkCategoryComponent } from './open-inventory-age-work-category.component';

describe('OpenInventoryAgeWorkCategoryComponent', () => {
  let component: OpenInventoryAgeWorkCategoryComponent;
  let fixture: ComponentFixture<OpenInventoryAgeWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenInventoryAgeWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInventoryAgeWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
