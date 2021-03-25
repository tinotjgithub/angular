import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditDashboardService } from "./../../../../auditor/auditor-dashboard/audit-dashboard.service";
import { MultiSelect } from "primeng/multiselect";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Component({
  selector: "app-manager-financial-score",
  templateUrl: "./manager-financial-score.component.html"
})
export class ManagerFinancialScoreComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("claimsExaminerSelect", { static: false })
  claimsExaminerSelect: MultiSelect;
  financialScoreManagerDtos: any;
  enlargedDisplay = false;
  public isDataPresent = false;
  onload = true;
  private finSubscription: Subscription = new Subscription();
  private claimsExaminerSubscription: Subscription = new Subscription();
  public titleFin = "";
  public claimsExaminerList = [];
  public examinersExceeded = false;
  public typeFin = "LineChart";
  @Input()
  public isManager: boolean;
  public columnNamesFin = [
    "",
    "Financial Score",
    {
      calc: "stringify",
      sourceColumn: 0,
      type: "string",
      role: "annotation"
    },
    "Target",
    {
      calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation"
    }
  ];
  public myOptionsFin = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#e19b0e", "#b84066"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      format: "#'%'",
      viewWindowMode: "explicit",
      viewWindow: {
        max: 100,
        min: 70
      },
      textStyle: {
        fontSize: 12
      }
    },

    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 35,
      right: 10,
      top: 20,
      bottom: 20
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 3,
    annotations: {
      textStyle: {
        fontSize: 11
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
            length: 16
          }
        }
      }
    }
  };

  public myOptionsFinEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 13
      }
    },
    colors: ["#e19b0e", "#b84066"],
    hAxis: {
      title: "",
      type: "string"
    },
    vAxis: {
      minValue: 0,
      title: "",
      format: "#'%'",
      viewWindowMode: "explicit",
      viewWindow: {
        max: 100,
        min: 70
      },
      textStyle: {
        fontSize: 14
      }
    },

    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        fontSize: 14
      }
    },
    chartArea: {
      left: 40,
      right: 10,
      top: 30,
      bottom: 20
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 3,
    annotations: {
      textStyle: {
        fontSize: 14
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
            length: 16
          }
        }
      }
    }
  };
  public widthFin = 520;
  public heightFin = 150;
  claimsExaminerArray: any[];
  public dataFin = [];
  public isFinRendered = false;
  public role = "";
  public finGroup: FormGroup;
  public maxDate = new Date();
  claimsExaminer: any[];

  constructor(
    private fbFin: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private auditDashboardService: AuditDashboardService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService
  ) {
    const yesterdaysDate = new Date();
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    const yester = new Date();
    yester.setDate(yester.getDate() - 1);
    const threeMonthsBefore = new Date(yester.setMonth(yester.getMonth() - 3));

    const defaultDateRange = [];
    defaultDateRange.push(threeMonthsBefore);
    defaultDateRange.push(yesterdaysDate);

    this.finGroup = fbFin.group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getManagerClaimsExaminers();
    this.onSubmitFin();
  }

  get getDateRange() {
    return this.finGroup.controls.dateRange;
  }

  get getExaminerNames() {
    return this.finGroup.controls.examinerName;
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  updateMultiSelectLabels() {
    this.claimsExaminerSelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " Examiner Selected"
          : this.value.length.toString() + " Examiners Selected";
      this.valuesAsString = label;
    };
  }

  getManagerClaimsExaminers() {
    this.claimsExaminer = [];
    if (this.role === "Claims Auditor") {
      this.auditDashboardService.getAuditorClaimsExaminers(this.role);
      this.claimsExaminer = this.auditDashboardService.auditorClaimsExaminersResponse;
      this.claimsExaminerSubscription = this.auditDashboardService
        .getAuditorClaimsExaminersListner()
        .subscribe(data => {
          this.claimsExaminer = data;
          this.mapClaimsExaminers();
          this.claimsExaminerSubscription.unsubscribe();
        });
    } else {
      this.taskManagementService.getManagerClaimsExaminers(this.role);
      this.claimsExaminer = this.taskManagementService.managerClaimsExaminersResponse;
      this.claimsExaminerSubscription = this.taskManagementService
        .getManagerClaimsExaminersListner()
        .subscribe(data => {
          this.claimsExaminer = data;
          this.mapClaimsExaminers();
          this.claimsExaminerSubscription.unsubscribe();
        });
    }
  }

  mapClaimsExaminers() {
    const examinersPresent = [];
    if (
      this.claimsExaminer &&
      this.claimsExaminer !== undefined &&
      this.claimsExaminer.length > 0
    ) {
      this.claimsExaminer.forEach(examiner => {
        examinersPresent.push({
          label: examiner.examinerName,
          value: {
            id: examiner.examinerId,
            name: examiner.examinerName,
            code: examiner.examinerName
          }
        });
      });
      this.claimsExaminerList = examinersPresent;
      const examiners = [];
      examinersPresent.forEach(item => examiners.push(item.value));
      this.finGroup.get("examinerName").setValue(examiners);
    }
    if (this.onload) {
      this.getFinDays();
    }
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.finGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      const invalidPer = diffInMonths < 1 ? true : false;

      if (!isValid) {
        this.finGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.finGroup.updateValueAndValidity();
      } else if (invalidPer) {
        this.finGroup.controls.dateRange.setErrors({
          invalidPeriod: true
        });
        this.finGroup.updateValueAndValidity();
      } else {
        this.finGroup.controls.dateRange.setErrors(null);
        this.finGroup.updateValueAndValidity();
        this.onSubmitFin();
      }
    } else {
      this.finGroup.controls.dateRange.setErrors({
        invalidPeriod: true
      });
    }
  }
  getMonths(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  changeExaminers() {
    this.updateMultiSelectLabels();
    this.validateExaminerSelection();
  }

  validateExaminerSelection() {
    if (!this.getExaminerNames.hasError("required")) {
      let examinerArray = [];
      examinerArray = this.finGroup.get("examinerName").value;
      const examinersExceeded = examinerArray.length > 25 ? true : false;
      if (examinersExceeded) {
        this.finGroup.controls.examinerName.setErrors({
          examinersExceeded: true
        });
        this.finGroup.updateValueAndValidity();
      } else {
        this.finGroup.controls.examinerName.setErrors(null);
        this.finGroup.updateValueAndValidity();
        this.onSubmitFin();
      }
    }
  }

  getFinChartNoValue() {
    this.isDataPresent = false;
    this.dataFin = [];
    this.myOptionsFin.legend.position = "none";
    this.myOptionsFinEnlarged.legend.position = "none";
    this.dataFin.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getFinChartValue(financialScoreManagerDtos) {
    this.isDataPresent = true;
    this.dataFin = [];
    this.myOptionsFin.legend.position = "top";
    this.myOptionsFinEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue =
      this.role === "Manager"
        ? financialScoreManagerDtos.financialScoreManagerDtos
        : this.role === "Claims Auditor"
        ? financialScoreManagerDtos.financialScoreAuditorDtos
        : financialScoreManagerDtos.financialScoreLeadDtos;
    this.columnNamesFin[1] = financialScoreManagerDtos.name;
    let min = 100;
    let target = 100;
    if (
      responseValue &&
      responseValue !== null &&
      responseValue !== undefined &&
      responseValue.length > 0
    ) {
      responseValue.forEach(val => {
        min =
          Number(val.financialAccuracy) < min
            ? Number(val.financialAccuracy)
            : min;
        target = Number(val.target) < target ? Number(val.target) : target;
        this.dataFin.push([
          this.datePipe.transform(val.monthStartDate, "MMM`yy"),
          val.financialAccuracy,
          val.financialAccuracy,
          val.target,
          val.target
        ]);
      });
      const minValue = min < target ? min - 10 : target - 10;
      this.myOptionsFin.vAxis.viewWindow.min = minValue;
      this.myOptionsFinEnlarged.vAxis.viewWindow.min = minValue;
    } else {
      this.getFinChartNoValue();
    }
  }

  getToDateValue() {
    const toDateValue =
      this.finGroup.get("dateRange").value[1] !== null &&
      this.finGroup.get("dateRange").value[1] !== "" &&
      this.finGroup.get("dateRange").value[1] !== undefined
        ? this.finGroup.get("dateRange").value[1]
        : this.finGroup.get("dateRange").value[0];
    return toDateValue;
  }

  mapClaimsExaminerList(examinerName) {
    this.claimsExaminerArray = [];
    if (examinerName && examinerName !== undefined && examinerName.length > 0) {
      examinerName.map(examiner => {
        this.claimsExaminerArray.push(examiner.id);
      });
    }
  }

  getFinDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.finGroup.get("dateRange").value[0];
    this.mapClaimsExaminerList(this.finGroup.get("examinerName").value);

    if (this.role === "Claims Auditor") {
      this.auditDashboardService.getAuditorFinScores(
        this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        this.claimsExaminerArray,
        this.role
      );
      this.financialScoreManagerDtos = this.auditDashboardService.auditorFinScoreResponse;
      this.financialScoreManagerDtos = null;
      this.finSubscription = this.auditDashboardService
        .getAuditorFinScoresListner()
        .subscribe((data: any) => {
          this.financialScoreManagerDtos = data;
          this.dataFin = [];
          const res =
            this.role === "Manager"
              ? this.financialScoreManagerDtos.financialScoreManagerDtos
              : this.role === "Claims Auditor"
              ? this.financialScoreManagerDtos.financialScoreAuditorDtos
              : this.financialScoreManagerDtos.financialScoreLeadDtos;
          res.length > 0
            ? this.getFinChartValue(this.financialScoreManagerDtos)
            : this.getFinChartNoValue();
          this.finSubscription.unsubscribe();
        });
    } else {
      this.taskManagementService.getManagerFinScores(
        this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        this.claimsExaminerArray,
        this.role
      );
      this.financialScoreManagerDtos = this.taskManagementService.managerFinScoreResponse;
      this.financialScoreManagerDtos = null;
      this.finSubscription = this.taskManagementService
        .getManagerFinScoresListner()
        .subscribe((data: any) => {
          this.financialScoreManagerDtos = data;
          this.dataFin = [];
          this.financialScoreManagerDtos
            ? this.getFinChartValue(this.financialScoreManagerDtos)
            : this.getFinChartNoValue();
          this.finSubscription.unsubscribe();
        });
    }
    if (this.financialScoreManagerDtos === null) {
      this.getFinChartNoValue();
    }
    this.isFinRendered = true;
    this.onload = false;
  }

  onSubmitFin() {
    if (this.finGroup.invalid) {
      return;
    }
    this.getFinDays();
  }

  ngOnDestroy() {
    this.finSubscription.unsubscribe();
  }
}
