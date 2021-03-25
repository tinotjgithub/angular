import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentManagerDashboardService } from "./../enrollment-manager-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-enrollment-manager-dashboard-pop-up",
  templateUrl: "./enrollment-manager-dashboard-pop-up.component.html",
  styleUrls: ["./enrollment-manager-dashboard-pop-up.component.css"]
})
export class EnrollmentManagerDashboardPopUpComponent implements OnInit {
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
    private enrollmentManagerDashboardService: EnrollmentManagerDashboardService,
    private targetSettingsBuilder: FormBuilder,
    private notifierService: NotifierService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    const keys = Object.keys(this.editUser);
    const len = keys.length;
    this.editMode = this.editUser && len > 0 ? true : false;
    this.editMode ? this.getGridViewEnrollmentManager() : "";
    this.setCols();
  }

  setCols() {
    this.editUser.type === "req-count-by-grp-sts"
      ? this.setReqCountGrpStsGridCols()
      : this.editUser.type === "request-count-wrk-cat"
      ? this.setRequestCountByCatGridCols()
      : this.editUser.type === "audit-sampling-by-audit"
      ? this.setAuditSamplingAuditGridCols()
      : this.editUser.type === "open-inventory-sla-days"
      ? this.setOpenInventorySlaGridCols()
      : this.editUser.type === "open-inv-vol-age"
      ? this.setOpenInvVolAgeGridCols()
      : this.editUser.type === "open-inv-age-wrk-cat"
      ? this.setOpenInvAgeWrkCatGridCols()
      : this.editUser.type === "transaction-processed-vs-audited" &&
        this.editUser.transactionType === "Not Audited"
      ? this.setTransProcessedAuditedNotAuditedGridCols()
      : this.editUser.type === "transaction-processed-vs-audited" &&
        this.editUser.transactionType === "Audited"
      ? this.setTransProcessedAuditedAuditedGridCols()
      : this.editUser.type === "audit-sts-lead"
      ? this.setAuditStatusLeadGridCols()
      : this.editUser.type === "audit-sts-specialist"
      ? this.setAuditStatusSpecialistGridCols()
      : this.editUser.type === "rebuttal-failed-vs-accepted"
      ? this.setRebuttalFailedVsAcceptedGridCols()
      : this.editUser.type === "assigned-vs-audited"
      ? this.setAssignedVsAuditedGridCols()
      : this.editUser.type === "audit-sampling-work-category"
      ? this.setAuditSamplingCategoryGridCols()
      : this.editUser.type === "open-inv-by-WorkCategory"
      ? this.setOpenInventoryCategoryGridCols()
      : "";
  }

  setTransProcessedAuditedAuditedGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "audited",
        header: "Audited",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },

      { field: "auditorComments", header: "Auditor Comments", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
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

  setTransProcessedAuditedNotAuditedGridCols() {
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
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
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

  setOpenInvAgeWrkCatGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "memberID",
        header: "Member ID",
        visible: true
      },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },
      { field: "reportDate", header: "Report Date", visible: true },
      { field: "leadName", header: "Lead Name", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
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
        field: "queueName",
        header: "Queue Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      }
    ];
  }

  setOpenInventoryCategoryGridCols() {
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
      { field: "reportDate", header: "Report Date", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      { field: "leadName", header: "Lead Name", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
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

  setOpenInvVolAgeGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      { field: "promtStatus", header: "PROMT Status", visible: true },
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
      { field: "refNumber", header: "Reference Number", visible: true }
    ];
  }
  setAuditStatusLeadGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "priority", header: "Priority", visible: true },

      { field: "leadName", header: "Lead Name", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
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
      { field: "refNumber", header: "Reference Number", visible: true }
    ];
  }

  setAuditSamplingCategoryGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "priority", header: "Priority", visible: true },
      { field: "processedDate", header: "Processed Date", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
     
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
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

  setAssignedVsAuditedGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "auditStatus",
        header: "Assigned/Complete",
        visible: true
      },
      { field: "priority", header: "Priority", visible: true },
      { field: "processedDate", header: "Processed Date", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
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

  setRebuttalFailedVsAcceptedGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "rebuttalStatus", header: "Rebuttal Status", visible: true },
      { field: "rebuttalLevel", header: "Rebuttal Level", visible: true },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "leadName",
        header: "Lead Name",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
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

  setAuditStatusSpecialistGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "auditorName", header: "Auditor Name", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "leadName",
        header: "Lead Name",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
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

  setOpenInventorySlaGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },

      { field: "nearingSlaDays", header: "Nearing SLA Days", visible: true },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "promtStatus",
        header: "PROMT Status",
        visible: true
      },
      { field: "processedDate", header: "Processed Date", visible: true },
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
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }

  setAuditSamplingAuditGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "samplingMethod", header: "Sampling Method", visible: true },
      { field: "processedDate", header: "Processed Date", visible: true },
      { field: "priority", header: "Priority", visible: true },
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
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
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

  setRequestCountByCatGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      { field: "priority", header: "Priority", visible: true },
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
      }
    ];
  }

  setReqCountGrpStsGridCols() {
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
        field: "queueName",
        header: "Queue Name",
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

  getGridViewEnrollmentManager() {
    this.enrollmentManagerDashboardService.getGridViewEnrollmentManager(
      this.editUser
    );
    this.gridData = this.enrollmentManagerDashboardService.enrollmentManagerGridViewResponse;
    this.gridData = [];
    this.enrollmentManagerDashboardService
      .getGridViewEnrollmentManagerListner()
      .subscribe((res: any) => {
        if (res) {
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }

  getReportNames() {
    this.reportName =
      this.editUser.type === "req-count-by-grp-sts"
        ? "Request Count By Queue And Status"
        : this.editUser.type === "request-count-wrk-cat"
        ? "Request Count By Work Category"
        : this.editUser.type === "open-inv-vol-age"
        ? "Open Inventory Volume By Age"
        : this.editUser.type === "transaction-processed-vs-audited"
        ? "Transaction Processed VS Audited"
        : this.editUser.type === "audit-sts-lead"
        ? "Audit Status By Lead"
        : this.editUser.type === "audit-sts-specialist"
        ? "Audit Status By Specialist"
        : this.editUser.type === "rebuttal-failed-vs-accepted"
        ? "Rebuttal Failed Vs Accepted By Auditor"
        : this.editUser.type === "assigned-vs-audited"
        ? "Assigned Vs Audited by Auditor"
        : this.editUser.type === "audit-sampling-work-category"
        ? "Audit Sampling By Work Category"
        : this.editUser.type === "open-inv-by-WorkCategory"
        ? "Open Inventory By Work Category"
        : this.editUser.type === "audit-sampling-by-audit"
        ? "Audit Sampling By Audit Method"
        : this.editUser.type === "open-inventory-sla-days"
        ? "Open Inventory Nearing SLA Days"
        : this.editUser.type === "open-inv-age-wrk-cat"
        ? "Open Inventory Age By Work Category"
        : "";
  }

  exportExcel() {
    this.getReportNames();
    this.enrollmentManagerDashboardService
      .getReportEnrollmentManager(this.editUser)
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
