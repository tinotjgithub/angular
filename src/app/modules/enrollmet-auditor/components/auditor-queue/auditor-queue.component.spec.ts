import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorQueueComponent } from './auditor-queue.component';

describe('AuditorQueueComponent', () => {
  let component: AuditorQueueComponent;
  let fixture: ComponentFixture<AuditorQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
