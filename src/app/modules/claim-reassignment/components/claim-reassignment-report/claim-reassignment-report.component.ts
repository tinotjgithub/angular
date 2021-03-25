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
import { ClaimReassignmentService } from "./../../service/claim-reassignment.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-claim-reassignment-report",
  templateUrl: "./claim-reassignment-report.component.html"
})
export class ClaimReassignmentReportComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("ressignmentTable", { static: false }) ressignmentTable;
  @ViewChild("reassignedBySelect", { static: false })
  reassignedBySelect: MultiSelect;
  filteredValues = [];
  public claimReassignmentGroup: FormGroup;
  public today = new Date();
  public gridData: any[];
  showSpinner = false;
  reassignedByArray: any[];
  public isDataPresent = false;
  reassignedBy: any[];
  public claimsAuditedSatusVal = 0;
  public claimsAuditedSatusLbl = "";
  public reassignedByList = [];
  public currentReassignmentByName: any = [];
  currentActiveFrom = "";
  currentActiveTo = "";
  leads: any[];
  leadList: any[];
  cols: { field: string; header: string }[];
  reportSubscription: Subscription = new Subscription();
  excelSubscription: Subscription = new Subscription();
  private reassignedBySubscription: Subscription = new Subscription();
  public maxDate;
  reassignedByNam: any[];
  @Input()
  fromTab: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private claimReassignmentService: ClaimReassignmentService,
    private datePipe: DatePipe
  ) {
    const todaysDate = new Date();
    this.maxDate = todaysDate;
    const today = new Date();
    const threeMonthsBefore = new Date(today.setMonth(today.getMonth() - 3));
    this.claimReassignmentGroup = this.fb.group({
      reassignmentStartDate: [threeMonthsBefore, [Validators.required]],
      reassignmentEndDate: [todaysDate, [Validators.required]],
      reassignedByNam: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.setCols();
    this.getReassignedBy();
  }

  ngAfterViewInit() {
    this.updateMultiSelectLabels();
  }

  updateMultiSelectLabels() {
    this.reassignedBySelect.updateLabel = function() {
      const label =
        this.value.length === 1
          ? this.value.length.toString() + " user selected"
          : this.value.length.toString() + " users selected";
      this.valuesAsString = label;
    };
  }

  changeReassignedBy() {
    this.updateMultiSelectLabels();
  }

  mapReassignmentList(reassignedBy) {
    this.reassignedByArray = [];
    if (reassignedBy && reassignedBy !== undefined && reassignedBy.length > 0) {
      reassignedBy.map(by => {
        this.reassignedByArray.push({ value: by.id, label: by.name });
      });
    }
    return this.reassignedByArray;
  }

  getReassignmentReport() {
    const {
      reassignmentStartDate,
      reassignmentEndDate,
      reassignedByNam
    } = this.claimReassignmentGroup.value;
    this.currentReassignmentByName = this.mapReassignmentList(reassignedByNam);
    const payload = {
      reassignmentStartDate: this.getFormattedDate(reassignmentStartDate, true),
      reassignmentEndDate: this.getFormattedDate(reassignmentEndDate, true),
      reassignedByName: this.currentReassignmentByName
    };
    this.currentReassignmentByName = reassignedByNam;
    this.currentActiveFrom = payload.reassignmentStartDate;
    this.currentActiveTo = payload.reassignmentEndDate;
    this.reassignedByNam = reassignedByNam;
    this.isDataPresent = true;
    this.claimReassignmentService.getReassignmentReport(payload);
    this.gridData = this.claimReassignmentService.reassignmentResponse;
    this.gridData = [];
    this.showSpinner = true;
    this.reportSubscription = this.claimReassignmentService
      .getAuditedClaimsReportListner()
      .subscribe(
        res => {
          this.notifierService.throwNotification({
            type: "success",
            message: "Report Fetched Successfully"
          });
          this.showSpinner = false;
          this.gridData = res;
          this.reportSubscription.unsubscribe();
        },
        err => {
          this.showSpinner = false;
          this.gridData = [];
          this.notifierService.throwNotification({
            type: "success",
            message: "No Data Present"
          });
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
        this.claimReassignmentGroup.controls.reassignmentEndDate.setErrors(
          null
        );
        this.claimReassignmentGroup.controls.reassignmentStartDate.setErrors(
          null
        );
        this.claimReassignmentGroup.updateValueAndValidity();
      }
    }
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "userGroup", header: "User Group Name" },
      { field: "queueName", header: "Queue Name" },
      { field: "wfmStatus", header: "WFM Status" },
      { field: "wfmAge", header: "WFM Age (In Days)" },
      { field: "reassignedDate", header: "Reassigned Date" },
      { field: "reassignedByRole", header: "Reassigned By Role" },
      { field: "reassignedByName", header: "Reassigned By Name" },
      { field: "assignedFromRole", header: "Assigned From Role" },
      { field: "assignedFromName", header: "Assigned From Name" },
      { field: "assignedToRole", header: "Assigned To Role" },
      { field: "assignedToName", header: "Assigned To Name" },
      { field: "reassignReason", header: "Reassignment Reason" },
      { field: "reassignComments", header: "Reassignment Comment" }
    ];
  }

  getFilteredUsers(event) {
    this.filteredValues = event.filteredValue;
  }

  get getActiveFrom() {
    return this.claimReassignmentGroup.controls.reassignmentStartDate;
  }

  get getActiveTo() {
    return this.claimReassignmentGroup.controls.reassignmentEndDate;
  }

  get getClaimReassignmentGroup() {
    return this.claimReassignmentGroup.controls.reassignedByNam;
  }

  submit() {
    const valid = this.validateDates();
    if (valid) {
      this.getReassignmentReport();
      if (this.ressignmentTable && this.ressignmentTable !== undefined) {
        this.ressignmentTable.reset();
      }
    }
  }

  getReassignedBy() {
    this.reassignedBy = [];
    this.claimReassignmentService.getReassignedBy();
    this.reassignedBy = this.claimReassignmentService.reassignmentByResponse;
    this.reassignedBySubscription = this.claimReassignmentService
      .getReassignedByListner()
      .subscribe(
        res => {
          this.reassignedBy = res;
          this.mapReassignedBy();
          this.reassignedBySubscription.unsubscribe();
        },
        err => {
          this.reassignedBySubscription.unsubscribe();
        }
      );
  }

  mapReassignedBy() {
    const assignedByPresent = [];
    if (
      this.reassignedBy &&
      this.reassignedBy !== undefined &&
      this.reassignedBy.length > 0
    ) {
      this.reassignedBy.forEach(reassignmentBy => {
        assignedByPresent.push({
          label: reassignmentBy.label,
          value: {
            id: reassignmentBy.value,
            name: reassignmentBy.label,
            code: reassignmentBy.label
          }
        });
      });
      this.reassignedByList = assignedByPresent;
      const by = [];
      assignedByPresent.forEach(item => by.push(item.value));
      this.claimReassignmentGroup.get("reassignedByNam").setValue(by);
    }
  }

  exportExcel() {
    if (this.claimReassignmentGroup.invalid) {
      return;
    }
    const { reassignedByNam } = this.claimReassignmentGroup.value;
    this.currentReassignmentByName = this.mapReassignmentList(reassignedByNam);
    const payload = {
      reassignmentStartDate: this.getFormattedDate(
        this.currentActiveFrom,
        true
      ),
      reassignmentEndDate: this.getFormattedDate(this.currentActiveTo, true),
      reassignedByName: this.currentReassignmentByName
    };
    this.showSpinner = true;
    this.excelSubscription = this.claimReassignmentService
      .getReassignmentReportExcel(payload)
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
              "Claims Reassignment Report-" + dateString + ".xlsx"
            );
          } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute(
                "download",
                "Claims Reassignment Report-" + dateString + ".xlsx"
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
    const reassignmentStartDate = this.claimReassignmentGroup.get(
      "reassignmentStartDate"
    ).value;
    const reassignmentEndDate = this.claimReassignmentGroup.get(
      "reassignmentEndDate"
    ).value;
    const diffInMonths = this.getMonths(
      reassignmentStartDate,
      reassignmentEndDate
    );
    const isValid = diffInMonths > 6 ? false : true;
    if (!isValid) {
      this.claimReassignmentGroup.controls.reassignmentEndDate.setErrors({
        rangeError: true
      });
      this.claimReassignmentGroup.updateValueAndValidity();
    } else {
      this.claimReassignmentGroup.controls.reassignmentEndDate.setErrors(null);
      this.claimReassignmentGroup.updateValueAndValidity();
    }
    return isValid;
  }

  getMonths(reassignmentStartDate, reassignmentEndDate) {
    const diffInMonths =
      (reassignmentEndDate.getFullYear() -
        reassignmentStartDate.getFullYear()) *
        12 +
      (reassignmentEndDate.getMonth() - reassignmentStartDate.getMonth());
    return diffInMonths;
  }

  ngOnDestroy() {
    this.excelSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
    this.reassignedBySubscription.unsubscribe();
  }
}
