import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { MultiSelect } from "primeng/multiselect";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ChartDetailService } from "src/app/services/chart-detail/chart-detail.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-audit-passed-vs-failed-examiner",
  templateUrl: "./audit-passed-vs-failed-examiner.component.html"
})
export class AuditPassedVsFailedExaminerComponent
  implements OnInit, OnDestroy, AfterViewInit { 
  @ViewChild("userGroupSelect", { static: false })
  select: MultiSelect;
  @ViewChild("claimsExaminerSelect", { static: false })
  claimsExaminerSelect: MultiSelect;
  private claimsExaminerSubscription: Subscription = new Subscription();
  userAuditScoreDto: any;
  enlargedDisplay = false;
  public isDataPresent = false;
  private statusSubscription: Subscription = new Subscription();
  private userGroupSubscription: Subscription = new Subscription();
  public userGroupList = [];
  public titleStatus = "";
  public claimsExaminerList = [];
  claimsExaminerArray: any[];
  public examinersExceeded = false;
  claimsExaminer: any[];
  public emptyGroup = false;
  public emptyExm = false;
  onload = true;
  public typeStatus = "BarChart";
  public columnNamesStatus = [
    "",
    "Audit Passed",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" }
  ];
  public optionsStatus = {
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
    colors: ["#4cc14f", "#ff5c5d"],
    hAxis: {
      minValue: 0,
      format: "0",
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
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 150,
      right: 10,
      top: 17,
      bottom: 20
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
    colors: ["#4cc14f", "#ff5c5d"],
    hAxis: {
      format: "0",
      minValue: 0,
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
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
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 260,
      right: 55,
      top: 30,
      bottom: 20
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        color: "black",
        fontSize: 13,
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
    }
  };
  public widthStatus = 500;
  public heightStatus = 220;
  public dataStatus = [];
  public inValidDate = false;
  public isStatusRendered = false;
  public countByStatusGroup: FormGroup;
  public maxDate = new Date();
  userGroup: any[];
  userGroupArray: any[];
  public role = "";
  public cols: any;
  public barDetails: {
    type: any;
    value: any;
    examinerName: any;
    userGroupId: any;
  };
  public detailsView: boolean;
  public chartDetails: any[];
  public userGroupIdArray = [];
  constructor(
    private fbStatus: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private chartDetailsService: ChartDetailService,
    private notifierService: NotifierService
  ) {
    const maxDay = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    const thirtyDaysBefore = new Date();
    const yesterday = new Date();
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDateRange = [];
    defaultDateRange.push(thirtyDaysBefore);
    defaultDateRange.push(yesterday);

    this.countByStatusGroup = fbStatus.group({
      dateRange: [defaultDateRange, Validators.required],
      userGroupName: ["", Validators.required],
      examinerName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getManagerUserGroups();
  }

  ngAfterViewInit() {
    this.select.updateLabel = function() {
      const label =
        this.value.length.toString() === "1"
          ? this.value.length.toString() + " User Group Selected"
          : this.value.length.toString() + " User Groups Selected";
      this.valuesAsString = label;
    };
    this.claimsExaminerSelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " Examiner Selected"
          : this.value.length.toString() + " Examiners Selected";
      this.valuesAsString = label;
    };
  }

  getManagerUserGroups() {
    this.userGroup = [];
    this.taskManagementService.getManagerUserGroups(this.role);
    this.userGroup = this.taskManagementService.managerUserGroupsResponse;
    this.userGroupSubscription = this.taskManagementService
      .getManagerUserGroupsListner()
      .subscribe(data => {
        this.userGroup = data;
        this.mapUserGroups();
        this.userGroupSubscription.unsubscribe();
      });
  }

  mapUserGroups() {
    this.userGroupList = [];
    if (
      this.userGroup &&
      this.userGroup !== undefined &&
      this.userGroup.length > 0
    ) {
      this.userGroup.forEach(s => {
        this.userGroupList.push({
          label: s.groupName,
          value: { id: s.groupId, name: s.groupName, code: s.groupName }
        });
      });
      const selectedScopes = [];
      this.userGroupList.forEach(item => selectedScopes.push(item.value));
      this.countByStatusGroup.get("userGroupName").setValue(selectedScopes);
    }
    this.getLeadClaimsExaminers();
  }

  getLeadClaimsExaminers() {
    this.claimsExaminer = [];
    this.mapUsergroupNameList(
      this.countByStatusGroup.get("userGroupName").value
    );
    this.taskManagementService.getLeadClaimsExaminers(this.userGroupArray);
    this.claimsExaminer = this.taskManagementService.leadClaimsExaminersResponse;
    this.claimsExaminerSubscription = this.taskManagementService
      .getLeadClaimsExaminersListner()
      .subscribe(data => {
        this.claimsExaminer = data;
        this.mapClaimsExaminers(this.claimsExaminer);
        this.claimsExaminerSubscription.unsubscribe();
      });
  }

  changeExaminers() {
    this.validateExm();
    this.validateExaminerSelection();
    this.onSubmitStatus();
  }

  validateExaminerSelection() {
    let examinerArray = [];
    examinerArray = this.countByStatusGroup.get("examinerName").value;
    this.examinersExceeded = examinerArray.length > 10 ? true : false;
  }

  validateGrp() {
    const groupList = this.countByStatusGroup.get("userGroupName").value;
    if (groupList && groupList.length > 0) {
      this.emptyGroup = false;
    } else {
      this.emptyGroup = true;
      this.countByStatusGroup.get("examinerName").setValue("");
    }
  }

  validateExm() {
    const exmList = this.countByStatusGroup.get("examinerName").value;
    if (exmList && exmList.length > 0) {
      this.emptyExm = false;
    } else {
      this.emptyExm = true;
    }
  }

  mapClaimsExaminers(claimsExaminer) {
    const examinersPresent = [];
    if (
      claimsExaminer &&
      claimsExaminer !== undefined &&
      claimsExaminer.length > 0
    ) {
      claimsExaminer.forEach(examiner => {
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
      this.countByStatusGroup.get("examinerName").setValue(examiners);
    }
    // if (this.onload) {
    this.getStatusDays();
    // }
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  validateDates() {
    const fromDateValue = this.countByStatusGroup.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      this.inValidDate = diffInMonths > 6 ? true : false;
    } else {
      this.inValidDate = false;
    }
  }

  getStatusChartNoValue() {
    this.isDataPresent = false;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.tooltip.trigger = "none";
    this.optionsStatusEnlarged.legend.position = "none";
    this.optionsStatus.tooltip.trigger = "none";
    this.userGroupArray = [];
    this.dataStatus.push(["NO DATA", 0, "0", 0, "0"]);
  }

  parseResponseValue(responseValue) {
    const responseValueLength = responseValue.userAuditScoreDto.length;
    let parsedResponseValue = [];
    for (let i = 0; i < responseValueLength; i++) {
      parsedResponseValue.push({
        userAuditScoreDto: {
          passedAuditCount: 0,
          failedAuditCount: 0,
          examinerName: ""
        }
      });
      responseValue.userAuditScoreDto.forEach(val => {
        this.userGroupIdArray.push(val.userGroupId);
      });
    }
    parsedResponseValue = this.mapParsedResponseValue(
      responseValue,
      parsedResponseValue
    );
    return parsedResponseValue;
  }

  mapParsedResponseValue(responseValue, parsedResponseValue) {
    responseValue.userAuditScoreDto.forEach((val, index) => {
      if (val.hasOwnProperty("passedAuditCount")) {
        parsedResponseValue[index].userAuditScoreDto.passedAuditCount =
          val.passedAuditCount;
      }
      if (val.hasOwnProperty("failedAuditCount")) {
        parsedResponseValue[index].userAuditScoreDto.failedAuditCount =
          val.failedAuditCount;
      }
      if (val.hasOwnProperty("examinerName")) {
        parsedResponseValue[index].userAuditScoreDto.examinerName =
          val.examinerName;
      }
    });
    return parsedResponseValue;
  }

  getStatusChartValue(userAuditScoreDto) {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.optionsStatus.legend.position = "top";
    this.optionsStatus.tooltip.trigger = "focus";
    this.optionsStatusEnlarged.legend.position = "top";
    this.optionsStatusEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = userAuditScoreDto;
    if (
      responseValue &&
      responseValue !== null &&
      responseValue !== undefined
    ) {
      this.userGroupIdArray = [];
      const parsedResponseValue = this.parseResponseValue(responseValue);
      parsedResponseValue.forEach(val => {
        this.dataStatus.push([
          val.userAuditScoreDto.examinerName,
          val.userAuditScoreDto.passedAuditCount,
          val.userAuditScoreDto.passedAuditCount,
          val.userAuditScoreDto.failedAuditCount,
          val.userAuditScoreDto.failedAuditCount
        ]);
      });
      this.setLeadChartOptions();
    } else {
      this.getStatusChartNoValue();
    }
  }

  changeUserGroups() {
    this.validateGrp();
    const userGroupList = this.countByStatusGroup.get("userGroupName").value;
    if (
      userGroupList &&
      userGroupList !== undefined &&
      userGroupList.length > 0
    ) {
      this.getLeadClaimsExaminers();
    }
    // this.onSubmitStatus();
  }

  getMonths(fromDateValue) {
    const fromDate = new Date(fromDateValue[0]);
    const toDate = new Date(fromDateValue[1]);
    const diffInMonths =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());
    return diffInMonths;
  }

  setLeadChartOptions() {
    const statusLength = this.dataStatus.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 4 ? statusLength * 20 : 120;
    const newGeneratedHeight = newHeight > 400 ? newHeight : 120;
    this.optionsStatusEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsStatus.height = newGeneratedHeight;
  }

  getToDateValue() {
    const toDateValue =
      this.countByStatusGroup.get("dateRange").value[1] !== null &&
      this.countByStatusGroup.get("dateRange").value[1] !== "" &&
      this.countByStatusGroup.get("dateRange").value[1] !== undefined
        ? this.countByStatusGroup.get("dateRange").value[1]
        : this.countByStatusGroup.get("dateRange").value[0];
    return toDateValue;
  }

  mapUsergroupNameList(userGroupName) {
    this.userGroupArray = [];
    if (
      userGroupName &&
      userGroupName !== undefined &&
      userGroupName !== "" &&
      userGroupName !== null &&
      userGroupName.length > 0
    ) {
      userGroupName.forEach(q => {
        this.userGroupArray.push(q.id);
      });
    }
  }

  mapClaimsExaminerList(examinerName) {
    this.claimsExaminerArray = [];
    if (examinerName && examinerName !== undefined && examinerName.length > 0) {
      examinerName.map(examiner => {
        this.claimsExaminerArray.push(examiner.id);
      });
    }
  }

  getStatusDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByStatusGroup.get("dateRange").value[0];
    this.mapUsergroupNameList(
      this.countByStatusGroup.get("userGroupName").value
    );
    this.mapClaimsExaminerList(
      this.countByStatusGroup.get("examinerName").value
    );
    this.taskManagementService.getLeadExaminerPassFailScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.userGroupArray,
      this.claimsExaminerArray
    );
    this.userAuditScoreDto = this.taskManagementService.leadExaminerPassFailScoreResponse;
    this.userAuditScoreDto = null;
    this.statusSubscription = this.taskManagementService
      .getLeadExaminerPassFailScoresListner()
      .subscribe((data: any) => {
        this.userAuditScoreDto = data;
        this.dataStatus = [];
        if (
          this.userAuditScoreDto &&
          this.userAuditScoreDto.userAuditScoreDto.length > 0
        ) {
          this.getStatusChartValue(this.userAuditScoreDto);
        } else {
          this.getStatusChartNoValue();
        }
        this.statusSubscription.unsubscribe();
        if (this.onload) {
          this.mapLoadedExaminersToExaminers(this.userAuditScoreDto);
        }
      });
    if (this.userAuditScoreDto === null) {
      this.getStatusChartNoValue();
    }
    this.isStatusRendered = true;
  }

  mapLoadedExaminersToExaminers(userAuditScoreDto) {
    const exminer = [];
    const examiners = [];
    this.claimsExaminer.forEach(ex => {
      userAuditScoreDto.userAuditScoreDto.map(dto => {
        if (dto.examinerId === ex.examinerId) {
          exminer.push({
            label: dto.examinerName,
            value: {
              id: dto.examinerId,
              name: dto.examinerName,
              code: dto.examinerName
            }
          });
        }
      });
    });
    exminer.forEach(item => examiners.push(item.value));
    this.countByStatusGroup.get("examinerName").setValue(examiners);
    this.isStatusRendered = true;
    this.onload = false;
  }

  onSubmitStatus() {
    if (
      !this.examinersExceeded &&
      !this.emptyGroup &&
      !this.emptyExm &&
      !this.inValidDate
    ) {
      this.getStatusDays();
    }
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns();
      this.detailsView = true;
      this.chartDetails = [];
      this.chartDetailsService
        .passedVsFailedDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetails = res || [];
        });
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataStatus[bar.row];
    const barDetails = {
      type: this.columnNamesStatus[bar.column],
      value: barValue[bar.column],
      examinerName: barValue[0],
      userGroupId: this.userGroupIdArray[bar.row]
    };
    return barDetails;
  }

  setColumns() {
    const cols = [
      { header: "Claim ID", field: "claimId" },
      { header: "Auditor Name", field: "auditorName" },
      { header: "Audit Status", field: "auditStatus" },
      { header: "Claim Age (In Days)", field: "claimAge" },
      { header: "Examiner Name", field: "examinerName" },
      { header: "Processed Date", field: "processedDate" },
      { header: "Claim Type", field: "claimType" },
      { header: "Claim Status", field: "claimStatus" },
      { header: "Billed Amount ($)", field: "billedAmount" },
      { header: "Allowed Amount($)", field: "allowedAmount" },
      { header: "Paid Amount($)", field: "paidAmount" }
    ];
    return cols;
  }

  downloadExcel() {
    this.notifierService.throwNotification({
      type: "info",
      message: "Report is being generated. Please wait."
    });
    this.chartDetailsService
      .passedVsFailedExcel(this.constructPayload())
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
        const fileName = `Audit Passed Vs Failed By Claims Examiner-${dateString}`;
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

  private constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.countByStatusGroup.get("dateRange").value[0];
    const filteredExaminer = this.claimsExaminerList.filter(
      e => e.label === this.barDetails.examinerName
    )[0];
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status:
        String(this.barDetails.type).indexOf("Passed") > -1
          ? "Passed"
          : "Failed",
      examinerId: filteredExaminer.value.id,
      examinerName: this.barDetails.examinerName,
      userGroupId: this.barDetails.userGroupId
    };
    return payload;
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
