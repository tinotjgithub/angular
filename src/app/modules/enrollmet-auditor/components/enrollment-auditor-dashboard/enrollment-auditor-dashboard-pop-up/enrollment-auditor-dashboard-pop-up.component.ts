import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-enrollment-auditor-dashboard-pop-up",
  templateUrl: "./enrollment-auditor-dashboard-pop-up.component.html",
  styleUrls: ["./enrollment-auditor-dashboard-pop-up.component.css"]
})
export class EnrollmentAuditorDashboardPopUpComponent implements OnInit {
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
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
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
    this.editUser.type === "audit-summary-audit-status" &&
    this.editUser.mode === "Audit Passed"
      ? this.setAuditStsPassedGridCols()
      : this.editUser.type === "audit-summary-audit-status" &&
        (this.editUser.mode === "Audit Failed" ||
          this.editUser.mode === "Transaction Count Mismatch")
      ? this.setAuditStsFailedGridCols()
      : this.editUser.type === "audit-count-by-work-category"
      ? this.setAuditCountWorkCategoryGridCols()
      : this.editUser.type === "rebuttal-status"
      ? this.setRebuttalStatusGridCols()
      : this.editUser.type === "audit-sts-specialist"
      ? this.setAuditStatusSpecialistGridCols()
      : this.editUser.type === "audit-sampling-audit-method"
      ? this.setAuditSamplingAuditMethodGridCols()
      : this.editUser.type === "processed-vs-audited" &&
        this.editUser.auditType === "Audited"
      ? this.setAuditedProcessedVsAuditedGridCols()
      : this.editUser.type === "processed-vs-audited" &&
        this.editUser.auditType === "Not Audited"
      ? this.setNotAuditedProcessedVsAuditedGridCols()
      : this.editUser.type === "audit-sampling-work-category"
      ? this.setAuditSamplingWrkCategoryGridCols()
      : this.editUser.type === "audit-sampling-audit-status" &&
        this.editUser.action === "PASSED"
      ? this.setAuditSamplingAuditPassedStatusGridCols()
      : this.editUser.type === "audit-sampling-audit-status" &&
        (this.editUser.action === "TRANSACTION MISMATCH" ||
          this.editUser.action === "FAILED")
      ? this.setAuditSamplingAuditFailedStatusGridCols()
      : this.editUser.type === "audit-sampling-benefit-plan"
      ? this.setAuditSamplingBenefitPlanGridCols()
      : "";
  }

  setAuditSamplingAuditPassedStatusGridCols() {
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
        field: "priority",
        header: "Priority",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "memberLastName", header: "Member Last Name", visible: true },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      { field: "memberGroupID", header: "Member Group ID", visible: true },
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

  setAuditSamplingBenefitPlanGridCols() {
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
        field: "priority",
        header: "Priority",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      { field: "auditorComments", header: "Auditor Comments", visible: true },
      { field: "benefitPlanName", header: "Benefit Plan Name", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      { field: "memberLastName", header: "Member Last Name", visible: true },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      { field: "memberGroupID", header: "Member Group ID", visible: true },
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

  setAuditSamplingAuditFailedStatusGridCols() {
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
        field: "priority",
        header: "Priority",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
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
      { field: "memberLastName", header: "Member Last Name", visible: true },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      { field: "memberGroupID", header: "Member Group ID", visible: true },
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

  setAuditSamplingWrkCategoryGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      { field: "auditDate", header: "Audit Date", visible: true },
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
      { field: "memberGroupID", header: "Member Group ID", visible: true },
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

  setAuditedProcessedVsAuditedGridCols() {
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
        field: "audited",
        header: "Audited",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
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

  setNotAuditedProcessedVsAuditedGridCols() {
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
      { field: "specialistName", header: "Specialist Name", visible: true },
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

  setAuditSamplingAuditMethodGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "samplingMethod", header: "Sampling Method", visible: true },
      { field: "priority", header: "Priority", visible: true },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
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

  setAuditStatusSpecialistGridCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },
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

  setRebuttalStatusGridCols() {
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
      { field: "rebuttalStatus", header: "Rebuttal Status", visible: true },
      {
        field: "rebuttalLevel",
        header: "Rebuttal Level",
        visible: true
      },
      {
        field: "priority",
        header: "Priority",
        visible: true
      },
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
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      {
        field: "auditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "auditorComments",
        header: "Auditor Comments",
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
        field: "rebuttalComment",
        header: "Rebuttal Comment",
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

  setAuditCountWorkCategoryGridCols() {
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
        field: "priority",
        header: "Priority",
        visible: true
      },
      { field: "processedDate", header: "Processed Date", visible: true },
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
  setAuditStsFailedGridCols() {
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
      { field: "processedDate", header: "Processed Date", visible: true },
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

  setAuditStsPassedGridCols() {
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
        field: "priority",
        header: "Priority",
        visible: true
      },
      {
        field: "auditStatus",
        header: "Audit Status",
        visible: true
      },

      { field: "auditDate", header: "Audit Date", visible: true },

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

  getGridViewEnrollmentManager() {
    this.enrollmentAuditorDashboardService.getGridViewEnrollmentManager(
      this.editUser
    );
    this.gridData = this.enrollmentAuditorDashboardService.enrollmentManagerGridViewResponse;
    this.gridData = [];
    this.enrollmentAuditorDashboardService
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
      this.editUser.type === "audit-summary-audit-status"
        ? "Audit Summary by Audit Status"
        : this.editUser.type === "audit-count-by-work-category"
        ? "Audit Count By Work Category"
        : this.editUser.type === "rebuttal-status"
        ? "Rebuttal Status"
        : this.editUser.type === "processed-vs-audited"
        ? "Processed Vs Audited"
        : this.editUser.type === "audit-sts-specialist"
        ? "Audit Status By Specialist"
        : this.editUser.type === "audit-sampling-audit-method"
        ? "Audit Sampling By Audit Method"
        : this.editUser.type === "audit-sampling-work-category"
        ? "Audit Sampling By Work Category"
        : this.editUser.type === "audit-sampling-audit-status"
        ? "Audit Sampling By Audit Status"
        : this.editUser.type === "audit-sampling-benefit-plan"
        ? "Audit Sampling By Benefit Plan"
        : "";
  }

  exportExcel() {
    this.getReportNames();
    this.enrollmentAuditorDashboardService
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
