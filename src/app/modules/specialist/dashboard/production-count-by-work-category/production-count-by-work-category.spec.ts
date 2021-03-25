import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountByWorkCategoryComponent } from './production-count-by-work-category';

describe('ProductionCountByWorkCategoryComponent', () => {
  let component: ProductionCountByWorkCategoryComponent;
  let fixture: ComponentFixture<ProductionCountByWorkCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionCountByWorkCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionCountByWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
