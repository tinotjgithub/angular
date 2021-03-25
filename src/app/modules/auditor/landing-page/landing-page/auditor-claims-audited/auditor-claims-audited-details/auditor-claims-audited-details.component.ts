import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuditDashboardService } from "./../../../../auditor-dashboard/audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-auditor-claims-audited-details",
  templateUrl: "./auditor-claims-audited-details.component.html",
  styleUrls: ["./auditor-claims-audited-details.component.css"]
})
export class AuditorClaimsAuditedDetailsComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public editUser: any;
  public gridData: any[];
  public data: any[];
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
    this.editMode ? this.auditorAuditedDetails() : "";
    this.editUser.type === "Open Inventory/Backlog"
      ? this.setInvClaimsCols()
      : this.setAuditClaimsCols();
  }

  setInvClaimsCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      {
        field: "assignType",
        header: "Assign Type",
        visible: true
      },
      {
        field: "assignDate",
        header: "Assign Date",
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
        field: "receiptDate",
        header: "Receipt Date",
        visible: true
      },
      {
        field: "claimAge",
        header: "Claim Age (Days)",
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
      },
      {
        field: "examinerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      }
    ];
  }

  setAuditClaimsCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
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
        field: "receiptDate",
        header: "Receipt Date",
        visible: true
      },
      {
        field: "claimAge",
        header: "Claim Age (Days)",
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
      },
      {
        field: "examinerName",
        header: "Examiner Name",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "auditDate",
        header: "Audit Date",
        visible: true
      },
      {
        field: "auditStatus",
        header: "Audit Status",
        visible: true
      },
      {
        field: "errorType",
        header: "Error Type",
        visible: true
      },
      {
        field: "errorDescription",
        header: "Error Description",
        visible: true
      },
      {
        field: "financialImpact",
        header: "Financial Impact",
        visible: true
      },
      {
        field: "amount",
        header: "Amount",
        visible: true
      }
    ];
  }

  getPayload() {
    const payload = {
      type:
        this.editUser.type === "Open Inventory/Backlog"
          ? "Open Inventory"
          : this.editUser.type,
      fromDate: this.editUser.fromDate,
      toDate: this.editUser.toDate
    };
    return payload;
  }
  auditorAuditedDetails() {
    const payload = this.getPayload();
    this.auditDashboardService.auditorAuditedDetails(payload);
    this.gridData = this.auditDashboardService.auditorAuditedDetailsResponse;
    this.gridData = [];
    this.data = [];
    this.auditDashboardService
      .auditorAuditedDetailsListner()
      .subscribe((res: any) => {
        if (res) {
          const resArray = res;
          this.data = res;
          this.gridData = resArray;
        }
      });
  }

  exportExcel() {
    const payload = this.getPayload();
    this.auditDashboardService
      .auditorAuditedDetailsReport(payload)
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
          this.editUser.type === "Open Inventory/Backlog"
            ? "Open Inventory-"
            : "Audited Claims-";
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
