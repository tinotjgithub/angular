import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentLeadDashboardService } from "./../enrollment-lead-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-enrollment-lead-dashboard-popup",
  templateUrl: "./enrollment-lead-dashboard-popup.component.html",
  styleUrls: ["./enrollment-lead-dashboard-popup.component.css"]
})
export class EnrollmentLeadDashboardPopupComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public editUser: any;
  public gridData: any[];
  targetSLA: number;
  targetSettingsFetchResponse: any;
  cols: { field: string; header: string; visible: boolean }[];
  text: string;
  currentId: string;
  public editMode: boolean;
  disabled = true;
  public reportName = "";
  public addTarget: boolean;

  constructor(
    private enrollmentLeadDashboardService: EnrollmentLeadDashboardService,
    private targetSettingsBuilder: FormBuilder,
    private notifierService: NotifierService,
    public datePipe: DatePipe
  ) {}

  // this.columns = [
  //   ...this.adminColumns,
  //   { field: "proficiency", header: "Proficiency" }
  // ];

  ngOnInit() {
    const keys = Object.keys(this.editUser);
    const len = keys.length;
    this.editMode = this.editUser && len > 0 ? true : false;
    this.editMode ? this.getGridViewEnrollmentLead() : "";
    this.setCols();
  }

  setCols() {
    this.editUser.type === "prod-count-sts"
      ? this.setProdCountGridCols()
      : this.editUser.type === "prod-count-spl"
      ? this.setProdCountSplGridCols()
      : this.editUser.type === "audit-by-work-cat"
      ? this.setAuditByWorkCatCols()
      : this.editUser.type === "enr-audit-summary"
      ? this.setEnrollmentAuditSummaryCols()
      : this.editUser.type === "rebuttal-status"
      ? this.setEnrollmentRebuttalStatusCols()
      : "";
  }

  setEnrollmentRebuttalStatusCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },

      { field: "rebuttalStatus", header: "Rebuttal Status", visible: true },
      { field: "rebuttalDate", header: "Rebuttal Date", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },

      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },

      {
        field: "auditorComments",
        header: "Auditor Comments",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberID",
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
        field: "memberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "rebuttalComments",
        header: "Rebuttal Comments",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      },
      {
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }

  setEnrollmentAuditSummaryCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },
      {
        field: "promtStatus",
        header: "PROMT Status",
        visible: true
      },
      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberID",
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
        field: "memberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      },
      {
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }
  setAuditByWorkCatCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "auditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },
      {
        field: "auditStatus",
        header: "Audit Status",
        visible: true
      },
      {
        field: "auditorComments",
        header: "Auditor Comments",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberID",
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
        field: "memberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      }
    ];
  }
  setProdCountSplGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "promtStatus",
        header: "PROMT Status",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "reportDate", header: "Report Date", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberID",
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
        field: "memberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      },
      {
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }

  setProdCountGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "promtStatus",
        header: "PROMT Status",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },

      { field: "reportDate", header: "Report Date", visible: true },

      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberID",
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
        field: "memberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      },
      {
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }

  getGridViewEnrollmentLead() {
    this.enrollmentLeadDashboardService.getGridViewEnrollmentLead(
      this.editUser
    );
    this.gridData = this.enrollmentLeadDashboardService.enrollmentLeadGridViewResponse;
    this.gridData = [];
    this.enrollmentLeadDashboardService
      .getGridViewEnrollmentLeadListner()
      .subscribe((res: any) => {
        if (res) {
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }

  getReportNames() {
    this.reportName =
      this.editUser.type === "prod-count-sts"
        ? "Production Count By Status"
        : this.editUser.type === "prod-count-spl"
        ? "Production Count By Specialist"
        : this.editUser.type === "audit-by-work-cat"
        ? "Audit Count By Work Category"
        : this.editUser.type === "enr-audit-summary"
        ? "Enrollment Audit Summary By Auditor"
        : this.editUser.type === "rebuttal-status"
        ? "Rebuttal Status"
        : "";
  }

  exportExcel() {
    this.getReportNames();
    this.enrollmentLeadDashboardService
      .getReportEnrollmentLead(this.editUser)
      .subscribe(res => {
        this.notifierService.throwNotification({
          type: "info",
          message: "Report is being generated. Please wait."
        });
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(
            blob,
            this.reportName + dateString + ".xlsx"
          );
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              this.reportName + dateString + ".xlsx"
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }
}
