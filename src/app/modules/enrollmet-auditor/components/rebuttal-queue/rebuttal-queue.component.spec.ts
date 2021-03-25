import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalQueueComponent } from './rebuttal-queue.component';

describe('RebuttalQueueComponent', () => {
  let component: RebuttalQueueComponent;
  let fixture: ComponentFixture<RebuttalQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuttalQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
