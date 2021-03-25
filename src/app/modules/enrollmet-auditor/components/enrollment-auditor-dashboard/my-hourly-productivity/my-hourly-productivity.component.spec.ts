/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyHourlyProductivityComponent } from './my-hourly-productivity.component';

describe('MyHourlyProductivityComponent', () => {
  let component: MyHourlyProductivityComponent;
  let fixture: ComponentFixture<MyHourlyProductivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHourlyProductivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHourlyProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
