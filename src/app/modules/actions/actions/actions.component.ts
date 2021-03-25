import { Component, OnInit } from "@angular/core";
import { actions } from "src/app/shared/constants.js";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { ROLES } from "../../../shared/constants.js";

@Component({
  selector: "app-actions",
  templateUrl: "./actions.component.html"
})
export class ActionsComponent implements OnInit {
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
    if (this.currentRole === ROLES.manager) {
      this.managerType = this.authService.managerType;
      this.setMenu(this.managerType);
      this.authService.updateManagerTypeListener().subscribe(type => {
        this.managerType = type;
        this.setMenu(type);
      });
    } else if (this.currentRole) {
      this.setMenu();
    }
  }

  getLinksByType(managerType) {
    let array = [];
    if (managerType === "claims") {
      array = actions[ROLES.manager].filter(item => {
        return item.header === "Claims Operations";
      });
    } else if (managerType === "both") {
      array = actions[ROLES.manager];
    } else if (managerType === "enrollment") {
      array = actions[ROLES.manager].filter(item => {
        return item.header === "Enrollment Operations";
      });
    }
    return array;
  }

  setMenu(managerType?) {
    if (managerType) {
      this.menuItem = this.getLinksByType(managerType);
    } else {
      this.menuItem = this.currentRole ? actions[this.currentRole] : [];
    }
  }
}
