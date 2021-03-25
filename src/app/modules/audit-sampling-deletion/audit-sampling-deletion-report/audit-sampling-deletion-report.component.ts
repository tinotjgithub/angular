import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditSamplingDeletionService } from "./../audit-sampling-deletion.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-audit-sampling-deletion-report",
  templateUrl: "./audit-sampling-deletion-report.component.html"
})
export class AuditSamplingDeletionReportComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("samplingTable", { static: false }) samplingTable;
  @ViewChild("nameSelect", { static: false })
  nameSelect: MultiSelect;
  @ViewChild("roleSelect", { static: false })
  roleSelect: MultiSelect;
  filteredValues = [];
  public userRoles: any[];
  public samplingDeleteReportGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isNameDisabled = true;
  public nameList = [];
  showSpinner = false;
  roleSeledtedArray = [];
  nam: any[];
  public isDataPresent = false;
  public claimsAuditedSatusVal = 0;
  public claimsAuditedSatusLbl = "";
  currentActiveFrom = "";
  currentActiveTo = "";
  leads: any[];
  public todayDate;
  leadList: any[];
  public roleList = [];
  cols: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  excelSubscription: Subscription = new Subscription();
  nameSubscription: Subscription = new Subscription();
  public maxDate;
  public isOnLoad = false;
  @Input()
  fromTab: boolean;
  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private auditSamplingDeletionService: AuditSamplingDeletionService,
    private datePipe: DatePipe
  ) {
    const maxDay = new Date();
    this.todayDate = new Date();
    maxDay.setDate(maxDay.getDate() - 1);
    this.maxDate = maxDay;
    const thirtyDaysBefore = new Date();
    const yesterday = new Date();
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 31);
    yesterday.setDate(yesterday.getDate() - 1);
    this.samplingDeleteReportGroup = this.fb.group({
      activeFrom: [thirtyDaysBefore, [Validators.required]],
      activeTo: [yesterday, [Validators.required]],
      deletedByName: ["", Validators.required],
      userRole: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.setCols();
    this.isOnLoad = true;
    this.getUserRoleList();
  }

  getDeletedBy(rolArray) {
    this.nam = [];
    this.auditSamplingDeletionService.getDeletedByNames(rolArray);
    this.nam = this.auditSamplingDeletionService.deletedByNamesResponse;
    this.nameSubscription = this.auditSamplingDeletionService
      .getDeletedByNamesListner()
      .subscribe(
        res => {
          this.nam = res;
          this.mapDeletedByNames();
          this.nameSubscription.unsubscribe();
        },
        err => {
          this.nameSubscription.unsubscribe();
        }
      );
  }

  getUserRoleList() {
    this.roleList = [];
    // this.samplingDeleteReportGroup.get("userRole").setValue("");
    this.userRoles = [];
    this.samplingDeleteReportGroup.get("userRole").setValue("");
    this.auditSamplingDeletionService.getUserRoles();
    this.userRoles = this.auditSamplingDeletionService.deletedByRolesResponse;
    this.auditSamplingDeletionService.getUserRolesListner().subscribe(
      res => {
        this.userRoles = [];
        if (res) {
          res.forEach(item => {
            this.userRoles.push({
              label: item.label,
              value: {
                id: item.value,
                name: item.label,
                code: item.label
              }
            });
          });
          this.roleList = this.userRoles;
          this.mapRole();
        }
      },
      err => {}
    );
  }

  mapDeletedByNames() {
    this.nameList = [];
    const assignedByPresent = [];
    if (this.nam && this.nam !== undefined && this.nam.length > 0) {
      this.nam.forEach(names => {
        assignedByPresent.push({
          label: names.label,
          value: {
            id: names.value,
            name: names.label,
            code: names.label
          }
        });
      });
      this.nameList = assignedByPresent;
    }
    this.mapNam();
  }

  mapNam() {
    this.samplingDeleteReportGroup.get("deletedByName").setValue("");
    const selectedScopes = [];
    this.nameList.forEach(item => selectedScopes.push(item.value));
    this.samplingDeleteReportGroup
      .get("deletedByName")
      .setValue(selectedScopes);
  }

  mapDeletedBy(deletedByName) {
    const assignedByPresent = [];
    if (
      deletedByName &&
      deletedByName !== undefined &&
      deletedByName.length > 0
    ) {
      deletedByName.forEach(names => {
        assignedByPresent.push({
          label: names.name,
          value: names.id
        });
      });
    }
    return assignedByPresent;
  }

  samplingDeletionReport() {
    const { activeFrom, activeTo } = this.samplingDeleteReportGroup.value;
    const payload = {
      deletionStartDate: this.getFormattedDate(activeFrom, true),
      deletionEndDate: this.getFormattedDate(activeTo, true),
      roleSelected: this.roleSeledtedArray,
      deletedByName: this.mapDeletedBy(
        this.samplingDeleteReportGroup.get("deletedByName").value
      )
    };
    this.currentActiveFrom = payload.deletionStartDate;
    this.currentActiveTo = payload.deletionEndDate;
    this.isDataPresent = true;
    this.auditSamplingDeletionService.samplingDeletionReport(payload);
    this.gridData = this.auditSamplingDeletionService.samplingDeletionReportResponse;
    this.gridData = [];
    this.showSpinner = true;
    this.reportSubscription = this.auditSamplingDeletionService
      .samplingDeletionReportListner()
      .subscribe(
        (data: any) => {
          if (data) {
            this.gridData = data;
            this.showSpinner = false;
          }
          this.reportSubscription.unsubscribe();
        },
        err => {
          this.showSpinner = false;
          this.reportSubscription.unsubscribe();
        }
      );
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    } else {
      const valid = this.validateDates();
      if (valid) {
        this.samplingDeleteReportGroup.controls.activeTo.setErrors(null);
        this.samplingDeleteReportGroup.controls.activeFrom.setErrors(null);
        this.samplingDeleteReportGroup.updateValueAndValidity();
      }
    }
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "deletedDate", header: "Deletion Date" },
      { field: "deletedUserName", header: "Deleted User Name" },
      { field: "deleteComments", header: "Delete Comments" }
    ];
  }

  getClaims() {
    const claims = [];
    this.filteredValues.forEach(claim => {
      claims.push(claim);
    });
    return claims;
  }

  getFilteredUsers(event) {
    this.filteredValues = event.filteredValue;
  }

  get getActiveFrom() {
    return this.samplingDeleteReportGroup.controls.activeFrom;
  }

  get getActiveTo() {
    return this.samplingDeleteReportGroup.controls.activeTo;
  }

  get getUserRole() {
    return this.samplingDeleteReportGroup.controls.userRole;
  }

  get getDeletedByName() {
    return this.samplingDeleteReportGroup.controls.deletedByName;
  }

  submit() {
    const valid = this.validateDates();
    if (valid) {
      this.samplingDeletionReport();
      if (this.samplingTable && this.samplingTable !== undefined) {
        this.samplingTable.reset();
      }
    }
  }

  exportExcel() {
    if (this.samplingDeleteReportGroup.invalid) {
      return;
    }
    const { activeFrom, activeTo } = this.samplingDeleteReportGroup.value;
    const payload = {
      deletionStartDate: this.getFormattedDate(activeFrom, true),
      deletionEndDate: this.getFormattedDate(activeTo, true),
      roleSelected: this.roleSeledtedArray,
      deletedByName: this.mapDeletedBy(
        this.samplingDeleteReportGroup.get("deletedByName").value
      )
    };
    this.showSpinner = true;
    this.excelSubscription = this.auditSamplingDeletionService
      .samplingDeletionReportExcel(payload)
      .subscribe(
        res => {
          this.notifierService.throwNotification({
            type: "info",
            message: "Report is being generated. Please wait."
          });
          const responseBody = res.body;
          this.showSpinner = false;
          const blob = new Blob([responseBody], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          const today = new Date();
          const dateString = this.datePipe.transform(today, "MMddyyyy");
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(
              blob,
              "Audit Sampling Claim Deletion Report-" + dateString + ".xlsx"
            );
          } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute(
                "download",
                "Audit Sampling Claim Deletion Report-" + dateString + ".xlsx"
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
          this.excelSubscription.unsubscribe();
        },
        err => {
          this.showSpinner = false;
          this.excelSubscription.unsubscribe();
        }
      );
  }

  getFormattedDate(date, twisted = false) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return twisted
      ? year + "-" + month + "-" + day
      : month + "/" + day + "/" + year;
  }

  validateDates() {
    const activeFrom = this.samplingDeleteReportGroup.get("activeFrom").value;
    const activeTo = this.samplingDeleteReportGroup.get("activeTo").value;
    const diffInMonths = this.getMonths(activeFrom, activeTo);
    const isValid = diffInMonths > 6 ? false : true;
    if (!isValid) {
      this.samplingDeleteReportGroup.controls.activeTo.setErrors({
        rangeError: true
      });
      this.samplingDeleteReportGroup.updateValueAndValidity();
    } else {
      this.samplingDeleteReportGroup.controls.activeTo.setErrors(null);
      this.samplingDeleteReportGroup.updateValueAndValidity();
    }
    return isValid;
  }

  ngAfterViewInit() {
    this.updateRoleMultiSelectLabel();
    this.updateNameMultiSelectLabel();
  }
  updateNameMultiSelectLabel() {
    this.nameSelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " name selected"
          : this.value.length.toString() + " names selected";
      this.valuesAsString = label;
    };
  }

  updateRoleMultiSelectLabel() {
    this.roleSelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " role selected"
          : this.value.length.toString() + " roles selected";
      this.valuesAsString = label;
    };
  }

  changeNames() {
    this.isOnLoad = false;
    this.updateNameMultiSelectLabel();
  }

  changeRoles(evt) {
    this.isOnLoad = false;
    this.updateRoleMultiSelectLabel();
    this.isNameDisabled = true;
    this.nameList = [];
    this.samplingDeleteReportGroup.get("deletedByName").setValue("");
    this.roleSeledtedArray = [];
    this.mapRoleValues(evt);
  }

  mapRole() {
    const selectedScopes = [];
    this.roleSeledtedArray = [];
    this.userRoles.forEach(item => selectedScopes.push(item.value));
    this.samplingDeleteReportGroup.get("userRole").setValue(selectedScopes);
    this.userRoles.forEach(rol => {
      this.roleSeledtedArray.push({
        label: rol.value.name,
        value: rol.value.id
      });
    });
    if (this.roleSeledtedArray.length > 0) {
      this.getDeletedBy(this.roleSeledtedArray);
      this.isNameDisabled = false;
    }
  }

  mapRoleValues(ev) {
    this.userRoles.forEach(rol => {
      ev.value.forEach(evval => {
        if (evval.id === rol.value.id) {
          this.roleSeledtedArray.push({
            label: rol.value.name,
            value: rol.value.id
          });
        }
      });
    });
    if (this.roleSeledtedArray.length > 0) {
      this.getDeletedBy(this.roleSeledtedArray);
      this.isNameDisabled = false;
    }
  }

  getMonths(deletionStartDate, deletionEndDate) {
    const diffInMonths =
      (deletionEndDate.getFullYear() - deletionStartDate.getFullYear()) * 12 +
      (deletionEndDate.getMonth() - deletionStartDate.getMonth());
    return diffInMonths;
  }

  ngOnDestroy() {
    this.excelSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
    this.nameSubscription.unsubscribe();
  }
}
