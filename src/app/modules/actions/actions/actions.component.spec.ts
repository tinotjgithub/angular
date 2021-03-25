import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ActionsComponent } from "./actions.component";
import { RouterModule } from "@angular/router";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

describe("ActionsComponent", () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsComponent],
      imports: [RouterModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get action for role", () => {
    const crpytoService: CryptoService = fixture.debugElement.injector.get(CryptoService);
    spyOn(crpytoService, 'getItem').and.returnValue('Manager');
    component.ngOnInit();
    expect(component.menuItem.length > 0).toBeTruthy();
  });
});
