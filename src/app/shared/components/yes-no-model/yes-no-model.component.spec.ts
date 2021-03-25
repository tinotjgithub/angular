import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoModelComponent } from './yes-no-model.component';

describe('YesNoModelComponent', () => {
  let component: YesNoModelComponent;
  let fixture: ComponentFixture<YesNoModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on yes click', () => {
    let value;
    component.yesEvent.subscribe(val => value = val);
    component.callParentWithYes();
    expect(value).toEqual('yes');
  });

  it('should emit on no click', () => {
    let value;
    component.noEvent.subscribe(val => value = val);
    component.callParentWithNo();
    expect(value).toEqual('no');
  });
});
