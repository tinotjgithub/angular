import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmetLeadRoutedInDetailComponent } from './enrollmet-lead-routed-in-detail.component';

describe('EnrollmetLeadRoutedInDetailComponent', () => {
  let component: EnrollmetLeadRoutedInDetailComponent;
  let fixture: ComponentFixture<EnrollmetLeadRoutedInDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmetLeadRoutedInDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmetLeadRoutedInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
