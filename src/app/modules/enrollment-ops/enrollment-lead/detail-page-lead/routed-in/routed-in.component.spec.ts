import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedInComponent } from './routed-in.component';

describe('RoutedInComponent', () => {
  let component: RoutedInComponent;
  let fixture: ComponentFixture<RoutedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
