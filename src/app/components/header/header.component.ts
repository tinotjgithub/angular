import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { HeaderService } from "src/app/services/header/header.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ROLES } from "../../shared/constants.js";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from "@angular/router";
import { DrawClaim } from "src/app/services/task-management/models/DrawClaim.js";
import { ConfirmationService, MenuItem } from "primeng/api";
import { BnNgIdleService } from "bn-ng-idle";
import { INACTIVE_LOGOUT_LIMIT } from "../../../app/shared/constants.js";
import { filter } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { ReportService } from "src/app/services/report/report.service";
import { APP_CONFIG } from "src/app/services/config/config.service";
import { ConfigurationService } from "src/app/services/configuration/configuration.service.js";
import { Breadcrumb } from "../Breadcrumb.js";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  providers: [ConfirmationService]
})
export class HeaderComponent implements OnInit, AfterContentChecked {
  claimDetails: any;
  auditClaim: any;
  items: Breadcrumb[];
  userName: string;
  role: string;
  public changePassword: boolean;
  public hrpConnector: boolean;
  public fileLoading: boolean;
  public radioValue: boolean = true;
  loggedInManagerType: any;
  public showChangePassword: boolean;
  public notificationList: any[];
  constructor(
    private headerService: HeaderService,
    private authService: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private bnIdle: BnNgIdleService,
    private activatedRoute: ActivatedRoute,
    private secureLocalStorage: CryptoService,
    private reportService: ReportService,
    private configurationService: ConfigurationService
  ) {}

  ngAfterContentChecked() {
    if (!this.items) {
      this.items = this.createBreadcrumbs(this.activatedRoute.root);
    }
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.items = this.createBreadcrumbs(this.activatedRoute.root);
      });
    this.headerService.$claimDetails.subscribe((claimDetails: any) => {
      this.claimDetails = claimDetails;
    });
    this.headerService.$auditClaimDetails.subscribe(val => {
      this.auditClaim = val;
    });
    this.showChangePassword = APP_CONFIG.LOGIN_OPTION !== "saml";
    this.userName = this.authService.currentUser;
    this.authService.authUpdatedListener().subscribe(data => {
      this.userName = data.userName;
    });

    this.role =
      this.secureLocalStorage.getItem("roleId") !== null &&
      this.secureLocalStorage.getItem("roleId") !== ""
        ? this.secureLocalStorage.getItem("roleId").toUpperCase()
        : "";

    this.bnIdle
      .startWatching(INACTIVE_LOGOUT_LIMIT)
      .subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          this.authService.logout();
          this.bnIdle.stopTimer();
        }
      });

    if (this.role === ROLES.manager.toUpperCase()) {
      this.loggedInManagerType = this.authService.managerType;
      this.authService
        .updateLoggedInManagerTypeListener()
        .subscribe(managerType => {
          this.loggedInManagerType = managerType;
        });
    }
    this.getNotifications();
  }

  menuOpen() {
    this.headerService.setSideMenuAction(true);
  }

  logout() {
    if (
      this.auditClaim &&
      (this.auditClaim.claimId || this.auditClaim.subscriptionId)
    ) {
      this.confirmationService.confirm({
        message: `Please ${
          this.auditClaim.auditFlowId ? "Submit" : "Save/Submit"
        } the ${
          this.auditClaim.subscriptionId ? "transaction" : "claim"
        } before you logout`,
        acceptLabel: "OK",
        rejectVisible: false
      });
    } else if (this.checkForNoTask()) {
      this.confirmationService.confirm({
        message: "You want to Logout",
        acceptLabel: "Yes",
        rejectVisible: true,
        rejectLabel: "Cancel",
        accept: () => {
          this.authService.logout();
        }
      });
    } else {
      this.confirmationService.confirm({
        message: "Please Complete/Pend/Route the task before you logout",
        acceptLabel: "OK",
        rejectVisible: false
      });
    }
  }

  private checkForNoTask() {
    const idVal = this.claimDetails
      ? this.claimDetails.claimId || this.claimDetails.subscriptionId
      : null;
    return (
      !this.claimDetails ||
      (this.claimDetails &&
        (idVal === null || idVal === undefined) &&
        this.claimDetails &&
        (this.claimDetails.taskAssignmentId === null ||
          this.claimDetails.taskAssignmentId === undefined))
    );
  }

  navigateToRoleBasedHome() {
    const roleId = this.secureLocalStorage.getItem("roleId");
    switch (roleId) {
      case ROLES.processor:
        this.router.navigateByUrl("ClaimsExaminerQueue");
        break;
      case ROLES.auditor:
        this.router.navigateByUrl("auditor-home");
        break;
      case ROLES.admin:
        this.router.navigateByUrl("ActiveUserSnapshot");
        break;
      case ROLES.managers:
        this.router.navigateByUrl("manager-home");
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
      case ROLES.enrollmentSpecialist:
        this.router.navigateByUrl("specialist");
        break;
      default:
        this.router.navigateByUrl("");
    }
  }

  public createBreadcrumbs(
    route: any,
    url: string = "#",
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: any[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join("/");
      if (routeURL !== "") {
        url += `/${routeURL}`;
      }

      const labels: Breadcrumb[] = child.snapshot.data[`breadcrumb`];
      if (!isNullOrUndefined(labels)) {
        labels.forEach((item, i) => {
          const {
            label,
            routerLink,
            target,
            queryParams,
            updateParam,
            onlyParam
          } = item;
          let processedParams = queryParams;
          let processedLabel = label;
          if (updateParam) {
            processedLabel = child.snapshot.queryParams[updateParam];
          }
          if (updateParam || onlyParam) {
            processedParams = child.snapshot.queryParams;
          }
          breadcrumbs.push({
            label: processedLabel,
            routerLink,
            target,
            queryParams: processedParams
          });
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  downloadConnector() {
    const fileName = "HRP-Connector.zip";
    this.fileLoading = true;
    this.reportService.downloadAttachment().subscribe(
      res => {
        this.fileLoading = false;
        const responseBody = res.body;
        const blob = new Blob([responseBody]);
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      },
      err => {
        this.fileLoading = false;
      }
    );
  }

  setToggleState(managerType) {
    this.authService.updateManagerType(managerType);
  }

  getNotifications() {
    this.notificationList = [];
    if (this.role !== "ADMINISTRATOR") {
      this.configurationService.getNotificationForBell().subscribe(res => {
        this.notificationList = res || [];
      });
    }
  }

  checkForNewNotification() {
    const filtered = this.notificationList.filter(n => !n.viewedStatus);
    return filtered.length > 0;
  }

  updateNotification() {
    if (this.checkForNewNotification()) {
      const filtered = this.notificationList.filter(n => !n.viewedStatus);
      const payload = {
        notificationIds: filtered.map(n => n.id)
      };
      this.configurationService
        .updateNotification(payload)
        .subscribe(res => {});
    }
  }
}
