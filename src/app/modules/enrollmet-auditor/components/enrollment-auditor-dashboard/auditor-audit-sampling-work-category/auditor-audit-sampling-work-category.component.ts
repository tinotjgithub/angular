import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-auditor-audit-sampling-work-category",
  templateUrl: "./auditor-audit-sampling-work-category.component.html",
  styleUrls: ["./auditor-audit-sampling-work-category.component.css"]
})
export class AuditorAuditSamplingWorkCategoryComponent
  implements OnInit, OnDestroy {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public isDataPresent = false;
  public isValid = true;
  public maxDate = new Date();
  public status = "";
  public trans = "";
  public statusDates: FormGroup;
  public dataStatus = [];
  public isStatusRendered = false;
  public editUser = {};
  public widthStatus = "100%";
  public editMode = false;
  public heightStatus = 250;
  public myColumnNamesStatus = ["Work Category", "transaction Count"];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 12 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 17,
      bottom: 1
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 12
      }
    }
  };
  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 12 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 10,
      right: 10,
      top: 50,
      bottom: 10
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268",
      "#ea4f5b",
      "#f7614d",
      "#ff763b",
      "#ff8e26"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      width: "100%",
      alignment: "center",
      textStyle: {
        fontSize: 14
      }
    }
  };
  auditDetails: { auditDates: [] };
  public processedDates: Array<{}>;
  constructor(
    private enrollmentAuditorDashboardService: EnrollmentAuditorDashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getStatusDays();
    this.getAuditDetails();
  }

  getAuditDetails() {
    this.processedDates = [];
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getStatusDays();
      }
    });
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
      this.processedDates = this.auditDetails.auditDates;
      const toDateValue = this.getToDateValue();
      const fromDateValue = this.processedDates[0];
      const frequency = this.processedDates[2];
      const row = e[0].row;
      const act = this.dataStatus[row][0];
      this.status = act;
      this.trans = this.dataStatus[row][0];

      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(toDateValue, "yyyy-MM-dd");
      const type = "audit-sampling-work-category";
      this.editUser = {
        type,
        workCategory: act,
        fromDate: from,
        toDate: to,
        frequency
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  getNoDataChart() {
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.pieSliceText = "label";
    this.optionsStatusEnlarged.tooltip.text = "none";
    this.optionsStatusEnlarged.legend.position = "none";
  }

  getDataChart() {
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value-and-percentage";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value-and-percentage";
    this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];

    responseValue = this.auditStatusCountDto;
    responseValue.map(val => {
      this.dataStatus.push([val.workCategory, val.requestCount]);
    });
  }

  getToDateValue() {
    const toDateValue =
      this.processedDates[1] !== null &&
      this.processedDates[1] !== "" &&
      this.processedDates[1] !== undefined
        ? this.processedDates[1]
        : this.processedDates[0];
    return toDateValue;
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    const frequency = this.processedDates[2];
    this.enrollmentAuditorDashboardService.getAuditSamplingWorkCategory(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      frequency
    );
    this.auditStatusCountDto = this.enrollmentAuditorDashboardService.auditSamplingWorkCategoryResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.enrollmentAuditorDashboardService
      .getAuditSamplingWorkCategoryListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataStatus = [];

        if (this.auditStatusCountDto && this.auditStatusCountDto.length > 0) {
          this.getDataChart();
          this.isDataPresent = true;
        } else {
          this.isDataPresent = false;
          this.getNoDataChart();
        }
        this.statusSubscription.unsubscribe();
      });
    if (
      this.auditStatusCountDto === null ||
      this.auditStatusCountDto === undefined
    ) {
      this.isDataPresent = false;
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
