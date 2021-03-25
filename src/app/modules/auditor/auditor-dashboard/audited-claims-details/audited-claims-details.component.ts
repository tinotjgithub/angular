import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuditDashboardService } from "./../audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-audited-claims-details",
  templateUrl: "./audited-claims-details.component.html",
  styleUrls: ["./audited-claims-details.component.css"]
})
export class AuditedClaimsDetailsComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public editUser: any;
  public data: any[];
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
    private auditDashboardService: AuditDashboardService,
    private targetSettingsBuilder: FormBuilder,
    private notifierService: NotifierService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    var keys = Object.keys(this.editUser);
    var len = keys.length;
    this.editMode = this.editUser && len > 0 ? true : false;
    this.editMode ? this.auditClaimsDetails() : "";
    if (this.editUser.type === "audit-claims-summary") {
      this.editUser.status === "Audit Passed"
        ? this.setSummaryPassedCols()
        : this.setSummaryFailedCols;
    } else if (this.editUser.type === "claims-audited-queue") {
      this.setAuditQueueCols();
    } else {
      this.setAuditTypeStatusCols();
    }
  }

  setAuditTypeStatusCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
      {
        field: "claimQueueName",
        header: "Queue Name",
        visible: true
      },
      {
        field: "examinerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "auditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "paymentStatus",
        header: "Payment Status",
        visible: true
      },
      {
        field: "claimStatus",
        header: "Claim Status",
        visible: true
      },
      {
        field: "billedAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      {
        field: "allowedAmount",
        header: "Allowed Amount($)",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      }
    ];
  }
  setAuditQueueCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
      {
        field: "claimQueueName",
        header: "Queue Name",
        visible: true
      },
      {
        field: "examinerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "auditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "claimType",
        header: "Claim Type",
        visible: true
      },
      {
        field: "claimStatus",
        header: "Claim Status",
        visible: true
      },
      {
        field: "billedAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      {
        field: "allowedAmount",
        header: "Allowed Amount($)",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      }
    ];
  }

  setSummaryFailedCols() {
    this.cols = [
      { field: "ClaimsID", header: "Claim ID", visible: true },
      {
        field: "ClaimType",
        header: "Claim Type",
        visible: true
      },
      { field: "AuditStatus", header: "Audit Status", visible: true },
      { field: "AuditorName", header: "Auditor Name", visible: true },
      {
        field: "ExaminerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "AuditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "ErrorType",
        header: "Error Type",
        visible: true
      },
      {
        field: "FinancialImpact",
        header: "Financial Impact",
        visible: true
      },
      {
        field: "Amount",
        header: "Amount ($)",
        visible: true
      },
      {
        field: "ProcessedDate",
        header: "Processed Date",
        visible: true
      }
    ];
  }

  setSummaryPassedCols() {
    this.cols = [
      { field: "ClaimsID", header: "Claim ID", visible: true },
      { field: "AuditStatus", header: "Audit Status", visible: true },
      { field: "AuditorName", header: "Auditor Name", visible: true },
      {
        field: "ExaminerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "AuditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "ClaimType",
        header: "Claim Type",
        visible: true
      },
      {
        field: "ClaimStatus",
        header: "Claim Status",
        visible: true
      },
      {
        field: "BilledAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "PaidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      {
        field: "AllowedAmount",
        header: "Allowed Amount($)",
        visible: true
      },
      {
        field: "ProcessedDate",
        header: "Processed Date",
        visible: true
      }
    ];
  }

  getPayload() {
    let payload;
    if (this.editUser.type === "audit-claims-summary") {
      payload = {
        count: this.editUser.count,
        status: this.editUser.status,
        date: this.editUser.date
      };
    } else if (this.editUser.type === "claims-audited-queue") {
      payload = {
        queueName: this.editUser.queueName,
        fromDate: this.editUser.fromDate,
        toDate: this.editUser.toDate
      };
    } else {
      payload = {
        fromDate: this.editUser.fromDate,
        toDate: this.editUser.toDate,
        paymentStatus: this.editUser.paymentStatus,
        claimType: this.editUser.claimType
      };
    }
    return payload;
  }
  auditClaimsDetails() {
    const payload = this.getPayload();
    this.auditDashboardService.auditClaimsDetails(this.editUser.type, payload);
    this.gridData = this.auditDashboardService.auditClaimsDetailsResponse;
    this.gridData = [];
    this.data = [];
    this.auditDashboardService
      .auditClaimsDetailsListner()
      .subscribe((res: any) => {
        if (res) {
          this.data = res;
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }

  exportExcel() {
    const payload = this.getPayload();
    this.auditDashboardService
      .auditClaimsDetailsReport(this.editUser.type, payload)
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
        const reportName =
          this.editUser.type === "audit-claims-summary"
            ? "Claims Audit Summary-"
            : this.editUser.type === "claims-audited-queue"
            ? "Claims Audit By Queue-"
            : "Claims Audited By Type & Status-";
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
