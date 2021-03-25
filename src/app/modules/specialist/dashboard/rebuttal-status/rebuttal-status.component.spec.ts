import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalStatusComponent } from './rebuttal-status.component';

describe('RebuttalStatusComponent', () => {
  let component: RebuttalStatusComponent;
  let fixture: ComponentFixture<RebuttalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuttalStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
