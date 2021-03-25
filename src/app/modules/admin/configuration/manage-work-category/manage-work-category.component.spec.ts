import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkCategoryComponent } from './manage-work-category.component';

describe('ManageWorkCategoryComponent', () => {
  let component: ManageWorkCategoryComponent;
  let fixture: ComponentFixture<ManageWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
