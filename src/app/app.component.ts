import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MessageService } from "primeng/api";
import { MenuItem } from "primeng/api";
import { filter } from "rxjs/operators";
import { AuthenticationService } from "./modules/authentication/services/authentication.service";
import { NotifierService } from "./services/notifier.service";
import { CryptoService } from "./services/crypto-service/crypto.service";
import { APP_CONFIG } from './services/config/config.service';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [MessageService]
})
export class AppComponent implements OnInit, AfterViewChecked {
  items: MenuItem[] = [{ label: "Home" }];
  title = "work-assignment-tool";
  isAuthenticated: boolean;
  clicked = false;
  detached: any;
  role: string;
  userName: string;
  public isUserActionEnabled: boolean;
  public changePassword: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private cdRef: ChangeDetectorRef,
    private secureLocalStorage: CryptoService
  ) {}

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isUserActionEnabled =
          this.secureLocalStorage.getItem("roleId") &&
          this.secureLocalStorage.getItem("roleId") === "Administrator";
      });
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.authService.authUpdatedListener().subscribe(data => {
      this.isAuthenticated = data.isAuthenticated;
      this.role = data.roleId;
    });
    if (!this.isAuthenticated) {
      if (APP_CONFIG.LOGIN_OPTION === 'saml') {
        // this.checkAndNavigateToSSO();
      } else if (
        this.router.url !== "/" &&
        this.router.url.indexOf("change-password") === -1 &&
        this.router.url.indexOf("saml") === -1
      ) {
        this.router.navigate(["/"]);
      }
    } else {
      this.authService.setLogin({
        success: true,
        token: this.secureLocalStorage.getItem("authToken"),
        roleId: this.secureLocalStorage.getItem("roleId")
      });
      this.isUserActionEnabled =
        this.secureLocalStorage.getItem("roleId") &&
        this.secureLocalStorage.getItem("roleId") === "Administrator";
    }
    // this.authService.checkSSO();
    this.notifierService.getNotifierListener().subscribe(res => {
      if (res.type === "error") {
        this.showError(res.message, "Error");
      }
      if (res.type === "success") {
        this.showSuccess(res.message, "Success");
      }
      if (res.type === "warning") {
        this.showWarning(res.message, "Warning");
      }
      if (res.type === "info") {
        this.showInfo(res.message, "Info");
      }
    });

    this.notifierService.getNotifierAllListener().subscribe((res: any[]) => {
      this.messageService.addAll(res);
    });

    this.userName = this.authService.currentUser;
    this.authService.authUpdatedListener().subscribe(data => {
      this.userName = data.userName;
    });

    this.role =
      this.secureLocalStorage.getItem("roleId") !== null &&
      this.secureLocalStorage.getItem("roleId") !== ""
        ? this.secureLocalStorage.getItem("roleId").toUpperCase()
        : "";
  }
  private checkAndNavigateToSSO() {
    if (String(location.href).indexOf('saml') === -1) {
      window.open(`${APP_CONFIG.SERVER_API_URL}/saml/login?idp=${APP_CONFIG.ENTITY_ID}`, "_self");
    }
  }

  showError(message: string, header: string) {
    this.messageService.add({
      key: "errorKey",
      severity: "error",
      summary: header,
      detail: message
    });
  }

  showSuccess(message: string, header: string) {
    this.messageService.add({
      key: "successKey",
      severity: "success",
      summary: header,
      detail: message
    });
  }

  showWarning(message: string, header: string) {
    this.messageService.add({
      key: "warnKey",
      severity: "warn",
      summary: header,
      detail: message
    });
  }

  showInfo(message: string, header: string) {
    this.messageService.add({
      key: "infoKey",
      severity: "info",
      summary: header,
      detail: message
    });
  }

  showFailure(message: string, header: string) {
    this.messageService.add({
      key: "custom",
      severity: "warn",
      summary: header,
      detail: message
    });
  }

  menuClickedEvent(clicked) {
    this.clicked = clicked;
  }

  toggleChangePwd() {
    this.changePassword = !this.changePassword;
  }

  resetSuccess(event) {
    if (event) {
      this.changePassword = false;
    }
  }
}
