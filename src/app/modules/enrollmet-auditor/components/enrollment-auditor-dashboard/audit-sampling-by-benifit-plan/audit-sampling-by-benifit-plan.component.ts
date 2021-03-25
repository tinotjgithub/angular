import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { EnrollmentAuditorDashboardService } from "./../enrollment-audit-dashboard.service";

@Component({
  selector: "app-audit-sampling-by-benifit-plan",
  templateUrl: "./audit-sampling-by-benifit-plan.component.html",
  styleUrls: ["./audit-sampling-by-benifit-plan.component.css"]
})
export class AuditSamplingByBenifitPlanComponent implements OnInit, OnDestroy {
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  auditStatusCountDto: any;
  userStatusReportDto: any;
  public displayEnlarged = false;
  public titleReqCount = "";
  public typeReqCount = "BarChart";
  public isDataPresent = false;
  public isValid = true;
  public benefitPlanIdArray = [];
  public maxDate = new Date();
  public benefitPlanName = "";
  public status = "";
  public trans = "";
  public statusDates: FormGroup;
  public dataReqCount = [];
  public isReqCountRendered = false;
  public editUser = {};
  public editMode = false;
  public widthReqCount = 550;
  public heightReqCount = 270;
  public columnNamesReqCount = [
    "",
    "Transaction Count",
    { role: "annotation" }
  ];
  public optionsReqCount = {
    bar: { width: "60%" },
    height: 100,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#24478a"],
    hAxis: {
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
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
      left: 120,
      right: 70,
      top: 17,
      bottom: 10
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        color: "black",
        fontSize: 12,
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
        fontSize: 12
      }
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 7
          }
        }
      }
    },
    isStacked: true
  };

  public optionsReqCountEnlarged = {
    height: 100,
    bar: { width: "60%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12,
        color: "black",
        textPosition: "Horizontal"
      }
    },
    colors: ["#24478a"],
    hAxis: {
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
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
      left: 200,
      right: 70,
      top: 17,
      bottom: 10
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        color: "black",
        fontSize: 12,
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
        fontSize: 12
      }
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 7
          }
        }
      }
    },
    isStacked: true
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
    if (e.length > 0 && this.dataReqCount.length > 0) {
      this.auditDetails = this.enrollmentAuditorDashboardService.getAuditDates();
      this.processedDates = this.auditDetails.auditDates;
      const toDateValue = this.getToDateValue();
      const fromDateValue = this.processedDates[0];
      const frequency = this.processedDates[2];
      const row = e[0].row;

      this.trans = this.dataReqCount[row][0];

      const from = this.datePipe.transform(fromDateValue, "yyyy-MM-dd");
      const to = this.datePipe.transform(toDateValue, "yyyy-MM-dd");
      const type = "audit-sampling-benefit-plan";
      const benefitPlanName = this.dataReqCount[row][0];
      this.benefitPlanName = benefitPlanName;
      this.editUser = {
        type,
        benefitPlanName,
        benefitPlanId: this.benefitPlanIdArray[row],
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

  auditStatusSpecialistChartNoValue() {
    this.isDataPresent = false;
    this.dataReqCount = [];
    this.optionsReqCount.legend.position = "none";
    this.optionsReqCount.tooltip.trigger = "none";
    this.optionsReqCountEnlarged.legend.position = "none";
    this.optionsReqCountEnlarged.tooltip.trigger = "none";
    this.dataReqCount.push(["NO DATA", 0, "0", 0, "0"]);
  }

  auditStatusSpecialistChartValue() {
    this.dataReqCount = [];
    this.optionsReqCount.legend.position = "top";
    this.optionsReqCount.tooltip.trigger = "focus";
    this.optionsReqCountEnlarged.legend.position = "top";
    this.optionsReqCountEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditStatusCountDto;
    if (responseValue !== null && responseValue.length !== 0) {
      this.isDataPresent = true;
      this.optionsReqCount.bar.width =
        responseValue.length <= 3 ? "45%" : "65%";
      responseValue.forEach(val => {
        this.dataReqCount.push([
          val.benefitPlanName,
          val.transactionCount,
          val.transactionCount
        ]);
        this.benefitPlanIdArray.push(val.benefitPlanId);
      });
      this.setProdVolChartOptions();
    } else {
      this.auditStatusSpecialistChartNoValue();
    }
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

  setProdVolChartOptions() {
    const userGroupLength =
      this.dataReqCount.length === 1
        ? this.dataReqCount.length * 250
        : this.dataReqCount.length <= 3
        ? this.dataReqCount.length * 150
        : this.dataReqCount.length * 100;
    this.optionsReqCount.height = userGroupLength;
    this.optionsReqCountEnlarged.height = userGroupLength;
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    const frequency = this.processedDates[2];
    this.enrollmentAuditorDashboardService.getAuditBenifitPlan(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      frequency
    );
    this.auditStatusCountDto = this.enrollmentAuditorDashboardService.auditBenifitPlanResponse;
    this.auditStatusCountDto = null;
    this.statusSubscription = this.enrollmentAuditorDashboardService
      .getAuditBenifitPlanListner()
      .subscribe((data: any) => {
        this.auditStatusCountDto = data;
        this.dataReqCount = [];

        if (this.auditStatusCountDto && this.auditStatusCountDto.length > 0) {
          this.auditStatusSpecialistChartValue();
          this.isDataPresent = true;
        } else {
          this.isDataPresent = false;
          this.auditStatusSpecialistChartNoValue();
        }
        this.statusSubscription.unsubscribe();
      });
    if (
      this.auditStatusCountDto === null ||
      this.auditStatusCountDto === undefined
    ) {
      this.isDataPresent = false;
      this.auditStatusSpecialistChartNoValue();
    }
    this.isReqCountRendered = true;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
