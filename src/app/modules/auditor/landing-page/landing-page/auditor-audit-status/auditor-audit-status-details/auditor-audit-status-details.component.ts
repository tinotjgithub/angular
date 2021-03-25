import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuditDashboardService } from "./../../../../auditor-dashboard/audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { auditStatus } from "src/app/mocks/auditor-landing-page-charts.mock";

@Component({
  selector: "app-auditor-audit-status-details",
  templateUrl: "./auditor-audit-status-details.component.html",
  styleUrls: ["./auditor-audit-status-details.component.css"]
})
export class AuditorAuditStatusDetailsComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public editUser: any;
  public gridData: any[];
  targetSLA: number;
  public data: any[];
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
    this.editMode ? this.auditVolStatus() : "";
    this.editUser.status === "Audit Passed"
      ? this.setStausPassedCols()
      : this.editUser.status === "Audit Failed"
      ? this.setStausFailedCols()
      : this.setStausRebuttedCols();
  }

  setStausFailedCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      {
        field: "claimType",
        header: "Claim Type",
        visible: true
      },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
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
        field: "errorType",
        header: "Error Type",
        visible: true
      },
      {
        field: "amount",
        header: "Amount ($)",
        visible: true
      },
      {
        field: "processedDate",
        header: "Processed Date",
        visible: true
      },
      {
        field: "financialImpact",
        header: "Financial Impact",
        visible: true
      }
    ];
  }

  setStausPassedCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "auditStatus", header: "Audit Status", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
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

  setStausRebuttedCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "claimType", header: "Claim Type", visible: true },
      {
        field: "examinerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "rebuttalLevel",
        header: "Rebuttal Level",
        visible: true
      },
      {
        field: "rebuttalDate",
        header: "Rebuttal Accept Date",
        visible: true
      },
      {
        field: "rebuttalStatus",
        header: "Rebuttal Status",
        visible: true
      }
    ];
  }

  getPayload() {
    const auditStatus =
      this.editUser.status === "Audit Passed"
        ? "AuditSuccess"
        : this.editUser.status === "Audit Failed"
        ? "AuditFailed"
        : "AuditRebuttal";
    const payload = {
      auditStatus
    };
    return payload;
  }
  auditVolStatus() {
    const payload = this.getPayload();
    this.auditDashboardService.auditStatusDetails(payload);
    this.gridData = this.auditDashboardService.auditStatusDetailsResponse;
    this.gridData = [];
    this.data = [];
    this.auditDashboardService
      .auditStatusDetailsListner()
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
      .auditStatusDetailsReport(payload)
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
        const reportName = "AuditStatus-";
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
