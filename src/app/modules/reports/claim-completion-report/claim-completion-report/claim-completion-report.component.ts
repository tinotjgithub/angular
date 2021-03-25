import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ReportService } from "src/app/services/report/report.service";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { isNullOrUndefined } from "util";
@Component({
  selector: "app-claim-completion-report",
  templateUrl: "./claim-completion-report.component.html",
  styleUrls: ["./claim-completion-report.component.css"]
})
export class ClaimCompletionReportComponent implements OnInit {
  @ViewChild("claimCompletionTable", { static: false }) claimCompletionTable;
  public userListForm: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isDataPresent = false;
  examinerList: any[];
  cols: { field: string; header: string; visible: boolean }[];
  reportSubscription: Subscription = new Subscription();
  public userId: string;
  public examinerSubscription: Subscription = new Subscription();
  public userGroups: any[];
  selectedValues: any[] = [];
  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: ReportService,
    private authService: AuthenticationService
  ) {
    this.userListForm = this.fb.group({
      completedFrom: [this.today, [Validators.required]],
      completedTo: [this.today, [Validators.required]],
      userGroup: [[]],
      examiner: [[]]
    });
  }

  ngOnInit() {
    this.setCols();
    this.getUserGroupList();
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

  setCols() {
    this.cols = [
      { field: "slNo", header: "SI No.", visible: true },
      { field: "examinerName", header: "Examiner Name", visible: true },
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "claimType", header: "Claim Type", visible: true },
      { field: "claimStatus", header: "Claim Status", visible: true },
      {
        field: "promtCompletionDate",
        header: "PROMT Completion Date",
        visible: true
      },
      {
        field: "completionTimeTaken",
        header: "Time Taken To Complete",
        visible: true
      },
      { field: "promtStatus", header: "PROMT Status", visible: true },
      { field: "routeReason", header: "Complete & Route Remark", visible: true },
      { field: "receiptDate", header: "Receipt Date", visible: true },
      { field: "claimAge", header: "Claim Age (In Days)", visible: true },
      { field: "providerName", header: "Provider Name", visible: true },
      { field: "memberGroupName", header: "Member Group Name", visible: true },
      { field: "billedAmount", header: "Billed Amount($)", visible: true },
      { field: "allowedAmount", header: "Allowed Amount ($)", visible: true },
      {
        field: "totalPaidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      { field: "processedDate", header: "Processed Date", visible: true },
      { field: "userGroupName", header: "User Group Name", visible: true }
    ];
  }

  get getActiveFrom() {
    return this.userListForm.controls.completedFrom;
  }

  get getActiveTo() {
    return this.userListForm.controls.completedTo;
  }

  get getUserGroup() {
    return this.userListForm.controls.userGroup;
  }

  get getexaminer() {
    return this.userListForm.controls.examiner;
  }

  checkToDate() {
    if (
      this.getActiveTo.value &&
      this.getActiveTo.value < this.getActiveFrom.value
    ) {
      this.getActiveTo.reset();
    }
  }

  submit() {
    this.getCompletionReport();
    if (this.claimCompletionTable && this.claimCompletionTable !== undefined) {
      this.claimCompletionTable.reset();
    }
  }

  getUserGroupList() {
    this.reportService.getUserGrps().subscribe(
      res => {
        this.userGroups = res;
      },
      err => {
        this.userGroups = [];
      }
    );
  }

  getExaminerListAgainstUserGrp() {
    this.userListForm.get("examiner").reset();
    this.examinerList = [];
    const groupId = this.getUserGroup.value;
    if (groupId && groupId.length > 0) {
      this.reportService
        .getExaminerListAgainstUserGrp({
          groupId: groupId.map(el => {
            return el.groupId;
          })
        })
        .subscribe(
          res => {
            this.examinerList = res;
          },
          err => {
            this.examinerList = [];
          }
        );
    }
  }

  getParam() {
    const {
      completedFrom,
      completedTo,
      userGroup,
      examiner
    } = this.userListForm.value;
    const payload = {
      fromDate: this.getFormattedDate(completedFrom, true),
      toDate: this.getFormattedDate(completedTo, true),
      userGroupId:
        userGroup && userGroup.length > 0
          ? userGroup.map(el => {
              return el.groupId;
            })
          : [],
      examinerUser: isNullOrUndefined(examiner) ? [] : examiner
    };
    return payload;
  }

  getCompletionReport() {
    this.isDataPresent = true;
    this.gridData = [];
    this.selectedValues = [];
    this.reportService
      .getClaimCompletionReportGrid(this.getParam())
      .subscribe(data => {
        this.gridData = data;
        this.selectedValues = [...this.gridData];
        this.isDataPresent = this.gridData.length > 0 ? true : false;
      });
  }

  exportExcel() {
    if (this.userListForm.invalid) {
      return;
    }
    const { completedFrom, completedTo } = this.userListForm.value;
    const fromDate = this.getFormattedDate(completedFrom, true);
    const toDate = this.getFormattedDate(completedTo, true);

    this.reportService
      .getClaimCompletionReportExcel(this.getParam())
      .subscribe(res => {
        this.notifierService.throwNotification({
          type: "info",
          message: "Report is being generated. Please wait."
        });
        const responseBody = res.body;
        const blob = new Blob([responseBody], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const filename =
          "Claim Completion Report By Examiner-From-" +
          fromDate +
          "-To-" +
          toDate +
          ".xlsx";
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }
}
