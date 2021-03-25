import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmrollmentLeadLandingPageService } from "../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";

@Component({
  selector: "app-audit-failed",
  templateUrl: "./audit-failed.component.html",
  styleUrls: ["./audit-failed.component.css"]
})
export class AuditFailedComponent implements OnInit {
  public type: string;
  public cols: any[];
  public gridData: any[];
  public name: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EmrollmentLeadLandingPageService
  ) {}

  ngOnInit() {
    this.name = "audit-failed";
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.type === "Reconciliation" ? this.setColsRecon() : this.setCols();
    this.getData();
  }

  private setColsRecon() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "auditDate", header: "Audit Date", visible: true },
      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },
      {
        field: "auditErrorDetails",
        header: "Audit Error Details",
        visible: true
      },

      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberGroupName",
        header: "Member Group Name",
        visible: true
      },
      {
        field: "memberId",
        header: "Member ID",
        visible: true
      },
      {
        field: "memberLastName",
        header: "Member Last Name",
        visible: true
      },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      {
        field: "memberDob",
        header: "Member DOB",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      }
    ];
  }

  private setCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "transactionType", header: "Transaction Type", visible: true },

      { field: "auditDate", header: "Audit Date", visible: true },
      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },
      {
        field: "auditErrorDetails",
        header: "Audit Error Details",
        visible: true
      },

      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberGroupName",
        header: "Member Group Name",
        visible: true
      },
      {
        field: "memberId",
        header: "Member ID",
        visible: true
      },
      {
        field: "memberLastName",
        header: "Member Last Name",
        visible: true
      },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      {
        field: "memberDob",
        header: "Member DOB",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      }
    ];
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList("audit-failed", this.type).subscribe(res => {
      this.gridData = res;
    });
  }
}
