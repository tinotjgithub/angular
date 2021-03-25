import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ReportService } from "src/app/services/report/report.service";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Component({
  selector: "app-my-users",
  templateUrl: "./my-users.component.html"
})
export class MyUsersComponent implements OnInit, OnDestroy {
  @ViewChild("myUsersTable", { static: false }) myUsersTable;
  public userListForm: FormGroup;
  public today = new Date();
  public gridData: any[];
  public isDataPresent = false;
  leads: any[];
  leadList: any[];
  userList: any;
  cols: { field: string; header: string; visible: boolean }[];
  userGrpSubscription: any;
  reportSubscription: Subscription = new Subscription();
  public userId: string;
  public leadSubscription: Subscription = new Subscription();
  public userGroups: any[];
  status = "Active";
  selectedValues: any[] = [];
  @Input()
  fromTab: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private reportService: ReportService,
    private taskMgtService: TaskmanagementService,
    private datePipe: DatePipe,
    private authService: AuthenticationService
  ) {
    const defaultFrom = new Date("01-01-1970");
    this.userListForm = this.fb.group({
      activeFrom: [defaultFrom, [Validators.required]],
      activeTo: [this.today, [Validators.required]],
      status: ["Active", [Validators.required]],
      userGroup: [""],
      lead: [""]
    });
  }

  ngOnInit() {
    this.setCols();
    this.userId = "";
    const userID = this.authService.currentUserDetails;
    this.userId = userID ? userID.id : "";
    this.getUserGroupList();
    this.getLeadList();
  }

  getMyUserReport() {
    const {
      activeFrom,
      activeTo,
      status,
      lead,
      userGroup
    } = this.userListForm.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      status:
        status === "Active" ? "Active" : status === "All" ? "All" : "Inactive",
      userId: this.userId,
      leadUser: this.mapLead(lead),
      userGroup: userGroup.length === 0 ? {} : { groupId: userGroup }
    };
    this.status = status;
    this.isDataPresent = true;
    this.gridData = [];
    this.selectedValues = [];
    this.reportService.getMyUserReport(payload);
    this.gridData = this.reportService.myUsersResponse;
    this.reportSubscription = this.reportService
      .getMyUserReportListner()
      .subscribe((data: any) => {
        this.gridData = data;
        this.selectedValues = [...this.gridData];
        this.isDataPresent = this.gridData.length > 0 ? true : false;
        this.reportSubscription.unsubscribe();
      });
  }

  mapLead(lead) {
    let leads = {};
    if (lead && lead !== "" && lead !== null) {
      const leadUser = this.leadList.filter(
        l => l.value.toString() === lead.toString()
      );
      leads = leadUser[0];
    }
    return leads;
  }

  getLeadList() {
    this.leadList = [];
    this.taskMgtService.getLeadNames(this.userId, 1);
    this.leadList = this.taskMgtService.leadNamesResponse;
    this.leadSubscription = this.taskMgtService
      .getLeadNamesListner()
      .subscribe(data => {
        this.leadList = data;
        this.leadSubscription.unsubscribe();
      });
  }

  getUserGroupList() {
    this.reportService.getManagerUserGroups().subscribe(
      res => {
        if (res) {
          this.userGroups = [...res];
        } else {
          this.userGroups = [];
        }
      },
      err => {
        this.userGroups = [];
      }
    );
  }

  setCols() {
    this.cols = [
      { field: "slNo", header: "SI No.", visible: true },
      { field: "firstName", header: "First Name", visible: true },
      { field: "lastName", header: "Last Name", visible: true },
      { field: "userName", header: "User Name", visible: true },
      { field: "role", header: "Role", visible: true },
      { field: "status", header: "Status", visible: true },
      { field: "activeDate", header: "Active Date", visible: true },
      { field: "deactivateDate", header: "Deactive Date", visible: true },
      { field: "ldapOrLocal", header: "External/Local", visible: true },
      { field: "userGroup", header: "User Group", visible: true },
      { field: "managerName", header: "Manager Name", visible: true },
      { field: "leadName", header: "Claims Lead Name", visible: true },
      { field: "proficiency", header: "Proficiency", visible: true },
      { field: "userGroupTypes", header: "User Group Type", visible: true },
    ];
  }

  get getActiveFrom() {
    return this.userListForm.controls.activeFrom;
  }

  get getActiveTo() {
    return this.userListForm.controls.activeTo;
  }

  get getStatus() {
    return this.userListForm.controls.status;
  }

  get getUserGroup() {
    return this.userListForm.controls.userGroup;
  }

  get getLead() {
    return this.userListForm.controls.lead;
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
    this.getMyUserReport();
    if (this.myUsersTable && this.myUsersTable !== undefined) {
      this.myUsersTable.reset();
    }
  }

  exportExcel() {
    if (this.userListForm.invalid) {
      return;
    }
    const {
      activeFrom,
      activeTo,
      status,
      lead,
      userGroup
    } = this.userListForm.value;
    const payload = {
      fromDate: this.getFormattedDate(activeFrom, true),
      toDate: this.getFormattedDate(activeTo, true),
      status: status === "Active" ? true : status === "All" ? "All" : false,
      userId: this.userId,
      leadUser: this.mapLead(lead),
      userGroup: userGroup.length === 0 ? {} : { groupId: userGroup }
    };

    this.reportService.getUserListReports(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "info",
        message: "Report is being generated. Please wait."
      });
      const responseBody = res.body;
      const blob = new Blob([responseBody], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      const filename =
        this.status === "Active"
          ? "Active-" + dateString + ".xlsx"
          : this.status === "All"
          ? "All-" + dateString + ".xlsx"
          : "Inactive-" + dateString + ".xlsx";
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
  ngOnDestroy() {
    this.leadSubscription.unsubscribe();
  }
}
