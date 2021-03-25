import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-specialist-dashboard-pop",
  templateUrl: "./specialist-dashboard-pop.component.html",
  styleUrls: ["./specialist-dashboard-pop.component.css"]
})
export class SpecialistDashboardPopComponent implements OnInit {
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
  public addTarget: boolean;

  constructor(
    private enrollmentManagementService: EnrollmentManagementService,
    private targetSettingsBuilder: FormBuilder,
    private notifierService: NotifierService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    const keys = Object.keys(this.editUser);
    const len = keys.length;
    this.editMode = this.editUser && len > 0 ? true : false;
    this.editMode ? this.getGridDetails() : "";
    this.setGridCols();
  }

  getInventoryStatusCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "promtStatus", header: "PROMT Status", visible: true },
      { field: "priority", header: "Priority", visible: true },
      { field: "requestType", header: "Request Type", visible: true },
      // {
      //   field: "enrollmentWorkCategory",
      //   header: "Work Category",
      //   visible: true
      // },
      {
        field: "transactionType",
        header: "Transaction Type",
        visible: true
      },
      {
        field: "receiptDate",
        header: "Receipt Date",
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
        field: "memberGroupID",
        header: "Member Group ID",
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
        field: "memberDOB",
        header: "Member DOB",
        visible: true
      },
      {
        field: "enrollmentSpecialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },

      { field: "userGroupName", header: "User Group Name", visible: true },
      {
        field: "assignmentComments",
        header: "Assignment Comments",
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

  getProductionCountLeadCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      {
        field: "transactionCategory",
        header: "Transaction Category",
        visible: true
      },
      {
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "completionDate",
        header: "Completion Date",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "subscriber Name",
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
      }
    ];
  }

  getProductionCountWrkCols() {
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
        field: "completionDate",
        header: "Completion Date",
        visible: true
      },
      {
        field: "reportDate",
        header: "Report Date",
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
        field: "assignmentComments",
        header: "Assignment Comments",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      }
    ];
  }

  getProductionCountTransCols() {
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
        field: "transactionCategory",
        header: "Transaction Category",
        visible: true
      },
      {
        field: "completionDate",
        header: "Completion Date",
        visible: true
      },
      {
        field: "reportDate",
        header: "Report Date",
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
        field: "assignmentComments",
        header: "Assignment Comments",
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

  setTransCountGridCols() {
    this.cols = [
      { field: "SubscriptionID", header: "Subscription ID", visible: true },
      {
        field: "enrollmentWorkCategory",
        header: "Work Category",
        visible: true
      },
      {
        field: "TransactionCategory",
        header: "Transaction Category",
        visible: true
      },
      {
        field: "SpecialistName",
        header: "Specialist Names",
        visible: true
      },
      {
        field: "CompletionDate",
        header: "Completion Date",
        visible: true
      },
      {
        field: "RecordAge",
        header: "Record Age (In Days)",
        visible: true
      },
      {
        field: "SubscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "MemberID",
        header: "Member ID",
        visible: true
      },
      {
        field: "MemberLastName",
        header: "Member Last Name",
        visible: true
      },
      {
        field: "MemberFirstName",
        header: "Member First Name",
        visible: true
      },
      {
        field: "MemberGroupID",
        header: "Member Group ID",
        visible: true
      },
      {
        field: "UserGroupName",
        header: "User Group Name",
        visible: true
      }
    ];
  }

  getRebuttalStatusCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "memberID", header: "Member ID", visible: true },
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
        field: "rebuttalStatus",
        header: "Rebuttal Status",
        visible: true
      },
      {
        field: "rebuttalLevel",
        header: "Rebuttal Level",
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
        field: "auditorComments",
        header: "Auditor Comments",
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
        field: "rebuttalComment",
        header: "Rebuttal Comment",
        visible: true
      },
      {
        field: "refNumber",
        header: "Reference Number",
        visible: true
      }
    ];
  }

  getQualityScoreCols() {
    this.cols = [
      { field: "slNo", header: "Sl No.", visible: true },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      {
        field: "requestType",
        header: "Request Type",
        visible: true
      },
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
        field: "errorDetails",
        header: "Error Details",
        visible: true
      },
      {
        field: "userName",
        header: "User Name",
        visible: true
      }
    ];
  }

  getAuditTrendCols() {
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
        field: "auditorComments",
        header: "Auditor Comments",
        visible: true
      },
      {
        field: "reportDate",
        header: "Report Date",
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
  getPendRequestAgeLeadCols() {
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
        field: "specialistName",
        header: "Enrollment Specialist Name",
        visible: true
      },
      {
        field: "pendedDate",
        header: "Pend Date",
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
  getInventoryWorkCategoryCols() {
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
        header: "Promt Status",
        visible: true
      },
      {
        field: "reportDate",
        header: "Report Date",
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
        field: "assignmentComments",
        header: "Assignment Comments",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      }
    ];
  }

  setGridCols() {
    if (this.editUser.type === "inventory-status") {
      this.getInventoryStatusCols();
    } else if (this.editUser.type === "open-inventory-by-cat") {
      this.getInventoryWorkCategoryCols();
    } else if (this.editUser.type === "prod-count-trans-cat") {
      this.getProductionCountTransCols();
    } else if (this.editUser.type === "production-count-by-work-category") {
      this.getProductionCountWrkCols();
    } else if (this.editUser.type === "prod-count-trans-cat-lead") {
      this.getProductionCountLeadCols();
    } else if (this.editUser.type === "pend-req-age-lead") {
      this.getPendRequestAgeLeadCols();
    } else if (this.editUser.type === "audit-transaction-trend") {
      this.getAuditTrendCols();
    } else if (this.editUser.type === "my-quality-score") {
      this.getQualityScoreCols();
    } else if (this.editUser.type === "rebuttal-status") {
      this.getRebuttalStatusCols();
    }
  }

  getGridDetails() {
    this.enrollmentManagementService.getGridView(this.editUser);
    this.gridData = this.enrollmentManagementService.gridViewResponse;
    this.gridData = [];
    this.enrollmentManagementService
      .getGridViewListner()
      .subscribe((res: any) => {
        if (res) {
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }

  getReportName() {
    let reportName = "";
    if (this.editUser.type === "inventory-status") {
      reportName = "Inventory By Status-";
    } else if (this.editUser.type === "pend-req-age-lead") {
      reportName = "Pended Records Age";
    } else if (this.editUser.type === "prod-count-trans-cat") {
      reportName = "Production Count By Transaction Category-";
    } else if (this.editUser.type === "production-count-by-work-category") {
      reportName = "Production Count By Work Category-";
    } else if (this.editUser.type === "open-inventory-by-cat") {
      reportName = "Open Inventory By Category-";
    } else if (this.editUser.type === "prod-count-trans-cat-lead") {
      reportName = "Production Count By Category";
    } else if (this.editUser.type === "audit-transaction-trend") {
      reportName = "Audit Transaction Trend";
    } else if (this.editUser.type === "my-quality-score") {
      reportName = "My Quality Score";
    } else if (this.editUser.type === "rebuttal-status") {
      reportName = "Rebuttal Status";
    }
    return reportName;
  }

  exportExcel() {
    const reportName = this.getReportName();
    this.enrollmentManagementService
      .getOpenInvReport(this.editUser)
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
          window.navigator.msSaveBlob(blob, reportName + dateString + ".xlsx");
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", reportName + dateString + ".xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }
}
