import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendedRequestAgeComponent } from './pended-request-age.component';

describe('PendedRequestAgeComponent', () => {
  let component: PendedRequestAgeComponent;
  let fixture: ComponentFixture<PendedRequestAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendedRequestAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendedRequestAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
