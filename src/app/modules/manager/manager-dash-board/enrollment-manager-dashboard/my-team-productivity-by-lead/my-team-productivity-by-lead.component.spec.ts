/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyTeamProductivityByLeadComponent } from './my-team-productivity-by-lead.component';

describe('MyTeamProductivityByLeadComponent', () => {
  let component: MyTeamProductivityByLeadComponent;
  let fixture: ComponentFixture<MyTeamProductivityByLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTeamProductivityByLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamProductivityByLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
