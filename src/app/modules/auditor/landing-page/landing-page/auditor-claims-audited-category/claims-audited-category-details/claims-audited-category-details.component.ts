import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuditDashboardService } from "./../../../../auditor-dashboard/audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-claims-audited-category-details",
  templateUrl: "./claims-audited-category-details.component.html",
  styleUrls: ["./claims-audited-category-details.component.css"]
})
export class ClaimsAuditedCategoryDetailsComponent implements OnInit {
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
    this.editMode ? this.claimsAuditedCategoryDetails() : "";
    this.getColumns();
  }

  getColumns() {
    if (this.editUser.chartType === "claimType") {
      this.setClaimTypeCols();
    } else if (this.editUser.chartType === "paymentType") {
      this.setPaymentStatusCols();
    } else if (this.editUser.chartType === "claimSource") {
      this.setClaimSourceCols();
    } else {
      this.getClaimAdjTypeCols();
    }
  }

  setClaimTypeCols() {
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
        field: "billedAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      }
    ];
  }
  setPaymentStatusCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
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
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      }
    ];
  }

  setClaimSourceCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      {
        field: "claimSource",
        header: "Claim Source",
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
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      }
    ];
  }

  getClaimAdjTypeCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      {
        field: "adjudicationType",
        header: "Adjudication Type",
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
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      }
    ];
  }

  getPayload() {
    let payload;
    if (this.editUser.chartType === "claimType") {
      payload = {
        chartType: this.editUser.chartType,
        type: this.editUser.type
      };
    } else if (this.editUser.chartType === "paymentType") {
      payload = {
        chartType: this.editUser.chartType,
        type: this.editUser.type
      };
    } else if (this.editUser.chartType === "claimSource") {
      payload = {
        chartType: this.editUser.chartType,
        type: this.editUser.type
      };
    } else {
      payload = {
        chartType: this.editUser.chartType,
        type: this.editUser.type
      };
    }
    return payload;
  }
  claimsAuditedCategoryDetails() {
    const payload = this.getPayload();
    this.auditDashboardService.claimsAuditedCategoryDetails(
      this.editUser.chartType,
      payload
    );
    this.gridData = this.auditDashboardService.claimsAuditedCategoryDetailsResponse;
    this.gridData = [];
    this.data = [];
    this.auditDashboardService
      .claimsAuditedCategoryDetailsListner()
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
      .claimsAuditedCategoryReport(this.editUser.chartType, payload)
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
        const reportName = "Claims Audit By Category-";
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
