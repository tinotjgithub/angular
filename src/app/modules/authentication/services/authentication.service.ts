import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { Subject, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { ROLES } from "../../../shared/constants.js";
import { MessageService } from "primeng/api";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { HeaderService } from "src/app/services/header/header.service.js";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  detachedWindow: boolean;
  authToken: string;
  roleResponse: any;
  roleId: string;
  authUpdated = new Subject<any>();
  userRoles = new Subject<any[]>();
  userId: any;
  userName: string;
  userDetails: any;
  isAuthenticated: boolean;
  public managerTypeSubject: Subject<any> = new Subject();
  private loggedInManagerTypeSubject: Subject<any> = new Subject();
  public managerType = null;
  public adminType = null;
  private isSSOEnabled = new BehaviorSubject<boolean>(false);
  private entityID: string;

  constructor(
    private http: BaseHttpService,
    private router: Router,
    private notifierService: MessageService,
    private secureLocalStorage: CryptoService,
    private headerService: HeaderService
  ) {
    this.isAuthenticated = this.secureLocalStorage.getItem("authToken")
      ? true
      : false;
  }

  login(param) {
    return this.http.post(param, "auth/token/authenticate");
  }

  getUserDetails() {
    return this.http.get("api/user-management/user/details");
  }

  getUserRoles() {
    this.http.get("auth/token/roles").subscribe(
      data => {
        this.roleResponse = data.roles;
        this.userRoles.next(this.roleResponse);
      },
      error => {
        this.roleResponse = [];
        return;
      }
    );
  }

  setWindowParam(detached: boolean) {
    this.detachedWindow = detached;
  }

  setLogin(loginRes) {
    this.isAuthenticated = loginRes.success;
    this.authToken = loginRes.token;
    this.roleId = loginRes.roleId;
    this.secureLocalStorage.setItem("authToken", this.authToken);
    this.secureLocalStorage.setItem("roleId", loginRes.roleId);
    if (loginRes.roleId === ROLES.admin) {
      this.adminType = "Claim";
    }

    this.getUserDetails().subscribe(
      res => {
        this.userId = res.id;
        this.userName = res.firstName + " " + res.lastName;
        this.authUpdated.next({
          isAuthenticated: this.isAuthenticated,
          authToken: this.authToken,
          roleId: this.roleId,
          userId: this.userId,
          userName: this.userName
        });
        this.userDetails = res;
        if (loginRes.roleId === ROLES.admin) {
          this.adminType = res.userWorkItemTypes
            ? res.userWorkItemTypes.length > 1
              ? "Both"
              : res.userWorkItemTypes.length > 0
              ? res.userWorkItemTypes[0].name
              : "Claim"
            : "Claim";
        } else if (loginRes.roleId === ROLES.manager) {
          this.managerType = res.userWorkItemTypes
            ? res.userWorkItemTypes.length > 1
              ? "both"
              : res.userWorkItemTypes && res.userWorkItemTypes.length > 0
              ? res.userWorkItemTypes[0].name === "Claim"
                ? "claims"
                : "enrollment"
              : ""
            : "";
        }
        this.loggedInManagerTypeSubject.next(this.managerType);
        this.redirectAfterLogin();
      },
      err => {
        this.notifierService.add({
          key: "successKey",
          severity: "warning",
          summary: "Failed getting user details",
          detail: "Something went wrong!. Not able to get user details."
        });
      }
    );
  }

  public redirectAfterLogin() {
    switch (this.roleId) {
      case ROLES.processor:
        this.router.navigateByUrl("ClaimsExaminerQueue");
        break;
      case ROLES.auditor:
        this.router.navigateByUrl("auditor-home");
        break;
      case ROLES.admin:
        this.router.navigateByUrl("ActiveUserSnapshot");
        break;
      case ROLES.lead:
        this.router.navigateByUrl("lead-home");
        break;
      case ROLES.approver:
        this.router.navigateByUrl("ClaimsExaminerQueue");
        break;
      case ROLES.user:
        this.router.navigateByUrl("Dashboard");
        break;
      case ROLES.manager:
        this.router.navigateByUrl("manager-home");
        break;
      case ROLES.enrollmentSpecialist:
        this.router.navigateByUrl("specialist");
        break;
      case ROLES.enrollmentLead:
        this.router.navigateByUrl("enrollment-lead-landing-page");
        break;
      case ROLES.enrollmentAuditor:
        this.router.navigateByUrl("enrollment-auditor");
        break;
      default:
        this.router.navigateByUrl("");
    }
  }

  logout(reset?) {
    if (APP_CONFIG.LOGIN_OPTION === 'saml') {
      localStorage.clear();
      window.open(`${APP_CONFIG.SERVER_API_URL}/saml/logout`, "_self");
    } else {
      this.http.get("auth/logout").subscribe(res => {
        this.resetAndRedirect(reset);
      }, err => {
        console.error(err);
      });
    }
  }

  private resetAndRedirect(reset: any) {
    this.clearSessions();
    this.router.navigateByUrl(reset ? "/?reset=true" : "/?logout=true");
  }

  clearSessions() {
    localStorage.clear();
    this.isAuthenticated = false;
    this.authToken = null;
    this.roleId = null;
    this.userDetails = null;
    this.authUpdated.next({
      isAuthenticated: false,
      authToken: null,
      roleId: null,
      userId: null,
      userName: null
    });
    this.router.navigateByUrl("/");
  }

  forceLogout(payload, loc?) {
    const locationRef = loc || location;
    this.http.post(payload, "auth/token/force-logout").subscribe(
      res => {
        this.notifierService.add({
          key: "successKey",
          severity: "success",
          detail: "Logged out from all devices.",
          summary: "SUCCESS"
        });
        localStorage.clear();
        locationRef.reload();
      },
      err => {
        let message = "Failed to logout.";
        if (err.error && err.error.message) {
          message = err.error.message;
        }
        this.notifierService.add({
          key: "errorKey",
          severity: "error",
          summary: "ERROR",
          detail: message
        });
      }
    );
  }

  isTokenExpired(): boolean {
    let hasTimeExpired = true;
    let date = this.secureLocalStorage.getItem("expiresIn");
    const d = new Date(date);
    if (Object.prototype.toString.call(d) === "[object Date]") {
      // it is a date
      if (isNaN(d.getTime())) {
        date = undefined;
      }
    } else {
      date = undefined;
    }

    if (date && date !== undefined) {
      hasTimeExpired = d.valueOf() <= new Date().valueOf();
    }
    return hasTimeExpired;
  }

  checkIsAuthenticated() {
    if (
      this.secureLocalStorage.getItem("authToken") &&
      this.secureLocalStorage.getItem("roleId")
    ) {
      this.authUpdated.next({
        isAuthenticated: true,
        authToken: this.secureLocalStorage.getItem("authToken"),
        roleId: this.secureLocalStorage.getItem("roleId"),
        userId: this.userId,
        userName: this.userName
      });
      return true;
    } else {
      this.authUpdated.next({
        isAuthenticated: false,
        authToken: null,
        roleId: null,
        userId: null,
        userName: null
      });
      return false;
    }
  }

  authUpdatedListener() {
    return this.authUpdated.asObservable();
  }

  getUserRolesListner() {
    return this.userRoles.asObservable();
  }

  get userRole() {
    return this.roleId;
  }

  get currentUser() {
    return this.userName;
  }

  get currentUserId() {
    return this.userId;
  }

  get currentUserDetails() {
    return this.userDetails;
  }

  forgotPassword(payload) {
    return this.http.post(payload, "auth/token/forgot/password");
  }

  checkResetToken(token) {
    return this.http.get(`auth/token/change/password?token=${token}`);
  }

  resetForgotPassword(payload) {
    return this.http.post(payload, "auth/token/save/password");
  }

  checkRoleEdited() {
    if (
      location.href.indexOf('saml') === -1 && this.router.url.indexOf("change-password") === -1 &&
      (this.authToken !== this.secureLocalStorage.getItem("authToken") || this.roleId !== this.secureLocalStorage.getItem("roleId"))
    ) {
      this.clearSessions();
    }
  }

  updateManagerType(managerType) {
    this.managerType = managerType;
    this.managerTypeSubject.next(managerType);
  } 

  updateManagerTypeListener() {
    return this.managerTypeSubject.asObservable();
  }

  updateLoggedInManagerTypeListener() {
    return this.loggedInManagerTypeSubject.asObservable();
  }

  getUserRolesByLogin() {
    return this.http.get("api/user-management/user/roles");
  }

  getOperationType() {
    return this.http.get("api/user-management/user/work-item-type");
  }

  checkSSO() {
    this.secureLocalStorage.setItem('isReset', true);
    this.http.get("saml/login").subscribe(res => {
      this.secureLocalStorage.setItem('isReset', false);
      if (res && res.entityID) {
        this.isSSOEnabled.next(true);
        this.entityID = res.entityID;
      } else {
        this.isSSOEnabled.next(false);
        this.entityID = "";
      }
    }, err => {
      this.secureLocalStorage.setItem('isReset', false);
      this.isSSOEnabled.next(false);
      this.entityID = '';
    });
  }

  get entityIDVal() {
    return this.entityID;
  }

  get isSSO() {
    return this.isSSOEnabled.asObservable();
  }

  redirectSSO() {
    window.open(`${APP_CONFIG.SERVER_API_URL}/saml/login?idp=${this.entityID}`, "_self");
  }

  getRolesForSaml() {
    return this.http.get('auth/saml/roles');
  }

  samlLogin(roleID) {
    return this.http.get(`auth/saml/authorize?loggedInRoleId=${roleID}`);
  }

  forceLogoutSaml(roleID, loc?) {
    const locationRef = loc || location;
    this.http.get(`auth/saml/force-logout?loggedInRoleId=${roleID}`).subscribe(
      res => {
        this.notifierService.add({
          key: "successKey",
          severity: "success",
          detail: "Logged out from all devices.",
          summary: "SUCCESS"
        });
        localStorage.clear();
        this.router.navigateByUrl('/');
      },
      err => {
        let message = "Failed to logout.";
        if (err.error && err.error.message) {
          message = err.error.message;
        }
        this.notifierService.add({
          key: "errorKey",
          severity: "error",
          summary: "ERROR",
          detail: message
        });
      }
    );
  }

}
