import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationMenuComponent } from "./configuration-menu.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

describe("ConfigurationMenuComponent", () => {
  let component: ConfigurationMenuComponent;
  let fixture: ComponentFixture<ConfigurationMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationMenuComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("with role", () => {
    const secureStorage: CryptoService = fixture.debugElement.injector.get(CryptoService);
    spyOn(secureStorage, 'getItem').and.returnValue('Manager');
    component.ngOnInit();
    expect(component.menuItem.length).toEqual(2);
  });
});
