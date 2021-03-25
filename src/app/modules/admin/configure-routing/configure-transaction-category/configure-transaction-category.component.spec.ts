import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTransactionCategoryComponent } from './configure-transaction-category.component';

describe('ConfigureTransactionCategoryComponent', () => {
  let component: ConfigureTransactionCategoryComponent;
  let fixture: ComponentFixture<ConfigureTransactionCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureTransactionCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureTransactionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
