import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ROLES } from "src/app/shared/constants.js";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
@Component({
  selector: "app-active-user-snapshot",
  templateUrl: "./landing-page.component.html"
})
export class LandingPageComponent implements OnInit {
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
