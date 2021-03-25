import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NavigationBarComponent } from "./navigation-bar.component";
import { CommonModule } from "@angular/common";
import { SidebarModule } from "primeng/sidebar";
import { PanelMenuModule } from "primeng/panelmenu";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderService } from "src/app/services/header/header.service";
import { of } from "rxjs";
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

describe("NavigationBarComponent", () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;
  let service: HeaderService;
  const adminMenuItems = [
    {
      label: "Admin",
      icon: "fas fa-home",
      routerLink: ["/ActiveUserSnapshot"],
      expanded: true,
      items: []
    }
  ];

  const leadMenuItems = [
    {
      label: "Claims Lead",
      icon: "fas fa-home",
      routerLink: ["/ActiveUserSnapshot"],
      expanded: true,
      items: []
    }
  ];

  const managerMenuItems = [
    {
      label: "Manager",
      icon: "fas fa-home",
      routerLink: ["/ActiveUserSnapshot"],
      expanded: true,
      items: []
    }
  ];

  const exqaminerMenuItems = [
    {
      label: "Claims Examiner",
      icon: "fas fa-home",
      routerLink: ["/ActiveUserSnapshot"],
      expanded: true,
      items: []
    }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationBarComponent],
      imports: [
        CommonModule,
        SidebarModule,
        PanelMenuModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [BaseHttpService]
    }).compileComponents();
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(HeaderService);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(HeaderService);
    fixture.detectChanges();
  });

  it("should create", () => {
    TestBed.get(Router).events.next(new NavigationEnd(42, '/', '/'));
    TestBed.get(Router).events.next(new NavigationStart(42, '/'));
    expect(component).toBeTruthy();
  });

  /* it("ngOnInit", () => {
    component.roleId = "Administrator";
    let spy = spyOn(component, "setAdminMenuItems");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Claims Examiner";
    spy = spyOn(component, "setExaminerMenuItems");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Manager";
    spy = spyOn(component, "setManagerMenuItems");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Claims Lead";
    spy = spyOn(component, "setLeadMenuItems");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  }); */

  it("ngOnInit", () => {
    component.roleId = "Administrator";
    const spy = spyOn(component, "setMenuItems");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Claims Examiner";
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Manager";
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Claims Lead";
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

    component.roleId = "Claims Auditor";
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  /* it("setAdminMenuItems", async(() => {
    const spy1 = spyOn(component, "constructMenu");
    const spy = spyOn(service, "sideMenuClickedListener").and.returnValue(
      of(true)
    );
    component.setAdminMenuItems(adminMenuItems);
    expect(spy1).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.visibleSidebar1).toBe(true);
  }));

  it("setLeadMenuItems", async(() => {
    const spy1 = spyOn(component, "constructMenu");
    const spy = spyOn(service, "sideMenuClickedListener").and.returnValue(
      of(true)
    );
    component.setLeadMenuItems(leadMenuItems);
    expect(spy1).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.visibleSidebar1).toBe(true);
  }));

  it("setExaminerMenuItems", async(() => {
    const spy1 = spyOn(component, "constructMenu");
    const spy = spyOn(service, "sideMenuClickedListener").and.returnValue(
      of(true)
    );
    component.setExaminerMenuItems(exqaminerMenuItems);
    expect(spy1).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.visibleSidebar1).toBe(true);
  }));

  it("setManagerMenuItems", async(() => {
    const spy1 = spyOn(component, "constructMenu");
    const spy = spyOn(service, "sideMenuClickedListener").and.returnValue(
      of(true)
    );
    component.setManagerMenuItems(managerMenuItems);
    expect(spy1).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.visibleSidebar1).toBe(true);
  })); */

  it("setMenuItems", async(() => {
    const spy1 = spyOn(component, "constructMenu");
    component.setMenuItems(leadMenuItems);
    expect(spy1).toHaveBeenCalled();
  }));

  it("constructMenu", () => {
    const data = [
      {
        label: "Admin",
        icon: "fas fa-home",
        routerLink: ["/ActiveUserSnapshot"],
        expanded: true,
        items: null
      }
    ];
    const result: any[] = component.constructMenu(adminMenuItems);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(data));
  });

  it("constructMenu with command", () => {
    const data = [
      {
        label: "Admin",
        icon: "fas fa-home",
        routerLink: ["/ActiveUserSnapshot"],
        expanded: true,
        items: [
          {
            label: "Admin",
            icon: "fas fa-home",
            routerLink: ["/ActiveUserSnapshot"],
            expanded: true,
            items: null,
            route: null
          }
        ],
        route: 'test'
      }
    ];
    const result: any[] = component.constructMenu(data);
    result[0].command();
    expect(Object.keys(result[0]).indexOf('command')).not.toEqual(-1);
  });

  it("toggleSidebar", async(() => {
    const ele = document.createElement('div');
    spyOn(document, "getElementById").and.returnValue(ele);
    component.toggleSidebar();
    expect(ele.style.width).toEqual("305px");
    component.toggleSidebar();
    expect(ele.style.width).toEqual("85px");
    component.isActive('test');
    component.currentUrl = 'test123';
    component.isActive('test');
    component.isActive('wqe');
    expect(component).toBeTruthy();
  }));

  it("ngAfterViewInit", () => {
    const ele = document.createElement("div");
    ele.style.marginLeft = "305px";
    spyOn(document, 'getElementById').and.returnValue(ele);
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });
});
