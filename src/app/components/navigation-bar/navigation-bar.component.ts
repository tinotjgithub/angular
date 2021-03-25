import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Router, NavigationEnd } from "@angular/router";
import { HeaderService } from "src/app/services/header/header.service";
import {
  adminMenuItems,
  managerMenuItems,
  leadMenuItems,
  auditorMenuItems,
  examinerMenuItems,
  specialistMenuItems,
  enrollmentLeadMenuItems,
  enrollmentAuditorMenuItems
} from "src/app/shared/constants.js";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html"
})
export class NavigationBarComponent implements OnInit, AfterViewInit {
  visibleSidebar1 = false;
  examinerItems: MenuItem[];
  adminItems: MenuItem[];
  managerItems: MenuItem[];
  roleId = this.secureLocalStorage.getItem("roleId");
  leadItems: MenuItem[];
  public mini = true;
  menuItems: any;
  currentUrl: string;
  constructor(
    private router: Router,
    private headerService: HeaderService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    if (this.roleId === "Administrator") {
      // this.setAdminMenuItems(adminMenuItems);
      this.setMenuItems(adminMenuItems);
    } else if (this.roleId === "Claims Examiner") {
      // this.setExaminerMenuItems(examinerMenuItems);
      this.setMenuItems(examinerMenuItems);
    } else if (this.roleId === "Manager") {
      // this.setManagerMenuItems(managerMenuItems);
      this.setMenuItems(managerMenuItems);
    } else if (this.roleId === "Claims Lead") {
      // this.setLeadMenuItems(leadMenuItems);
      this.setMenuItems(leadMenuItems);
    } else if (this.roleId === "Claims Auditor") {
      // this.setAuditorMenuItems(auditorMenuItems);
      this.setMenuItems(auditorMenuItems);
    } else if (this.roleId === "Enrollment Specialist") {
      this.setMenuItems(specialistMenuItems);
    } else if (this.roleId === "Enrollment Lead") {
      this.setMenuItems(enrollmentLeadMenuItems);
    } else if (this.roleId === "Enrollment Auditor") {
      this.setMenuItems(enrollmentAuditorMenuItems);
    }
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
      }
    });
  }

  ngAfterViewInit() {
    const ele = document.getElementById("main");
    if (ele && ele.style.marginLeft === "305px") {
      this.mini = false;
      this.toggleSidebar();
    }
  }

  setMenuItems(menuItems) {
    this.menuItems = this.constructMenu(menuItems);
  }

  /*  setAdminMenuItems(menuItems) {
    this.adminItems = this.constructMenu(menuItems);
    this.visibleSidebar1 = this.headerService.openSideMenu;
    this.headerService.sideMenuClickedListener().subscribe((value) => {
      this.visibleSidebar1 = value;
    });
  }

  setManagerMenuItems(menuItems) {
    this.managerItems = this.constructMenu(menuItems);
    this.visibleSidebar1 = this.headerService.openSideMenu;
    this.headerService.sideMenuClickedListener().subscribe((value) => {
      this.visibleSidebar1 = value;
    });
  }

  setLeadMenuItems(menuItems): void {
    this.leadItems = this.constructMenu(menuItems);
    this.visibleSidebar1 = this.headerService.openSideMenu;
    this.headerService.sideMenuClickedListener().subscribe((value) => {
      this.visibleSidebar1 = value;
    });
  }

  setAuditorMenuItems(menuItems): void {
    this.leadItems = this.constructMenu(menuItems);
    this.visibleSidebar1 = this.headerService.openSideMenu;
    this.headerService.sideMenuClickedListener().subscribe((value) => {
      this.visibleSidebar1 = value;
    });
  }

  setExaminerMenuItems(menuItems) {
    this.examinerItems = this.constructMenu(menuItems);
    this.visibleSidebar1 = this.headerService.openSideMenu;
    this.headerService.sideMenuClickedListener().subscribe((value) => {
      this.visibleSidebar1 = value;
    });
  }
 */
  constructMenu(menuItems: NavMenuItem[]) {
    return menuItems.map(i => {
      return {
        ...i,
        items:
          i.items && i.items.length > 0 ? this.constructMenu(i.items) : null,
        command:
          i.route !== null
            ? e => {
                // this.router.navigateByUrl(i.route);
                this.visibleSidebar1 = false;
              }
            : null
      };
    });
  }

  toggleSidebar() {
    if (this.mini) {
      document.getElementById("mySidebar").style.width = "305px";
      document.getElementById("main").style.marginLeft = "305px";
      this.mini = false;
    } else {
      document.getElementById("mySidebar").style.width = "85px";
      document.getElementById("main").style.marginLeft = "85px";
      this.mini = true;
    }
  }

  isActive(routerLink) {
    return this.currentUrl ? this.currentUrl.indexOf(routerLink) > -1 : false;
  }
}

interface NavMenuItem {
  label: string;
  icon: string;
  items: NavMenuItem[];
  route?: string;
  routerLinkActiveOptions?: any;
  routerLink?: any;
  expanded?: boolean;
}
