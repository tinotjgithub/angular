import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { AuditDashboardService } from "./.././../../../../modules/auditor/auditor-dashboard/audit-dashboard.service";
import { TaskmanagementService } from "./.././../../../../services/task-management/taskmanagement.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";
@Component({
  selector: "app-low-performing-examiners",
  templateUrl: "./low-performing-examiners.component.html"
})
export class LowPerformingExaminersComponent implements OnInit, OnDestroy {
  userAuditScoreDto: any;
  role = "";
  public enlargedDisplay = false;
  userAuditReportDto: any;
  public isDataPresent = false;
  public submittedAudit = false;
  private auditSubscription: Subscription = new Subscription();
  private reportSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "BarChart";
  public columnNamesAudit = ["", "Audit Failed", { role: "annotation" }];

  public optionsExaminer = [
    "",
    "Claims Examiner Count",
    { role: "annotation" }
  ];
  public optionsExaminerCount = {
    height: 200,
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
    height: 430,
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
      minValue: 0,
      format: "0",
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
  cols: { header: string; field: string }[];
  detailsView: boolean;
  barDetails: { type: any; value: any; examinerName: any };
  public chartDetails: any[];

  constructor(
    private fbExaminer: FormBuilder,
    private auditDashboardService: AuditDashboardService,
    public datePipe: DatePipe,
    private taskmanagementService: TaskmanagementService,
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
      ? this.getLowPerExaminersManagerLead()
      : this.getLowPerExaminersAuditor();
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
    this.isDataPresent = true;
    this.dataExaminer = [];
    let responseValue = [];
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

  getLowPerExaminersAuditor() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];

    this.auditDashboardService.getLowPerExaminers(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.role
    );
    this.userAuditScoreDto = this.auditDashboardService.lowPerExaminersResponse;
    this.userAuditScoreDto = null;
    this.auditSubscription = this.auditDashboardService
      .getLowPerExaminersListner()
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

  getLowPerExaminersManagerLead() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];
    this.taskmanagementService.getLowPerExaminers(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.role
    );
    this.userAuditScoreDto = this.taskmanagementService.lowPerExaminersResponse;
    this.userAuditScoreDto = null;
    this.auditSubscription = this.taskmanagementService
      .getLowPerExaminersListner()
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

  onSubmitExaminer() {
    if (this.examinerDates.invalid) {
      return;
    }
    this.submittedAudit = true;
    this.role === "Manager" || this.role === "Claims Lead"
      ? this.getLowPerExaminersManagerLead()
      : this.getLowPerExaminersAuditor();
  }

  selectBar(bar) {
    const isAuditor = !(this.role === "Claims Lead" || this.role === "Manager");
    this.barDetails = bar && bar[0] ? this.getBarDetails(bar[0]) : null;
    console.log(bar, this.barDetails);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns();
      this.chartDetails = [];
      const callService = isAuditor
        ? this.auditDashboardService
        : this.chartService;
      callService
        .lowPerformingDetails(this.constructPayload(isAuditor))
        .subscribe(res => {
          this.chartDetails = res || [];
        });
      this.detailsView = true;
    }
  }

  constructPayload(isAuditor: boolean) {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.examinerDates.get("dateRange").value[0];
    const responseValue = isAuditor
      ? this.userAuditScoreDto.userAuditScoreDto
      : this.userAuditScoreDto.auditScoreDto;
    const filtered = responseValue.filter(
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
      { header: "Claim Type", field: "claimType" },
      { header: "Audit Status", field: "auditStatus" },
      { header: "Auditor Name", field: "auditorName" },
      { header: "Audit Date", field: "auditDate" },
      { header: "Error Type", field: "errorType" },
      { header: "Financial Impact", field: "financialImpact" },
      { header: "Amount ($)", field: "amount" },
      { header: "Processed Date", field: "processedDate" }
    ];
    return cols;
  }

  downloadExcel() {
    const isAuditor = !(this.role === "Claims Lead" || this.role === "Manager");
    const callService = isAuditor
      ? this.auditDashboardService
      : this.chartService;
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    callService
      .lowPerformingExcel(this.constructPayload(isAuditor))
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
        const fileName = `Low Productivity Instances Failed Claims-${dateString}`;
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
