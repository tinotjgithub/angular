import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRebuttalComponent } from './review-rebuttal.component';

describe('ReviewRebuttalComponent', () => {
  let component: ReviewRebuttalComponent;
  let fixture: ComponentFixture<ReviewRebuttalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewRebuttalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRebuttalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
