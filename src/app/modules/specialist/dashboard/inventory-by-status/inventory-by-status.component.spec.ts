import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryByStatusComponent } from './inventory-by-status.component';

describe('InventoryByStatusComponent', () => {
  let component: InventoryByStatusComponent;
  let fixture: ComponentFixture<InventoryByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
