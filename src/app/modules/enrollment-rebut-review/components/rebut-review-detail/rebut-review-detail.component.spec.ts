import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebutReviewDetailComponent } from './rebut-review-detail.component';

describe('RebutReviewDetailComponent', () => {
  let component: RebutReviewDetailComponent;
  let fixture: ComponentFixture<RebutReviewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebutReviewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebutReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
