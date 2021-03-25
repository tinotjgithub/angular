import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductionCountByTransactionCategoryComponent } from "./production-count-by-transaction-category";

describe("ProductionCountByTransactionCategoryComponent", () => {
  let component: ProductionCountByTransactionCategoryComponent;
  let fixture: ComponentFixture<ProductionCountByTransactionCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionCountByTransactionCategoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ProductionCountByTransactionCategoryComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
