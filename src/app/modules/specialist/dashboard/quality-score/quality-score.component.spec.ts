import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityScoreComponent } from './quality-score.component';

describe('QualityScoreComponent', () => {
  let component: QualityScoreComponent;
  let fixture: ComponentFixture<QualityScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
