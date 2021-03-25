import { Component, OnInit } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
@Component({
  selector: "app-lead-score-card",
  templateUrl: "./lead-score-card.component.html"
})
export class LeadScoreCardComponent implements OnInit {
  public auditorColumnNames = [
    "",
    "Audit Success",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" },
    "Assigned",
    { role: "annotation" }
  ];
  public auditorHeight = 195;
  public isDataPresent = false;
  public auditorHeightEnlarged = 300;
  public assignedDates: FormGroup;
  public isValid = true;
  public optionsAuditor = {
    bar: { width: "65%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
    hAxis: {
      format: "0",
      title: "Count",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "Auditor Name",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    legend: {
      position: "top",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 250,
      right: 55,
      top: 30,
      bottom: 10
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsStatusEnlarged = {
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal"
      }
    },
    hAxis: {
      format: "0",
      title: "Count",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "Auditor Name",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#4cc14f", "#ff5c5d", "#ff9226"],
    chartArea: {
      left: 250,
      right: 55,
      top: 25,
      bottom: 10
    },
    legend: {
      position: "top",
      textStyle: {
        color: "black",
        fontSize: 14,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    annotations: {
      textStyle: {
        fontSize: 14
      }
    }
    // isStacked: true
  };
  public auditorCountData = [["NO DATA", 0, "0", 0, "0", 0, "0"]];
  public expand: boolean;
  loaded: boolean;
  public detailsView: boolean;
  public barDetails: { type: any; value: any; auditorName: any };
  public cols: any;
  public chartDetails: any[];
  public auditorDetails: any[];

  constructor(
    private taskMgtService: TaskmanagementService,
    private auditorService: AuditorService,
    public datePipe: DatePipe,
    private fbStatus: FormBuilder,
    private notifierService: NotifierService
  ) {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 1)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.assignedDates = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getAuditorCounts();
  }

  getAuditorCounts() {
    this.loaded = false;
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.assignedDates.get("dateRange").value[0];
    this.auditorService
      .getAuditorCounts(
        this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        this.datePipe.transform(toDateValue, "yyyy-MM-dd")
      )
      .subscribe(
        res => {
          this.loaded = true;
          this.auditorCountData =
            res && res.length > 0
              ? this.processAuditorGraph(res)
              : [["NO DATA", 0, "0", 0, "0", 0, "0"]];
          if (!res || res.length <= 0) {
            this.isDataPresent = false;
          } else {
            this.isDataPresent = true;
          }
        },
        err => {
          this.loaded = true;
        }
      );
  }

  dateDifference(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  validateDates() {
    const fromDateValue = this.assignedDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.dateDifference(fromDateValue);
      this.isValid = diffInMonths > 6 ? false : true;
    } else {
      this.isValid = true;
    }
  }

  processAuditorGraph(res) {
    this.isDataPresent = true;
    const auditors = [];
    this.auditorHeight = res.length > 4 ? res.length * 45 : 195;
    this.auditorHeightEnlarged = res.length > 4 ? res.length * 60 : 300;
    this.auditorDetails = [];
    if (res.length > 0) {
      this.auditorDetails = res;
      res.forEach(e => {
        auditors.push([
          e.auditorName,
          e.passedAuditCount,
          String(e.passedAuditCount),
          e.failedAuditCount,
          String(e.failedAuditCount),
          e.assignedClaimsCount,
          String(e.assignedClaimsCount)
        ]);
      });
    }
    return auditors;
  }

  onSubmitStatus() {
    if (this.isValid) {
      this.getAuditorCounts();
    }
  }

  getToDateValue() {
    const toDateValue =
      this.assignedDates.get("dateRange").value[1] !== null &&
      this.assignedDates.get("dateRange").value[1] !== "" &&
      this.assignedDates.get("dateRange").value[1] !== undefined
        ? this.assignedDates.get("dateRange").value[1]
        : this.assignedDates.get("dateRange").value[0];
    return toDateValue;
  }

  constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.assignedDates.get("dateRange").value[0];
    const filtered = this.auditorDetails.filter(
      e => e.auditorName === this.barDetails.auditorName
    );
    const statusStr = String(this.barDetails.type)
      .replace("Audit", "")
      .trim();
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status: statusStr === "Success" ? "Passed" : statusStr,
      auditorId: filtered[0].auditorId,
      auditorName: this.barDetails.auditorName
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns(this.barDetails.type);
      this.chartDetails = [];
      this.auditorService
        .auditSummaryByAuditorDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetails = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.auditorCountData[bar.row];
    const barDetails = {
      type: this.auditorColumnNames[bar.column],
      value: barValue[bar.column],
      auditorName: barValue[0]
    };
    return barDetails;
  }

  setColumns(type) {
    const prefix = [
      { header: "Claim ID", field: "claimId" },
      { header: "Audit Status", field: "auditStatus" },
      { header: "Auditor Name", field: "auditorName" },
      { header: "Examiner Name", field: "examinerName" }
    ];
    const suffix = [
      { header: "Claim Type", field: "claimType" },
      { header: "Claim Status", field: "claimStatus" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount($)", field: "allowedAmount" },
      { header: "Paid Amount($)", field: "paidAmount" },
      { header: "Processed Date", field: "processedDate" }
    ];
    const cols = {
      "Audit Success": [
        ...prefix,
        { header: "Audit Date", field: "auditDate" },
        ...suffix
      ],
      "Audit Failed": [
        { header: "Claim ID", field: "claimId" },
        { header: "Claim Type", field: "claimType" },
        { header: "Audit Status", field: "auditStatus" },
        { header: "Auditor Name", field: "auditorName" },
        { header: "Examiner Name", field: "examinerName" },
        { header: "Audit Date", field: "auditDate" },
        { header: "Error Type", field: "errorType" },
        { header: "Financial Impact", field: "financialImpact" },
        { header: "Amount ($)", field: "amount" },
        { header: "Processed Date", field: "processedDate" }
      ],
      Assigned: [
        ...prefix,
        { header: "Assigned Date", field: "assignedDate" },
        ...suffix
      ]
    };
    return cols[type];
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.auditorService
      .auditSummaryByAuditorExcel(this.constructPayload())
      .subscribe(res => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Report is generated."
        });
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        const fileName = `Audit Summary By Auditor-${dateString}`;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }
}
