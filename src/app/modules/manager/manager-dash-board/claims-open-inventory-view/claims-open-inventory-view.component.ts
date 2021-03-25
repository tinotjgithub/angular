import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-claims-open-inventory-view",
  templateUrl: "./claims-open-inventory-view.component.html",
  styleUrls: ["./claims-open-inventory-view.component.css"]
})
export class ClaimsOpenInventoryViewComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public editUser: any;
  public gridData: any[];
  targetSLA: number;
  targetSettingsFetchResponse: any;
  cols: { field: string; header: string; visible: boolean }[];
  text: string;
  currentId: string;
  public data: any[];
  public editMode: boolean;
  disabled = true;
  public addTarget: boolean;

  constructor(
    private taskManagementService: TaskmanagementService,
    private targetSettingsBuilder: FormBuilder,
    private notifierService: NotifierService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    let keys = Object.keys(this.editUser);
    let len = keys.length;
    this.editMode = this.editUser && len > 0 ? true : false;
    this.editMode ? this.getInventoryClaims() : "";
    this.editUser.type === "open-inventory"
      ? this.setSLACols()
      : this.setThresholdCols();
  }
  setThresholdCols() {
    this.cols = [
      { field: "id", header: "ID", visible: false },
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "claimAge", header: "Claim Age (In Days)", visible: true },
      {
        field: "nearingSlaDays",
        header: "Nearing Threshold SLA Days",
        visible: true
      },
      {
        field: "thresholdTime",
        header: "Threshold SLA Days",
        visible: true
      },
      {
        field: "status",
        header: "PROMT Status",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "claimType",
        header: "Claim Type",
        visible: true
      },
      {
        field: "billedAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      {
        field: "providerName",
        header: "Provider Name",
        visible: true
      },
      {
        field: "memberGroupName",
        header: "Member Group Name",
        visible: true
      }
    ];
  }
  setSLACols() {
    this.cols = [
      { field: "id", header: "ID", visible: false },
      { field: "claimId", header: "Claim ID", visible: true },
      { field: "claimAge", header: "Claim Age (In Days)", visible: true },
      { field: "nearingSlaDays", header: "Nearing SLA Days", visible: true },
      {
        field: "status",
        header: "PROMT Status",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      },
      {
        field: "claimType",
        header: "Claim Type",
        visible: true
      },
      {
        field: "billedAmount",
        header: "Billed Amount ($)",
        visible: true
      },
      {
        field: "allowedAmount",
        header: "Allowed Amount ($)",
        visible: true
      },
      {
        field: "paidAmount",
        header: "Paid Amount ($)",
        visible: true
      },
      {
        field: "providerName",
        header: "Provider Name",
        visible: true
      },
      {
        field: "memberGroupName",
        header: "Member Group Name",
        visible: true
      }
    ];
  }

  formatRequest(editUser) { 
    const age = editUser.age;
    let request = {};
    if (age === "<0") {
      request = { startDay: "0", endDay: "0", type: "lessThanZero" };
    } else if (age.includes(">")) {
      const day = age.split(">");
      request = { startDay: day[1], endDay: day[1], type: "greaterThanSLA" };
    } else if (!age.includes(">") && !age.includes("<") && !age.includes("-")) {
      request = { startDay: age, endDay: age, type: "single" };
    } else {
      const day = age.split("-");

      const firstRange = day[0];
      const secondRange = day[1];
      request = { startDay: firstRange, endDay: secondRange, type: "range" };
    }
    return request;
  }

  getInventoryClaims() {
    const request = this.formatRequest(this.editUser);
    this.taskManagementService.getInventoryClaims(request, this.editUser.type);
    this.gridData = this.taskManagementService.inventoryClaimsResponse;
    this.gridData = [];
    this.data = [];
    this.taskManagementService
      .getInventoryClaimsListner()
      .subscribe((res: any) => {
        if (res) {
          this.data = res;
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }

  exportExcel() {
    const reportName =
      this.editUser.type === "threshold-sla"
        ? "Claims Open Inventory Nearing threshold SLA-"
        : "Claims Open Inventory Nearing SLA-";
    const request = this.formatRequest(this.editUser);
    this.taskManagementService
      .getOpenInvReport(request, this.editUser.type)
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
        const today = new Date();
        const dateString = this.datePipe.transform(today, "MMddyyyy");
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, reportName + dateString + ".xlsx");
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", reportName + dateString + ".xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
  }
}
