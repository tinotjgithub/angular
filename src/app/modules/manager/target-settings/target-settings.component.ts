import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ROLES } from "../../../shared/constants.js";

@Component({
  selector: "app-target-settings",
  templateUrl: "./target-settings.component.html"
})
export class TargetSettingsComponent implements OnInit {
  managerType: any;
  public currentRole: string;
  public isManager = false;
  ngOnInit() {
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    if (this.currentRole) {
      if (this.currentRole === ROLES.manager) {
        this.isManager = true;
        this.managerType = this.authService.managerType;
        this.authService.updateManagerTypeListener().subscribe(type => {
          this.managerType = type;
        });
      } else {
        this.isManager = false;
      }
    }
  }
  constructor(
    private authService: AuthenticationService,
    private secureLocalStorage: CryptoService
  ) {}
}
