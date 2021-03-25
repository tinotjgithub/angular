import { Component, OnInit } from "@angular/core";
import { configurationMenu } from "src/app/shared/constants.js";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ROLES } from "../../../shared/constants.js";
import { AuthenticationService } from "../../authentication/services/authentication.service";

@Component({
  selector: "app-configuration-menu",
  templateUrl: "./configuration-menu.component.html"
})
export class ConfigurationMenuComponent implements OnInit {
  public currentRole: string;
  public menuItem: Array<{ header: string; icon: string; links: any[] }>;
  managerType: any;

  constructor(
    private secureLocalStorage: CryptoService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.menuItem = [];
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    if (this.currentRole) {
      if (this.currentRole === ROLES.manager) {
        this.managerType = this.authService.managerType;
        this.setMenu(this.managerType);
        this.authService.updateManagerTypeListener().subscribe(type => {
          this.managerType = type;
          this.setMenu(type);
        });
      } else {
        this.setMenu();
      }
    }
  }

  getLinksByType(managerType) {
    let array = [];
    if (managerType === "claims" || managerType === "both") {
      array = configurationMenu[ROLES.manager].filter(item => {
        return item.header === "Claims Operations";
      });
    } else if (managerType === "enrollment") {
      array = configurationMenu[ROLES.manager].filter(item => {
        return item.header === "Enrollment Operations";
      });
    }
    return array;
  }

  setMenu(managerType?) {
    if (managerType) {
      this.menuItem = this.getLinksByType(managerType);
      console.log(this.menuItem);
    } else {
      this.menuItem = this.currentRole
        ? configurationMenu[this.currentRole]
        : [];
    }
  }
}
