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
  selector: "app-manager-procedural-score",
  templateUrl: "./manager-procedural-score.component.html"
})
export class ManagerProceduralScoreComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("claimsExaminerSelect", { static: false })
  claimsExaminerSelect: MultiSelect;
  proceduralScoreManagerDtos: any;
  public isDataPresent = false;
  enlargedDisplay = false;
  onload = true;
  private procSubscription: Subscription = new Subscription();
  private claimsExaminerSubscription: Subscription = new Subscription();
  public titleProc = "";
  public claimsExaminerList = [];
  public examinersExceeded = false;
  public typeProc = "LineChart";
  @Input()
  public isManager: boolean;
  public columnNamesProc = [
    "",
    "Procedural Score",
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
  public myOptionsProc = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#058ba3", "#b84066"],
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
            length: 16
          }
        }
      }
    }
  };

  public myOptionsProcEnlarged = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 13
      }
    },
    colors: ["#058ba3", "#b84066"],
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
  public widthProc = 520;
  public heightProc = 150;
  claimsExaminerArray: any[];
  public dataProc = [];
  public isProcRendered = false;
  public role = "";
  public procGroup: FormGroup;
  public maxDate = new Date();
  claimsExaminer: any[];

  constructor(
    private fbProc: FormBuilder,
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

    this.procGroup = fbProc.group({
      dateRange: [defaultDateRange, Validators.required],
      examinerName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getManagerClaimsExaminers();
    this.onSubmitProc();
  }

  get getDateRange() {
    return this.procGroup.controls.dateRange;
  }

  get getExaminerNames() {
    return this.procGroup.controls.examinerName;
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
      this.procGroup.get("examinerName").setValue(examiners);
    }
    if (this.onload) {
      this.getProcDays();
    }
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.procGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      const invalidPer = diffInMonths < 1 ? true : false;

      if (!isValid) {
        this.procGroup.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.procGroup.updateValueAndValidity();
      } else if (invalidPer) {
        this.procGroup.controls.dateRange.setErrors({
          invalidPeriod: true
        });
        this.procGroup.updateValueAndValidity();
      } else {
        this.procGroup.controls.dateRange.setErrors(null);
        this.procGroup.updateValueAndValidity();
        this.onSubmitProc();
      }
    } else {
      this.procGroup.controls.dateRange.setErrors({
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
      examinerArray = this.procGroup.get("examinerName").value;
      const examinersExceeded = examinerArray.length > 25 ? true : false;
      if (examinersExceeded) {
        this.procGroup.controls.examinerName.setErrors({
          examinersExceeded: true
        });
        this.procGroup.updateValueAndValidity();
      } else {
        this.procGroup.controls.examinerName.setErrors(null);
        this.procGroup.updateValueAndValidity();
        this.onSubmitProc();
      }
    }
  }

  getProcChartNoValue() {
    this.dataProc = [];
    this.isDataPresent = false;
    this.myOptionsProc.legend.position = "none";
    this.myOptionsProcEnlarged.legend.position = "none";
    this.dataProc.push(["NO DATA", 0, "0", 0, "0"]);
  }

  getProcChartValue(proceduralScoreManagerDtos) {
    this.isDataPresent = true;
    this.dataProc = [];
    this.myOptionsProc.legend.position = "top";
    this.myOptionsProcEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue =
      this.role === "Manager"
        ? proceduralScoreManagerDtos.proceduralScoreManagerDtos
        : this.role === "Claims Auditor"
        ? proceduralScoreManagerDtos.proceduralScoreAuditorTeamDtos
        : proceduralScoreManagerDtos.proceduralScoreLeadDtos;
    this.columnNamesProc[1] = proceduralScoreManagerDtos.name;
    if (
      responseValue &&
      responseValue !== null &&
      responseValue !== undefined &&
      responseValue.length > 0
    ) {
      let min = 100;
      let target = 100;
      responseValue.forEach(val => {
        min =
          Number(val.proceduralAccuracy) < min
            ? Number(val.proceduralAccuracy)
            : min;
        target = Number(val.target) < target ? Number(val.target) : target;
        this.dataProc.push([
          this.datePipe.transform(val.monthStartDate, "MMM`yy"),
          val.proceduralAccuracy,
          val.proceduralAccuracy,
          val.target,
          val.target
        ]);
      });
      const minValue = min < target ? min - 10 : target - 10;
      this.myOptionsProc.vAxis.viewWindow.min = minValue;
      this.myOptionsProcEnlarged.vAxis.viewWindow.min = minValue;
    } else {
      this.getProcChartNoValue();
    }
  }

  getToDateValue() {
    const toDateValue =
      this.procGroup.get("dateRange").value[1] !== null &&
      this.procGroup.get("dateRange").value[1] !== "" &&
      this.procGroup.get("dateRange").value[1] !== undefined
        ? this.procGroup.get("dateRange").value[1]
        : this.procGroup.get("dateRange").value[0];
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

  getProcDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.procGroup.get("dateRange").value[0];
    this.mapClaimsExaminerList(this.procGroup.get("examinerName").value);

    if (this.role === "Claims Auditor") {
      this.auditDashboardService.getAuditorProcScores(
        this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        this.claimsExaminerArray,
        this.role
      );
      this.proceduralScoreManagerDtos = this.auditDashboardService.auditorProcScoreResponse;
      this.proceduralScoreManagerDtos = null;
      this.procSubscription = this.auditDashboardService
        .getAuditorProcScoresListner()
        .subscribe((data: any) => {
          this.proceduralScoreManagerDtos = data;
          this.dataProc = [];
          const res =
            this.role === "Manager"
              ? this.proceduralScoreManagerDtos.proceduralScoreManagerDtos
              : this.role === "Claims Auditor"
              ? this.proceduralScoreManagerDtos.proceduralScoreAuditorTeamDtos
              : this.proceduralScoreManagerDtos.proceduralScoreLeadDtos;
          res.length > 0
            ? this.getProcChartValue(this.proceduralScoreManagerDtos)
            : this.getProcChartNoValue();
          this.procSubscription.unsubscribe();
        });
    } else {
      this.taskManagementService.getManagerProcScores(
        this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        this.claimsExaminerArray,
        this.role
      );
      this.proceduralScoreManagerDtos = this.taskManagementService.managerProcScoreResponse;
      this.proceduralScoreManagerDtos = null;
      this.procSubscription = this.taskManagementService
        .getManagerProcScoresListner()
        .subscribe((data: any) => {
          this.proceduralScoreManagerDtos = data;
          this.dataProc = [];
          this.proceduralScoreManagerDtos
            ? this.getProcChartValue(this.proceduralScoreManagerDtos)
            : this.getProcChartNoValue();
          this.procSubscription.unsubscribe();
        });
    }
    if (this.proceduralScoreManagerDtos === null) {
      this.getProcChartNoValue();
    }
    this.isProcRendered = true;
    this.onload = false;
  }

  onSubmitProc() {
    if (this.procGroup.invalid) {
      return;
    }
    this.getProcDays();
  }

  ngOnDestroy() {
    this.procSubscription.unsubscribe();
  }
}
