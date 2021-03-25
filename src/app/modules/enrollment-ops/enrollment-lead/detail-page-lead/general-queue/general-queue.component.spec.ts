import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralQueueComponent } from './general-queue.component';

describe('GeneralQueueComponent', () => {
  let component: GeneralQueueComponent;
  let fixture: ComponentFixture<GeneralQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
