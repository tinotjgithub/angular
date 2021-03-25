import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { AuditDashboardService } from "./.././../../../../modules/auditor/auditor-dashboard/audit-dashboard.service";
import { TaskmanagementService } from "./.././../../../../services/task-management/taskmanagement.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";
@Component({
  selector: "app-high-performing-examiners",
  templateUrl: "./high-performing-examiners.component.html",
  styleUrls: ["./high-performing-examiners.component.css"]
})
export class HighPerformingExaminersComponent implements OnInit, OnDestroy {
  userAuditScoreDto: any;
  public enlargedDisplay = false;
  userAuditReportDto: any;
  public submittedAudit = false;
  private auditSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public isDataPresent = false;
  role = "";
  public typeAudit = "BarChart";
  public columnNamesAudit = ["", "Audit Failed", { role: "annotation" }];
  public optionsExaminerCount = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 12
      }
    },
    colors: ["#ff5c5d"],
    hAxis: {
      format: "0",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
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
    chartArea: {
      left: 180,
      right: 20,
      top: 17,
      bottom: 20
    },
    annotations: {
      textStyle: {
        fontSize: 11,
        textPosition: "Horizontal"
      },
      Vertical: true
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: { fontSize: 12 }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsExaminerCountEnlarged: any = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#ff5c5d"],
    hAxis: {
      title: "",
      format: "0",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    annotations: {
      textStyle: {
        fontSize: 13,
        textPosition: "Horizontal"
      },
      Vertical: true
    },
    vAxis: {
      title: "",
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
    chartArea: {
      left: 250,
      right: 30,
      top: 25,
      bottom: 20
    },
    legend: {
      position: "top",
      width: "50%",
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
    }
  };
  public widthAudit = 500;
  public heightAudit = 250;
  public dataExaminer = [];
  public isValid = true;
  public isExaminersRendered = false;
  public examinerDates: FormGroup;
  public maxDate = new Date();
  public detailsView: boolean;
  public cols: { header: string; field: string }[];
  public barDetails: any;
  public chartDetails: any[];

  constructor(
    private fbExaminer: FormBuilder,
    private auditDashboardService: AuditDashboardService,
    private taskmanagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private chartService: ChartDetailService,
    private notifierService: NotifierService
  ) {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const threeMonthsBefore = new Date(
      prevDate.setMonth(prevDate.getMonth() - 3)
    );
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);
    this.examinerDates = fbExaminer.group({
      dateRange: [defaultDateRange, Validators.required]
    });
  }

  ngOnInit() {
    this.role =
      this.secureLocalStorage.getItem("roleId") === "Manager"
        ? "Manager"
        : this.secureLocalStorage.getItem("roleId") === "Claims Lead"
        ? "Claims Lead"
        : "Claims Auditor";

    this.role === "Manager" || this.role === "Claims Lead"
      ? this.getHighPerExaminersManagerLead()
      : this.getHighPerExaminersAuditor();
  }

  get getDateRange() {
    return this.examinerDates.controls.dateRange;
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.examinerDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const date1 = new Date(fromDateValue[0]);
      const date2 = new Date(fromDateValue[1]);
      const isValid = this.getMonths(date1, date2) > 6 ? false : true;
      if (!isValid) {
        this.examinerDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.examinerDates.updateValueAndValidity();
      } else {
        this.examinerDates.controls.dateRange.setErrors(null);
        this.examinerDates.updateValueAndValidity();
        this.onSubmitExaminer();
      }
    } else {
      this.examinerDates.controls.dateRange.setErrors(null);
      this.examinerDates.updateValueAndValidity();
      this.onSubmitExaminer();
    }
  }

  getMonths(date1, date2) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  getExaminerChartNoValue() {
    this.isDataPresent = false;
    this.dataExaminer = [];
    this.dataExaminer.push(["NO DATA", 0, "0"]);
  }

  getExaminerChartValue() {
    this.dataExaminer = [];
    let responseValue = [];
    this.isDataPresent = true;
    responseValue =
      this.role === "Claims Lead" || this.role === "Manager"
        ? this.userAuditScoreDto.auditScoreDto
        : this.userAuditScoreDto.userAuditScoreDto;
    responseValue.forEach(val => {
      this.dataExaminer.push([
        val.examinerName,
        val.failedAuditCount,
        val.failedAuditCount
      ]);
    });
    this.setManagerChartOptions();
  }

  setManagerChartOptions() {
    const statusLength = this.dataExaminer.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 430;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 430 ? newHeightEnlarged : 430;
    const newHeight =
      statusLength === 1 ? 200 : statusLength > 4 ? statusLength * 50 : 430;
    this.heightAudit = newGeneratedHeightEnlarged;
    this.heightAudit = newHeight;
  }

  getToDateValue() {
    const toDateValue =
      this.examinerDates.get("dateRange").value[1] !== null &&
      this.examinerDates.get("dateRange").value[1] !== "" &&
      this.examinerDates.get("dateRange").value[1] !== undefined
        ? this.examinerDates.get("dateRange").value[1]
        : this.examinerDates.get("dateRange").value[0];
    return toDateValue;
  }

  getHighPerExaminersManagerLead() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];
    this.taskmanagementService.getHighPerExaminers(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.role
    );
    this.userAuditScoreDto = this.taskmanagementService.highPerExaminersResponse;
    this.userAuditScoreDto = null;
    this.auditSubscription = this.taskmanagementService
      .getHighPerExaminersListner()
      .subscribe(data => {
        this.userAuditScoreDto = data;
        this.dataExaminer = [];
        this.userAuditScoreDto &&
        this.userAuditScoreDto.auditScoreDto.length > 0
          ? this.getExaminerChartValue()
          : this.getExaminerChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.userAuditScoreDto === null ||
      this.userAuditScoreDto === undefined
    ) {
      this.getExaminerChartNoValue();
    }
    this.isExaminersRendered = true;
  }

  getHighPerExaminersAuditor() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];
    this.auditDashboardService.getHighPerExaminers(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.role
    );
    this.userAuditScoreDto = this.auditDashboardService.highPerExaminersResponse;
    this.userAuditScoreDto = null;
    this.auditSubscription = this.auditDashboardService
      .getHighPerExaminersListner()
      .subscribe(data => {
        this.userAuditScoreDto = data;
        this.dataExaminer = [];
        this.userAuditScoreDto &&
        this.userAuditScoreDto.userAuditScoreDto.length > 0
          ? this.getExaminerChartValue()
          : this.getExaminerChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.userAuditScoreDto === null ||
      this.userAuditScoreDto === undefined
    ) {
      this.getExaminerChartNoValue();
    }
    this.isExaminersRendered = true;
  }

  onSubmitExaminer() {
    if (this.examinerDates.invalid) {
      return;
    }
    this.submittedAudit = true;
    this.role === "Manager" || this.role === "Claims Lead"
      ? this.getHighPerExaminersManagerLead()
      : this.getHighPerExaminersAuditor();
  }

  constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];
    const filtered = this.userAuditScoreDto.auditScoreDto.filter(
      e => e.examinerName === this.barDetails.examinerName
    );
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      examinerId: filtered[0].examinerId,
      examinerName: this.barDetails.examinerName
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns();
      this.chartDetails = [];
      this.chartService
        .highPerformingDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetails = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataExaminer[bar.row];
    const barDetails = {
      type: this.columnNamesAudit[bar.column],
      value: barValue[bar.column],
      examinerName: barValue[0]
    };
    return barDetails;
  }

  setColumns() {
    const cols = [
      { header: "Claim ID", field: "claimId" },
      { header: "Examiner Name", field: "examinerName" },
      { header: "claim Type", field: "claimType" },
      { header: "Claim Status", field: "claimStatus" },
      { header: "Receipt Date", field: "receiptDate" },
      { header: "Claim Age (Days)", field: "claimAge" },
      { header: "Provider Name", field: "providerName" },
      { header: "Group Name", field: "groupName" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount ($)", field: "allowedAmount" },
      { header: "Paid Amount ($)", field: "totalPaidAmount" },
      { header: "Processed Date", field: "processedDate" },
      { header: "User Group Name", field: "userGroupName" },
      { header: "Auditor Name", field: "auditorName" },
      { header: "Audit Date", field: "auditDate" }
    ];
    return cols;
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.chartService
      .highPerformingExcel(this.constructPayload())
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
        const fileName = `High Productivity Instances Claims-${dateString}`;
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

  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
