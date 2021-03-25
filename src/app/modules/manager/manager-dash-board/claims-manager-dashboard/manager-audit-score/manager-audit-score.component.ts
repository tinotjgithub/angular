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

@Component({
  selector: "app-manager-audit-score",
  templateUrl: "./manager-audit-score.component.html"
})
export class ManagerAuditScoreComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("userGroupSelect", { static: false }) userGroupSelect: MultiSelect;
  userAuditScoreDto: any;
  public isDataPresent = false;
  public enlargedDisplay = false;
  userAuditReportDto: any;
  userGroup: any[];
  public userGroupList = [];
  public userGroupIdArray = [];
  private auditSubscription: Subscription = new Subscription();
  private userGroupSubscription: Subscription = new Subscription();
  public titleAudit = "";
  public typeAudit = "BarChart";
  public columnNamesAudit = [
    "",
    "Audit Passed",
    { role: "annotation" },
    "Audit Failed",
    { role: "annotation" }
  ];
  public optionsAudit = {
    height: 158,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 12
      }
    },
    colors: ["#4cc14f", "#ff5c5d"],
    hAxis: {
      format: "0",
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
      right: 40,
      top: 17,
      bottom: 20
    },
    annotations: {
      textStyle: {
        fontSize: 12,
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
    // isStacked: true
  };

  public optionsAuditEnlarged = {
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal",
        fontSize: 13
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
    annotations: {
      textStyle: {
        fontSize: 14,
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
      left: 260,
      right: 55,
      top: 20,
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
    // isStacked: true
  };
  public widthAudit = 400;
  public heightAudit = 250;
  public dataAudit = [];
  public isValid = true;
  public isAuditRendered = false;
  public auditDates: FormGroup;
  public maxDate = new Date();
  public role = "";
  userGroupArray: any[];
  public cols: any;
  public barDetails: { type: any; value: any; leadName: any; userGroupId: any };
  public detailsView: boolean;
  public chartDetails: any[];

  constructor(
    private fbAudit: FormBuilder,
    private taskManagementService: TaskmanagementService,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private chartService: ChartDetailService,
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
    this.auditDates = fbAudit.group({
      dateRange: [defaultDateRange, Validators.required],
      userGroupName: ["", Validators.required]
    });
  }

  get getDateRange() {
    return this.auditDates.controls.dateRange;
  }

  get getUserGroupName() {
    return this.auditDates.controls.userGroupName;
  }

  ngOnInit() {
    this.role = this.secureLocalStorage.getItem("roleId");
    this.getManagerUserGroups();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  updateMultiSelectLabels() {
    this.userGroupSelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " User Group Selected"
          : this.value.length.toString() + " User Groups Selected";
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
      this.auditDates.get("userGroupName").setValue(selectedScopes);
    }
    this.getAuditDays();
  }

  showDialog() {
    this.optionsAudit.annotations.textStyle.fontSize = 14;
    this.enlargedDisplay = true;
  }

  changeUserGroups() {
    this.updateMultiSelectLabels();
    this.onSubmitAudit();
  }

  validateDates() {
    const fromDateValue = this.auditDates.get("dateRange").value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = this.getMonths(fromDateValue);
      const isValid = diffInMonths > 6 ? false : true;
      if (!isValid) {
        this.auditDates.controls.dateRange.setErrors({
          inValidDate: true
        });
        this.auditDates.updateValueAndValidity();
      } else {
        this.auditDates.controls.dateRange.setErrors(null);
        this.auditDates.updateValueAndValidity();
        this.onSubmitAudit();
      }
    } else {
      this.auditDates.controls.dateRange.setErrors(null);
      this.auditDates.updateValueAndValidity();
      this.onSubmitAudit();
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

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    this.dataAudit.push(["NO DATA", 0, "0", 0, "0"]);
    this.userGroupIdArray = [];
  }

  getAuditChartValue() {
    this.isDataPresent = true;
    this.dataAudit = [];
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    let responseValue = [];
    this.userGroupIdArray = [];
    responseValue = this.userAuditScoreDto.userAuditScoreDto;
    if (
      responseValue &&
      responseValue !== undefined &&
      responseValue !== null &&
      responseValue.length > 0
    ) {
      responseValue.forEach(val => {
        this.dataAudit.push([
          val.leadName,
          val.passedAuditCount,
          val.passedAuditCount,
          val.failedAuditCount,
          val.failedAuditCount
        ]);
        this.userGroupIdArray.push(val.userGroupId);
      });
    }
    this.setManagerChartOptions();
  }

  setManagerChartOptions() {
    const statusLength = this.dataAudit.length;
    const newHeightEnlarged = statusLength > 4 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 4 ? statusLength * 20 : 400;
    const newGeneratedHeight = newHeight > 400 ? newHeight : 400;
    this.optionsAuditEnlarged.height = newGeneratedHeightEnlarged;
    this.optionsAudit.height = newGeneratedHeight;
  }

  getToDateValue() {
    const toDateValue =
      this.auditDates.get("dateRange").value[1] !== null &&
      this.auditDates.get("dateRange").value[1] !== "" &&
      this.auditDates.get("dateRange").value[1] !== undefined
        ? this.auditDates.get("dateRange").value[1]
        : this.auditDates.get("dateRange").value[0];
    return toDateValue;
  }

  getAuditDays() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.auditDates.get("dateRange").value[0];
    this.mapUserGroupList(this.auditDates.get("userGroupName").value);
    this.taskManagementService.getManagerAuditScores(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.userGroupArray
    );
    this.userAuditScoreDto = this.taskManagementService.managerAuditScoreResponse;
    this.userAuditScoreDto = null;
    this.auditSubscription = this.taskManagementService
      .getManagerAuditScoresListner()
      .subscribe(data => {
        this.userAuditScoreDto = data;
        this.dataAudit = [];
        this.userAuditScoreDto &&
        this.userAuditScoreDto.userAuditScoreDto.length > 0
          ? this.getAuditChartValue()
          : this.getAuditChartNoValue();
        this.auditSubscription.unsubscribe();
      });
    if (
      this.userAuditScoreDto === null ||
      this.userAuditScoreDto === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }

  mapUserGroupList(userGroupName) {
    this.userGroupArray = [];
    if (
      userGroupName &&
      userGroupName !== undefined &&
      userGroupName.length > 0
    ) {
      userGroupName.map(user => {
        this.userGroupArray.push(user.id);
      });
    }
  }

  onSubmitAudit() {
    if (this.auditDates.invalid) {
      return;
    }
    this.getAuditDays();
  }

  constructPayload() {
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.auditDates.get("dateRange").value[0];
    const filtered = this.userAuditScoreDto.userAuditScoreDto.filter(
      e => e.leadName === this.barDetails.leadName
    );
    const payload = {
      fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      status:
        String(this.barDetails.type).indexOf("Passed") > -1
          ? "Passed"
          : "Failed",
      leadId: filtered[0].leadId,
      leadName: this.barDetails.leadName,
      userGroupId: this.barDetails.userGroupId
    };
    return payload;
  }

  selectBar(bar) {
    this.barDetails = this.getBarDetails(bar[0]);
    if (typeof this.barDetails.type === "string") {
      this.cols = this.setColumns();
      this.chartDetails = [];
      this.chartService
        .auditScoreDetails(this.constructPayload())
        .subscribe(res => {
          this.chartDetails = res || [];
        });
      this.detailsView = true;
    }
  }

  getBarDetails(bar: { row: number; column: number }) {
    const barValue = this.dataAudit[bar.row];
    const barDetails = {
      type: this.columnNamesAudit[bar.column],
      value: barValue[bar.column],
      leadName: barValue[0],
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
    this.chartService
      .auditScoreExcel(this.constructPayload())
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
        const fileName = `AuditPassedVsFailed-${dateString}`;
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
