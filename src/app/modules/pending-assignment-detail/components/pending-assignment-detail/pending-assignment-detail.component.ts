import { Component, OnInit } from "@angular/core";
import { PendingAssignmentDetailService } from "../../services/pending-assignment-detail.service";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ConfirmationService } from "primeng/api";
import { Router, ActivatedRoute } from "@angular/router";
import { EmrollmentLeadLandingPageService } from "src/app/modules/enrollment-ops/enrollment-lead/enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";
import { ROLES } from "src/app/shared/constants.js";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { Subject } from "rxjs";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Component({
  selector: "app-pending-assignment-detail",
  templateUrl: "./pending-assignment-detail.component.html",
  styleUrls: ["./pending-assignment-detail.component.css"]
})
export class PendingAssignmentDetailComponent implements OnInit {
  routedClaimList = [];
  cols = [
    { field: "userLogInName", header: "Login Name" },
    { field: "userName", header: "User Name" },
    { field: "userRole", header: "Role" },
    { field: "deactivationDate", header: "Deactivation Date" },
    { field: "daysLeftDeactivation", header: "Days Left For Deactivation" },
    { field: "pendCount", header: "Pended Count" },
    { field: "routedInCount", header: "Routed In Count" },
    { field: "assignedCount", header: "Assigned Count" },
    { field: "backlogCount", header: "Backlog Count" },
    { field: "reviewRebuttalCount", header: "Review/Rebuttal Count" },
    { field: "auditRoutedInCount", header: "Auditor Routed In Count" },
    { field: "auditFailedCount", header: "Audit Failed Count" }
  ];
  public isEnrollment: boolean;
  public callService;
  public managrType = "";
  public managerType$: Subject<any>;
  public currentRole: string;
  constructor(
    private secureLocalStorage: CryptoService,
    private authService: AuthenticationService,
    private service: PendingAssignmentDetailService,
    private conirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EmrollmentLeadLandingPageService
  ) {}

  ngOnInit() {
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    if (this.currentRole === ROLES.manager) {
      this.managrType = this.authService.managerType;
      this.setManagerRole();
      this.getManagerValues();
    } else {
      this.isEnrollment = this.activatedRoute.snapshot.data.isEnrollment || false;
      this.callService = this.isEnrollment
        ? this.enrollmentService
        : this.service;
      this.getPendingReason();
    }
  }

  getManagerValues() {
    this.managerType$ = this.authService.managerTypeSubject;
    this.managerType$.subscribe(val => {
      this.managrType = val;
      this.setManagerRole();
    });
  }

  setManagerRole() {
    this.callService =
      this.managrType === "enrollment" ? this.enrollmentService : this.service;
    this.getPendingReason();
  }

  getPendingReason() {
    this.callService.getPendingAssignmentDetails().subscribe(res => {
      this.routedClaimList = res ? res : [];
    });
  }

  navigateToAssignment(rowData) {
    this.conirmationService.confirm({
      message: `Do you want to proceed with${
        this.isEnrollment ? "" : " claims"
      } reassignment?`,
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.router.navigate(["/ClaimReassignment/reassignment"], {
          queryParams: { pendingAssignment: JSON.stringify(rowData) },
          skipLocationChange: true
        });
      }
    });
  }
}
