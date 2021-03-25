import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendedComponent } from './pended.component';

describe('PendedComponent', () => {
  let component: PendedComponent;
  let fixture: ComponentFixture<PendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
