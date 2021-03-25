import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuditDashboardService } from "./../../../../auditor-dashboard/audit-dashboard.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-auditor-quality-score-details",
  templateUrl: "./auditor-quality-score-details.component.html",
  styleUrls: ["./auditor-quality-score-details.component.css"]
})
export class AuditorQualityScoreDetailsComponent implements OnInit {
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
    this.editMode ? this.auditQualityDetails() : "";
    this.editUser.status === "Audit Failed"
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
        field: "financialImpact",
        header: "Financial Impact",
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
      }
    ];
  }

  setStausRebuttedCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "claimType", header: "Claim Type", visible: true },
      { field: "auditorName", header: "Auditor Name", visible: true },
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
        field: "rebuttalAcceptDate",
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
    const payload = {
      type: this.editUser.status
    };
    return payload;
  }
  auditQualityDetails() {
    const payload = this.getPayload();
    this.auditDashboardService.auditQualityDetails(payload);
    this.gridData = this.auditDashboardService.auditQualityDetailsResponse;
    this.gridData = [];
    this.data = [];
    this.auditDashboardService
      .auditQualityDetailsListner()
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
      .auditQualityDetailsReport(payload)
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
        const reportName = "My Quality Score-";
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
